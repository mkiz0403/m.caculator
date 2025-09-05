'use client';
import { DownOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import { ReactNode } from 'react';

interface DropdownItem {
	key: string;
	label: string;
	onClick?: () => void;
}

interface CustomDropdownProps {
	label?: string;
	items: DropdownItem[];
	placeholder?: string;
	width?: string;
	onSelect?: (key: string) => void;
	children?: ReactNode;
	className?: string;
}

// 단일 드롭다운 컴포넌트
export function SingleDropdown({
	items,
	placeholder = '선택하세요',
	onSelect,
	children,
	width,
}: CustomDropdownProps) {
	// Ant Design의 MenuProps 형식으로 변환
	const menuItems: MenuProps['items'] = items.map((item) => ({
		key: item.key,
		label: item.label,
		onClick: () => {
			item.onClick?.();
			onSelect?.(item.label);
		},
	}));

	return (
		<Dropdown menu={{ items: menuItems }} trigger={['click']}>
			<Button
				className={`custom-select ${width}`}
				size="middle"
				style={{ height: '36px' }}
			>
				<div className="flex w-full min-w-0 items-center justify-between">
					<span className="block min-w-0 truncate">
						{children || placeholder}
					</span>
					<DownOutlined />
				</div>
			</Button>
		</Dropdown>
	);
}

// 한 쌍의 드롭다운을 관리하는 컴포넌트
interface PairDropdownProps {
	firstLabel: string;
	secondLabel?: string;
	firstItems: DropdownItem[];
	secondItems: DropdownItem[];
	firstPlaceholder: string;
	secondPlaceholder: string;
	firstWidth?: string;
	secondWidth?: string;
	onFirstSelect?: (key: string) => void;
	onSecondSelect?: (key: string) => void;
	firstChildren?: ReactNode;
	secondChildren?: ReactNode;
	showSecond?: boolean;
	onReset?: () => void;
	className?: string;
}

export function PairDropdown({
	secondLabel,
	firstItems,
	secondItems,
	firstPlaceholder,
	secondPlaceholder,
	firstWidth = 'w-28',
	secondWidth = 'w-full',
	onFirstSelect,
	onSecondSelect,
	firstChildren,
	secondChildren,
	showSecond = true,
	onReset,
}: PairDropdownProps) {
	return (
		<div className="flex w-full max-w-[340px] flex-col items-start gap-2">
			<div className="flex w-full items-center gap-1">
				<div className="min-w-0 flex-shrink-0">
					<SingleDropdown
						items={firstItems}
						placeholder={firstPlaceholder}
						width={firstWidth}
						onSelect={onFirstSelect}
					>
						{firstChildren}
					</SingleDropdown>
				</div>

				{/* 두 번째 드롭다운 - 남은 공간 모두 사용 */}
				{showSecond && (
					<div className="min-w-0 flex-1">
						<SingleDropdown
							label={secondLabel}
							items={secondItems}
							placeholder={secondPlaceholder}
							width={secondWidth}
							onSelect={onSecondSelect}
						>
							{secondChildren}
						</SingleDropdown>
					</div>
				)}

				{/* 초기화 버튼 - 고정 크기 */}
				<div className="flex-shrink-0">
					<Button
						onClick={onReset}
						type="primary"
						ghost={true}
						size="middle"
						className="custom-select w-6"
						style={{ background: 'white', border: '1px solid #D9D9D9' }}
					>
						<RedoOutlined />
					</Button>
				</div>
			</div>
		</div>
	);
}

// 기본 export는 SingleDropdown으로 유지 (기존 코드 호환성)
export default SingleDropdown;
