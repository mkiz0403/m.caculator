'use client';

import { CheckCircleFilled } from '@ant-design/icons';

interface InfoMessageProps {
	type?: 'info' | 'warning' | 'success';
	title?: string;
	message: string;
	secondMessage?: string;
	className?: string;
}

export default function InfoMessage({
	type = 'info',
	title,
	message,
	secondMessage,
	className = '',
}: InfoMessageProps) {
	const getTypeStyles = () => {
		switch (type) {
			case 'warning':
				return 'border-orange-400 bg-orange-50';
			case 'success':
				return 'border-green-400 bg-green-50';
			default:
				return 'border-blue-400 bg-blue-50';
		}
	};

	const getTitleStyles = () => {
		switch (type) {
			case 'warning':
				return 'text-orange-600';
			case 'success':
				return 'text-green-600';
			default:
				return 'text-gray-900';
		}
	};

	const getMessageStyles = () => {
		switch (type) {
			case 'warning':
				return 'text-orange-600';
			case 'success':
				return 'text-green-600';
			default:
				return 'text-blue-500';
		}
	};

	return (
		<div
			className={`mt-2 mb-2 flex gap-1 rounded-md border p-2 ${getTypeStyles()} ${className}`}
		>
			{title ? (
				<div className="flex gap-1">
					<div
						className={`flex items-center gap-1 text-sm font-medium ${getTitleStyles()}`}
					>
						<CheckCircleFilled style={{ color: '#1677ff' }} />
						<strong className="text-blue-500">{title} : </strong>
					</div>
					<div
						className={`flex items-center justify-between text-sm font-medium ${getMessageStyles()}`}
						dangerouslySetInnerHTML={{ __html: message }}
					/>
					{secondMessage && (
						<div
							className={`flex items-center justify-between text-sm font-medium ${getMessageStyles()}`}
							dangerouslySetInnerHTML={{ __html: secondMessage }}
						/>
					)}
				</div>
			) : (
				<>
					<div className="flex w-full flex-col gap-1">
						<div
							className={`flex justify-between text-sm font-medium ${getMessageStyles()}`}
							dangerouslySetInnerHTML={{ __html: message }}
						/>
						{secondMessage && (
							<div
								className={`flex justify-between gap-2 text-sm font-medium ${getMessageStyles()}`}
								dangerouslySetInnerHTML={{ __html: secondMessage }}
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
}
