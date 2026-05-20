"use client"

import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function ResponsiveShell({ children, serverRoles }: { children: React.ReactNode; serverRoles?: string[] }) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="min-h-screen flex">
			<Sidebar userRoles={serverRoles} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="flex-1 flex flex-col">
				<Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
				<main className="p-4">{children}</main>
			</div>
		</div>
	)
}
