'use client';
import Image from 'next/image';
import QRCode from 'react-qr-code';

export default function QrSaltboy({
	url = 'https://saltboy.store',
}: {
	url?: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-1 bg-white">
			<QRCode
				value={url}
				size={60} // 픽셀 크기
				level="H" // 오류 보정 (L/M/Q/H)
				bgColor="#ffffff"
				fgColor="#000000"
			/>
			<div className="flex items-center justify-center">
				<Image src="/icons/saltboy2.png" alt="SALTBOY" width={16} height={16} />
				<p className="text-center text-[10px]">SALTBOY</p>
			</div>
		</div>
	);
}
