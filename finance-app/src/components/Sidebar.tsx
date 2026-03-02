"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Building,
    LayoutDashboard,
    CreditCard,
    Users,
    Settings,
    LogOut,
    Package
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const NAV_ITEMS = [
        { name: "Libro Mayor", href: "/", icon: LayoutDashboard },
        { name: "Proveedores", href: "#", icon: CreditCard, disabled: true },
        { name: "Inventario", href: "#", icon: Package, disabled: true },
        { name: "Planilla", href: "#", icon: Users, disabled: true },
        { name: "Configuración", href: "#", icon: Settings, disabled: true },
    ];

    return (
        <aside className="w-64 h-full border-r border-[rgba(255,255,255,0.05)] bg-[rgba(15,17,21,0.8)] backdrop-blur-xl flex flex-col hidden md:flex fixed top-0 left-0 z-40">
            {/* Brand Header */}
            <div className="p-6 flex items-center gap-3 border-b border-[rgba(255,255,255,0.05)]">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <Building size={24} />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight">Finanzas</h1>
                    <p className="text-xs text-secondary">Papelería Centro</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
                <p className="px-2 text-xs font-medium text-secondary/70 uppercase tracking-wider mb-2">Módulos</p>

                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                                    ? "bg-indigo-500/10 text-indigo-400"
                                    : "text-secondary hover:bg-[rgba(255,255,255,0.03)] hover:text-text-primary"}
                ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
                            onClick={(e) => item.disabled && e.preventDefault()}
                        >
                            <Icon size={18} className={isActive ? "text-indigo-400" : "opacity-70"} />
                            {item.name}
                            {item.disabled && <span className="ml-auto text-[10px] bg-white/5 py-0.5 px-1.5 rounded-full">Próximamente</span>}
                        </Link>
                    );
                })}
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                <button className="flex items-center gap-3 px-3 py-2 w-full text-secondary hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-[rgba(255,255,255,0.03)]">
                    <LogOut size={18} className="opacity-70" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
