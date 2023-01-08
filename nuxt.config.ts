// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	runtimeConfig: {
		public: {
			basePath: '127.0.0.1',
			serverKey: 'secret',
			port: 7350,
			timeoutMs: 60000,
			useSSL: false,
			autoRefreshSession: true,
		},
	},
	imports: {
		dirs: ['store'],
	},
	modules: [
		'nuxt-windicss',
		[
			'@pinia/nuxt',
			{
				autoImports: [
					'defineStore',
					'mapState',
					'mapGetters',
					'mapActions',
					'acceptHMRUpdate',
				],
			},
		],
	],
});
