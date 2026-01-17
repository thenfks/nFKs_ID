import { useState } from 'react';
import { HelpCircle, LayoutPanelLeft } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { AppDrawer } from './AppDrawer';
import { AccountDrawer } from './AccountDrawer';

interface HeaderProps {
    user: User | null;
}

export function Header({ user }: HeaderProps) {
    const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
    const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

    // Get initial from email or metadata, fallback to M
    const initial = user?.email ? user.email[0].toUpperCase() : 'M';

    return (
        <div className="w-full px-6 py-3 flex items-center justify-between border-b border-zinc-900 sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm relative">
            <div className="flex items-center gap-2">
                <img src="/nfks_logo.png" alt="nFKs" className="w-6 h-6 rounded-md" />
                <span className="text-xl font-medium text-zinc-300">My nFKs ID</span>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                    <HelpCircle size={20} />
                </button>
                <button
                    className={`p-2 rounded-full transition-colors ${isAppDrawerOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                    onClick={() => setIsAppDrawerOpen(!isAppDrawerOpen)}
                >
                    <LayoutPanelLeft size={20} />
                </button>
                <button
                    className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium cursor-pointer ring-2 ring-[#0A0A0A] hover:opacity-90 transition-opacity"
                    onClick={() => setIsAccountDrawerOpen(!isAccountDrawerOpen)}
                >
                    {initial}
                </button>
            </div>

            <AppDrawer isOpen={isAppDrawerOpen} onClose={() => setIsAppDrawerOpen(false)} />
            <AccountDrawer isOpen={isAccountDrawerOpen} onClose={() => setIsAccountDrawerOpen(false)} user={user} />
        </div>
    );
}
