'use client';
import Image from 'next/image';
import QRCode from 'react-qr-code';

export default function QrSaltboy({
	url = 'https://saltboy.store/r/share',
}: {
	url?: string;
}) {
	const handleShare = async () => {
		if (navigator.share) {
			navigator
				.share({
					url: 'https://saltboy.store/r/share', // 또는 특정 이미지 주소
				})
				.then(() => console.log('✅ 공유 성공'))
				.catch((err) => console.error('❌ 공유 실패', err));
		} else {
			await navigator.clipboard.writeText('https://saltboy.store/r/share');
			alert('주소가 복사되었습니다 📋');
		}
	};

	return (
		<div className="flex w-full flex-1 items-center justify-center gap-4 bg-white">
			<div className="flex items-center justify-center">
				<div className="flex flex-col items-start justify-center text-[13px] text-black">
					<span>
						QR 코드를 <strong> Click </strong>하여 친구에게 공유해보세요
					</span>
					<span>카메라로 스캔하면 바로 계산기로 이동해요</span>
				</div>
			</div>
			<button onClick={handleShare}>
				<QRCode
					value={url}
					size={40} // 픽셀 크기
					level="H" // 오류 보정 (L/M/Q/H)
					bgColor="#ffffff"
					fgColor="#000000"
				/>
			</button>
		</div>
	);
}
