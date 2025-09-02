'use client';
import '@ant-design/v5-patch-for-react-19'; // <-- 여기!
import { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
	return <>{children}</>;
}
