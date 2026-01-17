import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
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
    const [storedAccounts, setStoredAccounts] = useState<any[]>([]);
    const [switching, setSwitching] = useState(false);

    useEffect(() => {
        if (isOpen) {
            import('../../../lib/accountManager').then(({ getStoredAccounts }) => {
                setStoredAccounts(getStoredAccounts());
            });
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'nFKs User');
    const email = user?.email || 'user@example.com';
    const photoUrl = user?.user_metadata?.avatar_url || null;
    const initial = name && name !== 'nFKs User' ? name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'M');

    // Filter out current user from stored accounts
    const otherAccounts = storedAccounts.filter((acc: any) => acc.id !== user?.id);

    const handleLogout = async () => {
        // We do NOT remove the account from storage on logout. 
        // We want it to remain "listed" so the user can easily sign back in (like Google).
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleAddAccount = async () => {
        // Just sign out to let user log in with new account. 
        // Current account is already saved by AuthContext.
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleSwitchAccount = async (account: any) => {
        try {
            setSwitching(true);
            const { error } = await supabase.auth.setSession({
                refresh_token: account.refreshToken,
                // Pass stored access token if available, otherwise a structurally valid dummy JWT
                // to prevent "Invalid JWT structure" client errors.
                access_token: account.accessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            });
            if (error) {
                console.error("Error switching account:", error);

                // If switch fails (e.g. invalid refresh token), redirect to login to re-authenticate
                navigate('/login');
            } else {
                // Successful switch.
                // Force a reload to ensure the entire app state (context, listeners) reflects the new user cleanly.
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSwitching(false);
        }
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
                    <button
                        onClick={() => {
                            onClose();
                            navigate('/');
                        }}
                        className="mt-4 px-6 py-2 rounded-full border border-zinc-600 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                        Manage your nFKs ID
                    </button>
                </div>

                {/* Accounts List Container */}
                <div className="w-full bg-[#0A0A0A]/50 rounded-[1.5rem] overflow-hidden border border-zinc-800/50">

                    {/* Other Accounts List */}
                    {otherAccounts.map((account) => (
                        <button
                            key={account.id}
                            disabled={switching}
                            onClick={() => handleSwitchAccount(account)}
                            className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-zinc-700 text-white flex items-center justify-center text-sm font-medium overflow-hidden">
                                {account.avatarUrl ? (
                                    <img src={account.avatarUrl} alt={account.name} className="w-full h-full object-cover" />
                                ) : (
                                    account.name ? account.name[0].toUpperCase() : 'U'
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-white font-medium truncate">{account.name}</div>
                                <div className="text-xs text-zinc-400 truncate">{account.email}</div>
                            </div>
                        </button>
                    ))}

                    {/* Add Account */}
                    <button
                        onClick={handleAddAccount}
                        disabled={switching}
                        className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors text-left border-b border-zinc-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
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
