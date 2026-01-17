import { Search } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface MainContainerProps {
    user: User | null;
}

export function MainContainer({ user }: MainContainerProps) {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'nFKs User');
    const email = user?.email || 'user@example.com';
    const photoUrl = user?.user_metadata?.avatar_url || null;
    const initial = name && name !== 'nFKs User' ? name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'M');

    return (
        <main className="flex-1 px-8 pt-10 pb-2 flex flex-col items-center">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-10">
                <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-4xl font-normal relative mb-4 overflow-hidden">
                    {photoUrl ? (
                        <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        initial
                    )}
                </div>
                <h1 className="text-3xl font-normal text-white mb-1">{name}</h1>
                <p className="text-zinc-500">{email}</p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mb-16">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search nFKs Account"
                        className="w-full h-14 pl-12 pr-4 rounded-full border border-zinc-700 bg-[#1c1c1c] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all shadow-lg"
                    />
                </div>
            </div>

            {/* Content Grid (Placeholder) */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cards can be added here */}
            </div>

            <div className="mt-auto pt-20 pb-0 text-center max-w-2xl">
                <p className="text-sm text-zinc-500 mb-1 leading-relaxed">

                </p>
            </div>

            {/* Footer Links */}
            <div className="w-full flex flex-col items-center gap-4 mt-6 text-xs text-zinc-500 max-w-4xl">
                <div className="flex gap-6 justify-center">
                    <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
                    <a href="#" className="hover:text-zinc-300 transition-colors">Help</a>
                    <a href="#" className="hover:text-zinc-300 transition-colors">About</a>
                </div>
                <p>&copy; 2025-26 nFKs. All Rights Reserved</p>
            </div>
        </main>
    );
}
