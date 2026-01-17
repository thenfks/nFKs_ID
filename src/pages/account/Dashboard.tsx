import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { MainContainer } from './components/MainContainer';

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col font-sans">
            <Header user={user} />
            <div className="flex flex-1 w-full">
                <SideNav />
                <MainContainer user={user} />
            </div>
        </div>
    );
}
