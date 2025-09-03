'use client';

import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Modal, Space, message } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AddProduct from './AddProduct';
interface Product {
	id: string;
	name?: string;
	price: number;
	quantity: number;
	discountValue: number;
	discountType: '원' | '%';
	isDiscount: boolean;
}

export default function Receipt() {
	const [mDiscount, setMDiscount] = useState<'none' | 'sevenEarth' | 'sevenT'>(
		'none',
	);
	const [cardDiscount, setCardDiscount] = useState<
		'none' | 'theMoa' | 'HDzero'
	>('none');
	const [products, setProducts] = useState<Product[]>([]); // 상품 담을곳
	const [formData, setFormData] = useState({
		name: '',
		price: '',
		quantity: '',
		discountValue: '',
		discountType: '원' as '원' | '%',
		isDiscount: false as boolean,
	});
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);

	const [isOpenDetailInputModal, setIsOpenDetailInput] = useState(false);

	// --- LocalStorage Persist Keys ---
	const STORAGE = {
		products: 'receipt.products.v1',
		mDiscount: 'receipt.mdiscount.v1',
		cardDiscount: 'receipt.carddiscount.v1',
	} as const;

	// 초기 로드: localStorage → 상태 복원
	useEffect(() => {
		try {
			const p = localStorage.getItem(STORAGE.products);
			const md = localStorage.getItem(STORAGE.mDiscount);
			const cd = localStorage.getItem(STORAGE.cardDiscount);

			if (p) {
				const parsed = JSON.parse(p);
				if (Array.isArray(parsed)) {
					// 타입 가드: 최소 필드 확인
					const safe = parsed.filter(
						(item) =>
							item &&
							typeof item.id === 'string' &&
							typeof item.price === 'number' &&
							typeof item.quantity === 'number' &&
							typeof item.discountValue === 'number' &&
							(item.discountType === '원' || item.discountType === '%') &&
							typeof item.isDiscount === 'boolean',
					);
					setProducts(safe as Product[]);
				}
			}
			if (md === 'none' || md === 'sevenEarth' || md === 'sevenT') {
				setMDiscount(md as typeof mDiscount);
			}
			if (cd === 'none' || cd === 'theMoa' || cd === 'HDzero') {
				setCardDiscount(cd as typeof cardDiscount);
			}
		} catch (e) {
			console.error('Failed to load from localStorage', e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 변경 시: 상태 → localStorage 저장
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE.products, JSON.stringify(products));
			localStorage.setItem(STORAGE.mDiscount, mDiscount);
			localStorage.setItem(STORAGE.cardDiscount, cardDiscount);
		} catch (e) {
			console.error('Failed to save to localStorage', e);
		}
	}, [products, mDiscount, cardDiscount]);

	const showDtailModalModal = () => {
		setIsOpenDetailInput(true);
	};

	const mDiscountMenu: MenuProps = {
		items: [
			{ key: 'none', label: '없음' },
			{ key: 'sevenEarth', label: '세븐(우주)' },
			{ key: 'sevenT', label: '세븐(T할인)' },
		],
		onClick: ({ key }) => {
			if (key === 'none' || key === 'sevenEarth' || key === 'sevenT') {
				setMDiscount(key);
			}
		},
	};

	const cardDiscountMenu: MenuProps = {
		items: [
			{ key: 'none', label: '없음' },
			{ key: 'theMoa', label: '더모아' },
			{ key: 'HDzero', label: '현대Zero' },
		],
		onClick: ({ key }) => {
			if (key === 'none' || key === 'theMoa' || key === 'HDzero') {
				setCardDiscount(key);
			}
		},
	};

	const createProducts = () => {
		if (!formData.price || !formData.quantity) {
			message.error('단가와 수량을 입력해주세요.');
			return;
		}
		const price = parseInt(formData.price);
		const quantity = parseInt(formData.quantity);
		const discountValue = formData.discountValue
			? parseInt(formData.discountValue)
			: 0;

		const newProduct: Product = {
			id: Date.now().toString(),
			name: formData.name || '이름없음',
			price: price,
			quantity: quantity,
			discountValue: discountValue,
			discountType: formData.discountType,
			isDiscount: formData.isDiscount,
		};

		setProducts([...products, newProduct]);
		resetForm();
		setIsOpenDetailInput(false);
		message.success('상품이 추가되었습니다.');
	};

	// 상품 수정 함수
	const handleEditProduct = (product: Product) => {
		setEditingProduct(product);
		setFormData({
			name: product.name || '',
			price: product.price.toString(),
			quantity: product.quantity.toString(),
			discountValue: product.discountValue.toString(),
			discountType: product.discountType,
			isDiscount: product.isDiscount,
		});
		setIsEditMode(true);
		setIsOpenDetailInput(true);
	};

	// 상품 업데이트 함수
	const updateProduct = () => {
		if (!editingProduct) return;
		if (!formData.price || !formData.quantity) {
			message.error('단가와 수량을 입력해주세요.');
			return;
		}

		const price = parseInt(formData.price);
		const quantity = parseInt(formData.quantity);
		const discountValue = formData.discountValue
			? parseInt(formData.discountValue)
			: 0;

		const updatedProduct: Product = {
			...editingProduct,
			name: formData.name || '상품',
			price: price,
			quantity: quantity,
			discountValue: discountValue,
			discountType: formData.discountType,
			isDiscount: formData.isDiscount,
		};

		setProducts(
			products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)),
		);
		resetForm();
		setIsOpenDetailInput(false);
		setIsEditMode(false);
		setEditingProduct(null);
		message.success('상품이 수정되었습니다.');
	};

	// 상품 삭제 함수
	const handleDeleteProduct = (productId: string) => {
		Modal.confirm({
			title: '상품 삭제',
			content: '이 상품을 삭제하시겠습니까?',
			okText: '삭제',
			cancelText: '취소',
			okButtonProps: { danger: true },
			centered: true,
			onOk() {
				setProducts(products.filter((p) => p.id !== productId));
				message.success('상품이 삭제되었습니다.');
			},
		});
	};

	const resetForm = () => {
		setFormData({
			name: '',
			price: '',
			quantity: '',
			discountValue: '',
			discountType: '원' as '원' | '%',
			isDiscount: false as boolean,
		});
	};

	// 전체 초기화 (상태 + 저장소)
	const clearAllState = () => {
		// 상태 초기화
		setProducts([]);
		setMDiscount('none');
		setCardDiscount('none');
		setIsOpenDetailInput(false);
		setIsEditMode(false);
		setEditingProduct(null);
		resetForm();

		// 로컬스토리지 초기화
		try {
			localStorage.removeItem(STORAGE.products);
			localStorage.removeItem(STORAGE.mDiscount);
			localStorage.removeItem(STORAGE.cardDiscount);
		} catch (e) {
			console.error('Failed to clear localStorage', e);
		}
	};

	// 초기화 안내 모달 + 확인 시 전체 초기화
	const confirmResetAll = () => {
		Modal.confirm({
			title: '전체 초기화',
			content: `모든 상품과 선택한 할인 설정을 초기화합니다. \n 모든 설정을 초기화 하시겠습니까? `,
			okText: '초기화',
			cancelText: '취소',
			okButtonProps: { danger: true },
			centered: true,
			onOk() {
				clearAllState();
				message.success('전체 상태를 초기화했어요.');
			},
		});
	};

	const handleCancel = () => {
		setIsOpenDetailInput(false);
		setIsEditMode(false);
		setEditingProduct(null);
		resetForm();
	};

	// 할인 금액 계산 함수 (상품별 할인)
	const calculateProductDiscount = (
		price: number,
		quantity: number,
		type: '원' | '%',
		value: number,
	): number => {
		const totalPrice = price * quantity;
		if (type === '원') {
			return Math.min(value * quantity, totalPrice);
		} else {
			return Math.floor((totalPrice * value) / 100);
		}
	};

	// 멤버쉽 할인 계산 함수
	const calculateMembershipDiscount = (
		totalAmount: number,
		discountType: 'sevenEarth' | 'sevenT',
	): number => {
		if (discountType === 'sevenEarth') {
			return Math.floor(totalAmount / 1000) * 300;
		} else if (discountType === 'sevenT') {
			return Math.floor(totalAmount / 1000) * 100;
		}
		return 0;
	};

	// 더모아 할인 계산 함수
	const calculateTheMoaDiscount = (totalAmount: number): number => {
		if (totalAmount < 5000) return 0;
		return totalAmount % 1000;
	};

	// 더모아 최대 할인 가능 금액 계산
	const calculateMaxTheMoaDiscount = (totalAmount: number): number => {
		if (totalAmount < 5000) return 0;
		const remainder = totalAmount % 1000;
		return 999 - remainder;
	};

	return (
		<div className="w-full overflow-y-auto px-2 pt-4 pb-24">
			<div className="min-h-full w-full rounded-md border-2 border-gray-300 p-4">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-center">
						<Image
							src="/icons/save-512x512.png"
							alt="자린고비 계산기"
							width={100}
							height={100}
						/>
					</div>
					<div className="flex flex-col">
						<div className="mt-4 flex justify-end">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<span className="text-sm">멤버쉽</span>
									<Dropdown menu={mDiscountMenu}>
										<Button className="w-28">
											<Space>
												{mDiscount === 'none'
													? '선택'
													: mDiscount === 'sevenEarth'
														? '세븐(우주)'
														: '세븐(T할인)'}
												<DownOutlined />
											</Space>
										</Button>
									</Dropdown>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm">카드</span>
									<Dropdown menu={cardDiscountMenu}>
										<Button className="w-28">
											<Space>
												{cardDiscount === 'none'
													? '선택'
													: cardDiscount === 'theMoa'
														? '더모아'
														: '현대제로'}
												<DownOutlined />
											</Space>
										</Button>
									</Dropdown>
								</div>
							</div>
							<div className="flex items-center gap-2"></div>
						</div>
						<div className="border-b border-dashed border-gray-500 pt-6 pb-4">
							<div className="mb-2 flex items-start justify-between">
								<span className="text-sm font-bold">적용된 할인</span>
							</div>
							{(() => {
								const discounts = [];
								if (mDiscount && mDiscount !== 'none') {
									if (mDiscount === 'sevenEarth')
										discounts.push(
											'세븐(우주패스) 멤버쉽 할인 적용중이에요 🚀(1,000원당 300원 할인)',
										);
									if (mDiscount === 'sevenT')
										discounts.push(
											'세븐(T할인) 멤버쉽 할인 적용중이에요 💰(1,000원당 100원 할인)',
										);
								}
								if (cardDiscount && cardDiscount !== 'none') {
									if (cardDiscount === 'theMoa')
										discounts.push(
											'더모아 카드할인이 적용중이에요 💳 (5,000원 이상 결제 시, 999원 이하 포인트 지급)',
										);
									if (cardDiscount === 'HDzero')
										discounts.push(
											'현대제로 카드할인이 적용중이에요 💳 (결제금액 7% 청구할인)',
										);
								}
								return discounts.length > 0 ? (
									<div className="flex flex-col gap-1 text-sm text-blue-500">
										{discounts.map((discount) => (
											<span key={discount}>✅ {discount}</span>
										))}
									</div>
								) : (
									<span className="text-sm text-gray-500">
										적용중인 할인이 없어요 🥲
									</span>
								);
							})()}
						</div>
						<table
							className="w-full border-separate border-none border-blue-500 py-2 text-xs"
							style={{ borderSpacing: '0 12px' }}
						>
							<thead className="sticky top-0 z-10 bg-white">
								<tr className="border-b border-dashed border-gray-500">
									<th className="border-none border-blue-500 text-left font-bold">
										상품명
									</th>
									<th className="w-1/7 border-none border-blue-500 text-center font-bold">
										단가
									</th>
									<th className="w-1/8 border-none border-blue-500 text-center font-bold">
										수량
									</th>
									<th className="w-1/7 border-none border-blue-500 text-center font-bold">
										할인
									</th>
									<th className="w-1/7 border-none border-blue-500 text-center font-bold">
										금액
									</th>
									<th className="w-1/4 border-none border-blue-500 text-center font-bold">
										수정 / 삭제
									</th>
								</tr>
							</thead>
							<tbody>
								{products.map((product) => {
									const totalPrice = product.price * product.quantity;

									// 상품별 할인 금액
									const productDiscountAmount = calculateProductDiscount(
										product.price,
										product.quantity,
										product.discountType,
										product.discountValue,
									);

									// 멤버쉽 할인 금액
									// ⚠️ 할인 제외 품목이거나 추가 할인이 적용된 상품은 멤버쉽 할인 적용 안됨
									const membershipDiscountAmount =
										!product.isDiscount &&
										mDiscount !== 'none' &&
										product.discountValue === 0
											? calculateMembershipDiscount(totalPrice, mDiscount)
											: 0;

									// 총 할인 금액
									const totalDiscountAmount =
										productDiscountAmount + membershipDiscountAmount;

									// 최종 가격
									const finalPrice = Math.max(
										0,
										totalPrice - totalDiscountAmount,
									);

									return (
										<tr key={product.id} className="text-xs">
											<td className="border-none border-blue-500 text-left font-bold">
												{product.name || '상품'}
											</td>
											<td className="border-none border-blue-500 text-center">
												{product.price.toLocaleString()}
											</td>
											<td className="border-none border-blue-500 text-center">
												{product.quantity}
											</td>
											<td className="border-none border-blue-500 text-center">
												<div className="flex flex-col gap-1">
													{/* 상품별 할인 (추가 할인) */}
													{product.discountValue > 0 && (
														<span className="text-xs">
															{product.discountType === '원'
																? `${product.discountValue.toLocaleString()}`
																: `${product.discountValue}%`}
														</span>
													)}

													{/* 멤버쉽 할인 (할인 제외 품목이 아니고 추가 할인이 0인 경우만) */}
													{!product.isDiscount &&
														mDiscount !== 'none' &&
														product.discountValue === 0 &&
														membershipDiscountAmount > 0 && (
															<span className="text-xs text-blue-500">
																{membershipDiscountAmount.toLocaleString()}
															</span>
														)}
												</div>
											</td>
											<td className="border-none border-blue-500 text-center">
												{finalPrice.toLocaleString()}
											</td>
											<td className="border-none border-blue-500 text-center">
												<div className="flex justify-center gap-1">
													<button
														onClick={() => handleEditProduct(product)}
														className="rounded-sm bg-blue-300 px-2 py-1 text-center text-white"
													>
														수정
													</button>
													<button
														onClick={() => handleDeleteProduct(product.id)}
														className="rounded-sm bg-red-300 px-2 py-1 text-center text-white"
													>
														삭제
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						<>
							<div className="border-t border-dashed border-gray-500 py-4">
								<div className="flex flex-col gap-2">
									{(() => {
										// 할인 적용 상품 (할인 제외 품목이 아닌 상품)
										const excludedProducts = products.filter(
											(p) => !p.isDiscount,
										);
										const excludedTotal = excludedProducts.reduce(
											(sum, p) => sum + p.price * p.quantity,
											0,
										);

										// 할인 제외 상품 (할인 제외 품목으로 체크된 상품)
										const includedProducts = products.filter(
											(p) => p.isDiscount,
										);
										const includedTotal = includedProducts.reduce(
											(sum, p) => sum + p.price * p.quantity,
											0,
										);

										// 상품별 할인 총액
										const productDiscountTotal = products.reduce((sum, p) => {
											if (p.discountValue > 0) {
												return (
													sum +
													calculateProductDiscount(
														p.price,
														p.quantity,
														p.discountType,
														p.discountValue,
													)
												);
											}
											return sum;
										}, 0);

										// 멤버쉽 할인 총액
										// ⚠️ 할인 제외 품목이거나 추가 할인이 적용된 상품은 멤버쉽 할인 적용 안됨
										const membershipDiscountTotal =
											excludedProducts.length > 0 && mDiscount !== 'none'
												? excludedProducts.reduce((sum, product) => {
														// 🚫 멤버쉽 할인 제외 조건:
														// 1. 할인 제외 품목 (product.isDiscount = true)
														// 2. 추가 할인이 적용된 상품 (product.discountValue > 0)
														if (
															product.isDiscount ||
															product.discountValue > 0
														) {
															return sum; // 멤버쉽 할인 제외
														}

														// ✅ 멤버쉽 할인 적용 조건:
														// - 할인 제외 품목이 아님 (product.isDiscount = false)
														// - 추가 할인이 없음 (product.discountValue = 0)
														return (
															sum +
															calculateMembershipDiscount(
																product.price * product.quantity,
																mDiscount,
															)
														);
													}, 0)
												: 0;

										// 총 결제 금액 (더모아 할인 제외)
										const totalPaymentBeforeTheMoa =
											includedTotal +
											excludedTotal -
											productDiscountTotal -
											membershipDiscountTotal;

										// 더모아 할인 (총결제 금액 기준)
										const theMoaDiscount =
											cardDiscount === 'theMoa'
												? calculateTheMoaDiscount(totalPaymentBeforeTheMoa)
												: 0;

										// 더모아 최대 할인 가능 금액
										const maxTheMoaDiscount =
											cardDiscount === 'theMoa'
												? calculateMaxTheMoaDiscount(totalPaymentBeforeTheMoa)
												: 0;

										// 최종 총 결제 금액
										const totalPayment = totalPaymentBeforeTheMoa;

										return (
											<>
												<div className="flex justify-between text-sm">
													<span className="text-gray-400">상품 총 수량: </span>
													<span>
														{products.reduce((sum, p) => sum + p.quantity, 0)}개
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-gray-400">
														할인 제외 상품 총액:{' '}
													</span>
													<span>{excludedTotal.toLocaleString()}원</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-gray-400">
														할인 적용 상품 총액:{' '}
													</span>
													<span>{includedTotal.toLocaleString()}원</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-gray-400">
														할인 적용 금액 (일반):{' '}
													</span>
													<span className="text-gray-900">
														(-) {productDiscountTotal.toLocaleString()}원
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-gray-400">
														할인 적용 금액 (멤버쉽):{' '}
													</span>
													<span className="text-blue-500">
														(-) {membershipDiscountTotal.toLocaleString()}원
													</span>
												</div>
												<div className="flex justify-between text-lg text-blue-500">
													<span className="text-gray-900">총 결제 금액: </span>
													<span className="text-red-400">
														{totalPayment.toLocaleString()}원
													</span>
												</div>
												{cardDiscount === 'theMoa' && (
													<>
														<div className="flex justify-between text-sm">
															<span className="text-gray-400">
																더모아 할인 금액:
															</span>
															<span className="text-blue-500">
																(-) {theMoaDiscount.toLocaleString()}원
															</span>
														</div>
														{maxTheMoaDiscount > 0 && (
															<div className="flex flex-col gap-1 rounded-md border border-blue-400 p-2">
																<span className="text-sm text-gray-900">
																	잠깐‼️
																</span>
																<span className="text-sm text-blue-500">
																	뒷자리 {maxTheMoaDiscount.toLocaleString()}원
																	한도내에서 추가 상품 구매를 하면 최대할인을
																	받을 수 있어요😀
																</span>
															</div>
														)}
													</>
												)}

												{/* 5000원 행복 안내 메시지 */}
												{cardDiscount === 'theMoa' &&
													totalPayment >= 4000 &&
													totalPayment < 5000 && (
														<div className="flex flex-col gap-1 rounded-md border border-blue-400 p-2">
															<span className="text-sm text-gray-900">
																잠깐‼️
															</span>

															<span className="text-sm font-medium text-blue-500">
																{5999 - totalPayment}원 추가 구매 시 5,000원의
																행복을 누릴 수 있어요 🎉
															</span>
														</div>
													)}
												{cardDiscount === 'HDzero' && (
													<div className="flex flex-col gap-1 rounded-md border border-blue-400 p-2">
														<span className="text-sm font-medium text-blue-500">
															현대 제로카드 결제 시{' '}
															{Math.floor(totalPayment * 0.07).toLocaleString()}
															원을 청구할인 받을 수 있어요 🎉
														</span>
													</div>
												)}
											</>
										);
									})()}
								</div>
							</div>
							<Modal
								title={isEditMode ? '상품 수정하기' : '상품 추가하기'}
								open={isOpenDetailInputModal}
								onCancel={handleCancel}
								footer={null}
								width={420}
								centered={true}
							>
								<AddProduct
									formData={formData}
									setFormData={setFormData}
									onSubmit={isEditMode ? updateProduct : createProducts}
									onCancel={handleCancel}
									isEditMode={isEditMode}
									mDiscount={mDiscount}
								/>
							</Modal>
							<div className="fixed inset-x-0 bottom-0 z-50">
								<div className="mx-auto flex w-full max-w-[580px] gap-2 bg-white px-2 pt-1 pb-6">
									<button
										className="w-20 rounded-md bg-red-300 px-2 py-4 text-sm text-white"
										onClick={confirmResetAll}
									>
										초기화
									</button>
									<button
										className="w-full rounded-md bg-blue-500 px-6 py-4 text-sm text-white"
										onClick={showDtailModalModal}
									>
										상품 추가하기
									</button>
								</div>
							</div>
						</>
					</div>
				</div>
			</div>
		</div>
	);
}
