'use client';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import React from 'react';

interface AddProductProps {
	formData: {
		name: string;
		price: string;
		quantity: string;
		discountValue: string;
		discountType: '원' | '%';
		isDiscount: boolean;
	};
	setFormData: React.Dispatch<
		React.SetStateAction<AddProductProps['formData']>
	>;
	onSubmit: () => void;
	onCancel: () => void;
	isEditMode?: boolean;
}

export default function AddProduct({
	formData,
	setFormData,
	onSubmit,
	onCancel,
	isEditMode = false,
}: AddProductProps) {
	const handleSubmit = () => {
		onSubmit();
	};

	return (
		<div className="flex flex-col items-start gap-5">
			<Form className="flex flex-col gap-4 p-2" onFinish={handleSubmit}>
				<div className="flex flex-col gap-1">
					<span>상품명</span>
					<Input
						className="rounded-sm border border-blue-500"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="상품명을 입력하세요"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<span>
						단가<span className="text-red-500"> *</span>
					</span>
					<Input
						type="number"
						className="rounded-sm border border-blue-500"
						value={formData.price}
						onChange={(e) =>
							setFormData({ ...formData, price: e.target.value })
						}
						placeholder="단가를 입력하세요"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<span>
						수량<span className="text-red-500"> *</span>
					</span>
					<Input
						type="number"
						className="rounded-sm border border-blue-500"
						value={formData.quantity}
						onChange={(e) =>
							setFormData({ ...formData, quantity: e.target.value })
						}
						placeholder="수량을 입력하세요"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<span>추가 할인</span>
					<div className="flex justify-between gap-1">
						<Input
							type="number"
							className="rounded-sm border border-blue-500"
							value={formData.discountValue}
							onChange={(e) =>
								setFormData({ ...formData, discountValue: e.target.value })
							}
							placeholder={
								formData.discountType === '원' ? '할인금액' : '할인율'
							}
						/>
						<Select
							className="w-20"
							value={formData.discountType}
							onChange={(value) =>
								setFormData({
									...formData,
									discountType: value as '원' | '%',
								})
							}
						>
							<Select.Option value="원">원</Select.Option>
							<Select.Option value="%">%</Select.Option>
						</Select>
					</div>
				</div>
				<div className="flex flex-col gap-0.5">
					<div className="flex gap-2">
						<Checkbox
							checked={formData.isDiscount}
							onChange={(e) =>
								setFormData({ ...formData, isDiscount: e.target.checked })
							}
						/>
						<span>할인 제외 품목</span>
					</div>
					<span className="text-xs text-red-400">
						⚠️ 1+1, 2+1 등 이벤트 상품 및 주류, 담배 등은 멤버쉽 할인 대상이
						아닙니다
					</span>
				</div>
				<div className="flex justify-between gap-2">
					<Button className="w-full" onClick={onCancel}>
						취소하기
					</Button>
					<Button className="w-full" type="primary" htmlType="submit">
						{isEditMode ? '수정하기' : '추가하기'}
					</Button>
				</div>
			</Form>
		</div>
	);
}
