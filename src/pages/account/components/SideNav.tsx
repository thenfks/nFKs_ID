import { Home, User, Shield, Key, Share2, CreditCard, Unplug } from 'lucide-react';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    color: string;
}

function SidebarItem({ icon, label, active, color }: SidebarItemProps) {
    return (
        <a href="#" className={`flex items-center gap-4 px-6 py-3 text-sm font-medium transition-colors w-full relative group ${active ? 'text-white bg-zinc-900' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${active ? 'text-white' : color}`}>
                {icon}
            </div>
            {label}
        </a>
    );
}

export function SideNav() {
    return (
        <aside className="w-[280px] flex-shrink-0 py-6 hidden md:block">
            <nav className="flex flex-col gap-1">
                <SidebarItem icon={<Home size={18} />} label="Home" active color="text-blue-400" />
                <SidebarItem icon={<User size={18} />} label="Personal info" color="text-red-500" />
                <SidebarItem icon={<Shield size={18} />} label="Data & privacy" color="text-blue-500" />
                <SidebarItem icon={<Key size={18} />} label="Security" color="text-yellow-500" />
                <SidebarItem icon={<Share2 size={18} />} label="People & sharing" color="text-green-500" />
                <SidebarItem icon={<CreditCard size={18} />} label="Payments & subs" color="text-orange-500" />
                <SidebarItem icon={<Unplug size={18} />} label="Connected Apps" color="text-purple-500" />
            </nav>
        </aside>
    );
}
