'use client';

interface InfoMessageProps {
	type?: 'info' | 'warning' | 'success';
	title?: string;
	message: string;
	className?: string;
}

export default function InfoMessage({
	type = 'info',
	title,
	message,
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
			className={`flex flex-col gap-1 rounded-md border p-2 ${getTypeStyles()} ${className}`}
		>
			{title && (
				<span className={`text-sm font-medium ${getTitleStyles()}`}>
					{title}
				</span>
			)}
			<span className={`text-sm font-medium ${getMessageStyles()}`}>
				{message}
			</span>
		</div>
	);
}
