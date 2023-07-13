import {Inter} from "next/font/google"

import type {ReactElement} from "react"

import "./globals.css"

// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({subsets: ["latin"]})

export default function RootLayout({children}: {children: React.ReactNode}): ReactElement | null {
	return (
		<html lang="en" className="bg-black leading-none">
			<body className={inter.className}>{children}</body>
		</html>
	)
}
