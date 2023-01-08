export const useMain = defineStore("main", {})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMain, import.meta.hot))
}
