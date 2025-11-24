"use client";

import {
    BarChart03,
    Calendar,
    FileCheck02,
    Home05,
    LayoutGrid01,
    MessageChatSquare,
    Settings01,
    Users01,
} from "@untitledui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/utils/cx";

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
    { name: "Dashboard", href: "/app/dashboard", icon: Home05 },
    { name: "Leads", href: "/app/leads", icon: Users01 },
    { name: "Calendar", href: "/app/calendar", icon: Calendar },
    { name: "Quotes", href: "/app/quotes", icon: FileCheck02 },
    { name: "Messages", href: "/app/messages", icon: MessageChatSquare },
    { name: "SEO", href: "/app/seo", icon: BarChart03 },
    { name: "Reports", href: "/app/reports", icon: LayoutGrid01 },
    { name: "Settings", href: "/app/settings", icon: Settings01 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-col border-r border-sky-500/10 bg-slate-900/40 lg:flex">
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cx(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sky-500/10 text-sky-400"
                                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white",
                            )}
                        >
                            <Icon className="size-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-sky-500/10 p-4">
                <div className="rounded-lg bg-gradient-to-br from-sky-500/10 to-blue-500/10 p-4">
                    <p className="text-sm font-medium text-white">Need help?</p>
                    <p className="mt-1 text-xs text-slate-400">
                        Check out our documentation and support resources.
                    </p>
                    <button className="mt-3 text-xs font-medium text-sky-400 hover:text-sky-300">
                        View Docs →
                    </button>
                </div>
            </div>
        </aside>
    );
}
