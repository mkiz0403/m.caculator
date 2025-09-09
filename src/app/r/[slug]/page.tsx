import { redirect } from 'next/navigation';

const redirects: Record<string, string> = {
	//네이버 다모아999
	damoa999:
		'https://saltboy.store/?utm_source=cafe&utm_medium=community&utm_campaign=launch_share&utm_content=9hojin',
	//네이버 정가거부
	wjdrkrjqn:
		'https://saltboy.store/?utm_source=cafe&utm_medium=community&utm_campaign=launch_share&utm_content=wjdrkrjqn',
	//다모앙
	damoang:
		'https://saltboy.store/?utm_source=cafe&utm_medium=community&utm_campaign=launch_share&utm_content=damoang',
	//스레드
	thread:
		'https://saltboy.store/?utm_source=thread&utm_medium=social&utm_campaign=launch_share&utm_content=thread',
	//인스타
	instagram:
		'https://saltboy.store/?utm_source=instagram&utm_medium=social&utm_campaign=launch_share&utm_content=instagram',
	naverblog:
		'https://saltboy.store/?utm_source=naverblog&utm_medium=social&utm_campaign=launch_share&utm_content=naverblog',
};

export default async function RedirectPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const url = redirects[slug] ?? 'https://saltboy.store';
	redirect(url);
}
