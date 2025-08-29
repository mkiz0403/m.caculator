'use client';

import { use, useState } from 'react';
import Detail from './Detail';
import Nomal from './Nomal';

type Product = {
	name?: string;
	price: number;
	discountRate: number | undefined;
	discountCost: number;
	discount: boolean;
};

export default function Caculator() {
	const [type, setType] = useState<'normal' | 'detail'>('normal');
	const [productInfo, setProductInfo] = useState<Product>({
		price: 0,
		discountRate: undefined,
		discountCost: 0,
		discount: false,
	});

	const handleTypeChange = (newType: 'normal' | 'detail') => {
		setType(newType);
	};

	return (
		<div>
			<div className="flex min-h-screen flex-col items-center justify-center gap-10">
				<h1>멤버쉽 계산기 입니다.</h1>
				<div className="flex items-center justify-center gap-5">
					<span>계산기 타입을 선택해주세요</span>
					<button
						onClick={() => handleTypeChange('normal')}
						className="bg-amber-300"
					>
						Nomal
					</button>
					<button
						onClick={() => handleTypeChange('detail')}
						className="bg-emerald-300"
					>
						Detail
					</button>
				</div>
				{type === 'normal' ? (
					<Nomal />
				) : (
					<Detail productInfo={productInfo} setProductInfo={setProductInfo} />
				)}
				<div className="flex flex-col gap-2">
					<div className="flex-start flex gap-0.5">
						<span>M할인 제외 상품 : </span>
						<span> 10,000원</span>
					</div>
					<div className="flex-start flex gap-0.5">
						<span>M할인 적용 상품 : </span>
						<span>8,000원</span>
					</div>
					<div className="flex-start flex gap-0.5 text-red-500">
						<span>M할인 적용 금액 : </span>
						<span>-2,400원</span>
					</div>
					<div className="flex-start text-bold flex gap-0.5">
						<span>총 결제 금액 : </span>
						<span>-15,600원</span>
					</div>
					<div className="flex-start flex gap-0.5 text-blue-500">
						<span>더모아 할인 금액 : </span>
						<span>600원</span>
					</div>
					<span className="text-green-500">
						최대 뒷 자리 399원의 금액을 더 구매할 수 있습니다(ex. 1,399원
						2,399원)
					</span>
				</div>
			</div>
		</div>
	);
}
