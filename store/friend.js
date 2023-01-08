export const useFriend = defineStore("friend", {})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFriend, import.meta.hot))
}
