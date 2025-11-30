'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Stethoscope,
    Activity,
    Watch,
    ClipboardList,
    Video,
    User,
    LogOut
} from 'lucide-react';

const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Symptom Checker', icon: Stethoscope, href: '/symptom-checker' },
    { name: 'Health Analytics', icon: Activity, href: '/health-analytics' },
    { name: 'Wearables', icon: Watch, href: '/wearables' },
    { name: 'Health Plan', icon: ClipboardList, href: '/health-plan' },
    { name: 'Telehealth', icon: Video, href: '/telehealth' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    // Don't show sidebar on landing page
    if (pathname === '/') return null;

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 left-6 z-50 w-8 h-8 flex flex-col justify-center items-center group cursor-pointer"
                aria-label="Toggle Sidebar"
            >
                <span
                    className={`h-0.5 bg-white transition-all duration-300 ease-in-out absolute ${isOpen ? 'w-6 rotate-45' : 'w-6 -translate-y-1.5'
                        }`}
                />
                <span
                    className={`h-0.5 bg-white transition-all duration-300 ease-in-out absolute ${isOpen ? 'w-6 -rotate-45' : 'w-6 translate-y-1.5'
                        }`}
                />
            </button>

            <aside
                className={`${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
                    } bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col relative z-20 font-mono transition-all duration-500 ease-in-out overflow-hidden`}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 pl-16 whitespace-nowrap">
                    <Link href="/" className="block cursor-pointer hover:opacity-80 transition-opacity">
                        <h1 className="text-xl font-bold text-white tracking-tighter">HealthAI<span className="font-light text-gray-400">Guardian</span></h1>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">User Dashboard</p>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-none border-l-2 transition-all duration-300 whitespace-nowrap ${isActive
                                    ? 'border-white bg-white/5 text-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={18} className="min-w-[18px]" />
                                <span className="text-sm tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-white/10 whitespace-nowrap">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center min-w-[32px] border border-white/10">
                                <User size={16} className="text-gray-400" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">John Doe</p>
                                <p className="text-[10px] text-gray-500 truncate">john@example.com</p>
                            </div>
                        </div>
                        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded transition-colors">
                            <LogOut size={14} className="min-w-[14px]" />
                            <span className="text-[10px] uppercase tracking-widest">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
