const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development', // 개발 환경에서는 PWA 비활성화
	register: true,
	skipWaiting: true,
});

const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ['@pqina/pintura', '@pqina/react-pintura'],
	// SSR 관련 설정
	experimental: {
		esmExternals: 'loose',
	},
	// 정적 내보내기 비활성화 (SSR 문제 해결)
	output: 'standalone',
	webpack(config: {
		module: { rules: { test: RegExp; issuer: RegExp; use: string[] }[] };
		resolve: { fallback: any };
	}) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack'],
		});

		config.resolve.fallback = {
			...config.resolve.fallback,
			canvas: false,
		};

		return config;
	},
};

module.exports = withPWA(nextConfig);
