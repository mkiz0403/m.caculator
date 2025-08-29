'use client';

type DetailProps = {
	productInfo: {
		name?: string;
		price: number;
		discountRate: number | undefined;
		discountCost: number;
		discount: boolean;
	};
	setProductInfo: React.Dispatch<
		React.SetStateAction<{
			name?: string | undefined;
			price: number;
			discountRate: number | undefined;
			discountCost: number;
			discount: boolean;
		}>
	>;
};

export default function Detail({ productInfo, setProductInfo }: DetailProps) {
	return (
		<div className="flex flex-col items-start gap-5">
			<h2>디테일 계산기</h2>
			<div className="flex flex-col gap-2 border border-blue-500 p-6">
				<div className="flex flex-col gap-1">
					<span>상품명</span>
					<input type="name" className="rounded-sm border border-blue-500" />
				</div>
				<div className="flex flex-col gap-1">
					<span>가격</span>
					<input type="price" className="rounded-sm border border-blue-500" />
				</div>
				<div className="flex flex-col gap-1">
					<span>할인율</span>
					<input
						type="discountRate"
						className="rounded-sm border border-blue-500"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<span>할인금액</span>
					<input
						type="discountCost"
						className="rounded-sm border border-blue-500"
					/>
				</div>
				<div className="flex gap-1">
					<span>할인여부</span>
					<input type="checkbox" id="scales" name="scales" />
				</div>
				<button className="rounded-sm bg-blue-300 px-4 py-2">추가하기</button>
			</div>
		</div>
	);
}
