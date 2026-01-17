import type { Session } from '@supabase/supabase-js';

const STORAGE_KEY = 'nfks_known_accounts';

export interface StoredAccount {
    id: string;
    email?: string;
    name?: string;
    avatarUrl?: string;
    refreshToken: string;
    accessToken?: string; // We store this to pass JWT structure checks
    lastActiveAt: number;
}
export const getStoredAccounts = (): StoredAccount[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const saveAccount = (session: Session) => {
    if (!session?.user) return;

    const accounts = getStoredAccounts();
    const user = session.user;
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const avatarUrl = user.user_metadata?.avatar_url;

    const newAccount: StoredAccount = {
        id: user.id,
        email: user.email,
        name,
        avatarUrl,
        refreshToken: session.refresh_token,
        accessToken: session.access_token,
        lastActiveAt: Date.now(),
    };

    // Remove existing entry for this user (to prepare for update)
    const filtered = accounts.filter(a => a.id !== user.id);
    // Add updated
    filtered.push(newAccount);
    // Sort by last active desc
    filtered.sort((a, b) => b.lastActiveAt - a.lastActiveAt);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const removeAccount = (userId: string) => {
    const accounts = getStoredAccounts();
    const filtered = accounts.filter(a => a.id !== userId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
