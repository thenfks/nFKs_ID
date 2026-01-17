import { createPortal } from 'react-dom';
import { X, Camera, UserPlus, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AccountDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export function AccountDrawer({ isOpen, onClose, user }: AccountDrawerProps) {
    const navigate = useNavigate();


    if (!isOpen) return null;

    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'nFKs User');
    const email = user?.email || 'user@example.com';
    const photoUrl = user?.user_metadata?.avatar_url || null;
    const initial = name && name !== 'nFKs User' ? name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'M');

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60]"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div className="fixed top-16 right-6 z-[70] w-[400px] bg-[#1E1E1E] rounded-[2rem] shadow-2xl border border-zinc-800 p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">

                {/* Header: Email & Close */}
                <div className="w-full relative flex items-center justify-center mb-6">
                    <div className="text-sm font-medium text-zinc-400">{email}</div>
                    <button
                        onClick={onClose}
                        className="absolute right-0 top-0 p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Current User Profile */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-3 group cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-medium overflow-hidden">
                            {photoUrl ? (
                                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                initial
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-[#202124] p-1.5 rounded-full border border-black shadow-lg">
                            <Camera size={14} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-xl text-white font-normal mb-1">Hi, {name}!</h2>
                    <button className="mt-4 px-6 py-2 rounded-full border border-zinc-600 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
                        Manage your nFKs ID
                    </button>
                </div>

                {/* Accounts List Container */}
                <div className="w-full bg-[#0A0A0A]/50 rounded-[1.5rem] overflow-hidden border border-zinc-800/50">
                    {/* Toggle Header (Optional, mimicking expected behavior roughly) */}
                    {/* <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 cursor-pointer" onClick={() => setShowAccounts(!showAccounts)}>
                        <span className="text-sm text-zinc-400">Other accounts</span>
                        {showAccounts ? <ChevronUp size={16} className="text-zinc-400"/> : <ChevronDown size={16} className="text-zinc-400"/>}
                     </div> */}

                    {/* Mock Secondary Account */}
                    <div className="flex items-center gap-3 p-4 hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm font-medium">
                            J
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">Jane Doe</div>
                            <div className="text-xs text-zinc-400 truncate">jane.doe@example.com</div>
                        </div>
                    </div>

                    {/* Add Account */}
                    <button className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors text-left border-b border-zinc-800/50">
                        <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400">
                            <UserPlus size={20} />
                        </div>
                        <span className="text-sm text-white font-medium">Add another account</span>
                    </button>

                    {/* Sign Out */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors text-left"
                    >
                        <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400">
                            <LogOut size={20} />
                        </div>
                        <span className="text-sm text-white font-medium">Sign out</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center gap-4 text-xs text-zinc-500">
                    <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
                    <span>•</span>
                    <a href="#" className="hover:text-zinc-300">Terms of Service</a>
                </div>

            </div>
        </>,
        document.body
    );
}
