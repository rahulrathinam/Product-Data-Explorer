import './globals.css'
import type { Metadata } from 'next'
import { ReactQueryProvider } from '../providers/react-query-provider'
import { HistoryTracker } from '../providers/history-tracker'
import React from 'react'

export const metadata: Metadata = {
	title: 'Product Data Explorer',
	description: 'World of Books explorer',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<ReactQueryProvider>
					<HistoryTracker />
					{children}
				</ReactQueryProvider>
			</body>
		</html>
	)
}
