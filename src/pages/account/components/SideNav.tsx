import { Home, User, Shield, LockKeyhole, Share2, CreditCard, Unplug } from 'lucide-react';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    color: string;
    onClick?: () => void;
}

function SidebarItem({ icon, label, active, color, onClick }: SidebarItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 px-6 py-3 text-sm font-medium transition-colors w-full relative group text-left ${active ? 'text-white bg-zinc-900' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
        >
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${active ? 'text-white' : color}`}>
                {icon}
            </div>
            {label}
        </button>
    );
}

interface SideNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function SideNav({ activeTab, onTabChange }: SideNavProps) {
    return (
        <aside className="w-[280px] flex-shrink-0 py-6 hidden md:block">
            <nav className="flex flex-col gap-1">
                <SidebarItem
                    icon={<Home size={18} />}
                    label="Home"
                    active={activeTab === 'Home'}
                    color="text-blue-400"
                    onClick={() => onTabChange('Home')}
                />
                <SidebarItem
                    icon={<User size={18} />}
                    label="Personal info"
                    active={activeTab === 'Personal info'}
                    color="text-red-500"
                    onClick={() => onTabChange('Personal info')}
                />
                <SidebarItem icon={<Shield size={18} />} label="Data & privacy" active={activeTab === 'Data & privacy'} color="text-blue-500" onClick={() => onTabChange('Data & privacy')} />
                <SidebarItem icon={<LockKeyhole size={18} />} label="Security" active={activeTab === 'Security'} color="text-yellow-500" onClick={() => onTabChange('Security')} />
                <SidebarItem icon={<Share2 size={18} />} label="People & sharing" active={activeTab === 'People & sharing'} color="text-green-500" onClick={() => onTabChange('People & sharing')} />
                <SidebarItem icon={<CreditCard size={18} />} label="Payments & subs" active={activeTab === 'Payments & subs'} color="text-orange-500" onClick={() => onTabChange('Payments & subs')} />
                <SidebarItem icon={<Unplug size={18} />} label="Connected Apps" active={activeTab === 'Connected Apps'} color="text-purple-500" onClick={() => onTabChange('Connected Apps')} />
            </nav>
        </aside>
    );
}
