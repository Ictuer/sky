export default defineNuxtPlugin((nuxt) => {
  const config = useRuntimeConfig()
  useNakama().init(config.public)
})
