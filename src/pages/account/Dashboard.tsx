import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { MainContainer } from './components/MainContainer';
import { PersonalInfo } from './components/PersonalInfo';

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('Home');

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
                <SideNav activeTab={activeTab} onTabChange={setActiveTab} />
                {activeTab === 'Home' && <MainContainer user={user} />}
                {activeTab === 'Personal info' && <PersonalInfo user={user} />}
                {activeTab !== 'Home' && activeTab !== 'Personal info' && (
                    <div className="flex-1 flex items-center justify-center text-zinc-500">
                        Content for {activeTab} coming soon...
                    </div>
                )}
            </div>
        </div>
    );
}
