import type { Metadata } from 'next';
import Providers from './common/Providers';
import './globals.css';
import GoogleAnalytics from './utils/GoogleAnalytics';
// import { AppUtilsProvider } from "../app/context/AuthContext";

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: 'cover',
};

export const metadata: Metadata = {
	title: '자린고비 계산기',
	appleWebApp: {
		capable: true,
		title: '자린고비 계산기',
		statusBarStyle: 'default',
		startupImage: [
			{
				url: '/icons/save-192x192.png',
				media: '(device-width: 320px) and (device-height: 568px)',
			},
			{
				url: '/icons/save-192x192.png',
				media: '(device-width: 375px) and (device-height: 667px)',
			},
			{
				url: '/icons/save-192x192.png',
				media: '(device-width: 414px) and (device-height: 736px)',
			},
			{
				url: '/icons/save-192x192.png',
				media: '(device-width: 375px) and (device-height: 812px)',
			},
			{
				url: '/icons/save-192x192.png',
				media: '(device-width: 414px) and (device-height: 896px)',
			},
		],
	},
	description: '앱을 통해 멤버쉽 할인과 카드 할인을 효율적으로 사용하세요',
	icons: [
		{ rel: 'icon', url: '/icons/save-192x192.png' },
		{
			rel: 'apple-touch-icon',
			url: '/icons/save-192x192.png',
			sizes: '192x192',
		},
		{
			rel: 'apple-touch-icon',
			url: '/icons/save-512x512.png',
			sizes: '512x512',
		},
	],
	manifest: '/manifest.json',
	other: {
		'mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-status-bar-style': 'default',
		'apple-mobile-web-app-title': 'Kicky',
		'google-site-verification': 'kfhTAwt898PHjLHAtEM00_iiGfO96HSV3vXAtQblB7M',
		'naver-site-verification': 'eb04d1e2f6bacb35aed2e101935974f302d390fd',
		// 카카오톡 전용 메타데이터
		// 	'og:image': '',
		// 	'og:image:width': '1200',
		// 	'og:image:height': '630',
		// 	'og:image:type': 'image/png',
		// 	'og:image:secure_url': '',
		// 	'og:site_name': '자린고비 계산기',
		// 	'og:locale': 'ko_KR',
		// 	'og:type': 'website',
	},
	// openGraph: {
	// 	title: '자린고비 계산기',
	// 	description: '앱을 통해 멤버쉽 할인과 카드 할인을 효율적으로 사용하세요',
	// 	url: '', // 배포 URL
	// 	siteName: '자린고비 계산기',
	// 	images: [
	// 		{
	// 			url: ''
	// 			width: 1200,
	// 			height: 630,
	// 			alt: '자린고비 계산기 OG Image',
	// 		},
	// 	],
	// 	type: 'website',
	// },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<body className="h-full bg-white">
				<GoogleAnalytics />
				<div className="flex h-full w-full bg-white">
					<div className="mx-auto flex h-full w-full max-w-[580px] min-w-[320px] flex-col items-start overflow-hidden p-0 text-xs text-black">
						<Providers>{children}</Providers>
					</div>
				</div>
				{/* </AppUtilsProvider> */}
			</body>
		</html>
	);
}
