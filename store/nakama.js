import { Client } from "@heroiclabs/nakama-js"
import { useFriend } from "./friend"
import { useMain } from "./main"

let client
let socket

export const useNakama = defineStore("nakama", {
  state() {
    return {
      session: undefined,
      match: undefined,
    }
  },
  getters: {
    isMain() {
      return this.session?.user_id === this.match?.owner
    },
    currentStore() {
      return this.isMain ? useMain() : useFriend()
    },
  },
  actions: {
    init({ serverKey, basePath, port, useSSL, timeoutMs, autoRefreshSession }) {
      client = new Client(
        serverKey,
        basePath,
        port.toString(),
        useSSL,
        timeoutMs,
        autoRefreshSession
      )
      console.log("nakama inited")
    },

    async authenticate(email, password) {
      socket = client?.createSocket(false, false)
      this.session = await client?.authenticateEmail(email, password, true)
      for (const event of [
        "error",
        "disconnect",
        "notification",
        "matchData",
        "matchPresence",
        "matchMakerTicket",
        "matchMakerMatched",
        "party",
        "partyClose",
        "partyData",
        "partyJoinRequest",
        "partyleader",
        "partyPresence",
        "partyMatchMakerTicket",
        "statusPresence",
        "streamPresence",
        "streamData",
        "channelMessage",
        "channelPresence",
      ]) {
        socket["on" + event.toLowerCase()] = (data) => {
          console.log(data)
          const handler = this.isOwner ? ownerStore[event] : guestStore[event]
          if (handler instanceof Function) {
            handler(data)
          } else {
            console.error("no handler for event: ", event)
          }
        }
      }
      await socket?.connect(this.session, true)
      await this.joinMatch(this.session?.user_id)
    },
    async joinMatch(id) {
      if (this.match?.id === id) {
        return
      }
      this.match = await this.rpc("create_match", { id })
      const data = JSON.parse(this.match.data)
      delete this.match.data

      const router = useRouter()
      const ownerStore = useOwnerStore()
      const guestStore = useGuestStore()

      if (this.isOwner) {
        ownerStore.init(data)
        router.push({ name: "garden-owner-farm" })
      } else {
        guestStore.init(data)
        router.push({ name: "garden-guest-farm" })
      }
      socket.joinMatch(this.match.id)
    },
    rpc(id, input) {
      return client.rpc(this.session, id, input).then((res) => res.payload)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNakama, import.meta.hot))
}
