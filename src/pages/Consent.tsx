import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { User as UserIcon, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountDrawer } from './account/components/AccountDrawer';

export default function Consent() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'User');
    const email = user?.email || 'user@example.com';
    const photoUrl = user?.user_metadata?.avatar_url || null;
    const initial = name && name !== 'User' ? name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U');

    const handleAllow = () => {
        setLoading(true);
        // Simulate redirection back to client app
        setTimeout(() => {
            // In a real OAuth flow, this would redirect to the client's callback URL with a code/token
            console.log("Allowed access for user:", user?.id);
            alert("Redirecting to AyScroll...");
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="animate-fade-in w-full max-w-5xl mx-auto flex items-center justify-center p-4">
            <Card className="w-full border-[#1A1A1A] bg-[#0A0A0A] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] rounded-[2rem]">
                {/* Left Side */}
                <div className="w-full md:w-[45%] p-10 border-r border-[#1A1A1A] flex flex-col relative">
                    <div className="flex items-center mb-16">
                        <img src="/nfks_logo.png" alt="nFKs Logo" className="h-8 w-8 mr-3 rounded-lg" />
                        <span className="text-white font-medium">Sign in with nFKs ID</span>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-4xl leading-tight font-medium text-white mb-2">
                            Sign in to <span className="bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent font-bold">AyScroll</span>
                        </h1>

                        <div className="mt-12">
                            <button
                                onClick={() => setIsAccountDrawerOpen(true)}
                                className="bg-[#151515] p-2 pr-4 rounded-full inline-flex items-center gap-3 border border-[#252525] cursor-pointer hover:border-[#333] transition-colors group"
                            >
                                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        initial
                                    )}
                                </div>
                                <span className="text-zinc-200 text-sm group-hover:text-white transition-colors">{email}</span>
                                <svg className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>

                        <p className="mt-8 text-sm text-zinc-500">
                            Don't have an account? <span className="text-brand-from cursor-pointer hover:underline">Create nFKs ID</span>
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-[55%] p-10 flex flex-col">
                    <h2 className="text-xl text-white mb-8 text-center md:text-left">
                        nFKs ID will allow <span className="text-brand-from font-medium">AyScroll</span> to access this info about you
                    </h2>

                    <div className="space-y-4 flex-1">
                        <div className="bg-[#111111] border border-[#222] p-4 rounded-xl flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-zinc-400">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{name}</p>
                                <p className="text-zinc-500 text-xs">Name and profile picture</p>
                            </div>
                        </div>

                        <div className="bg-[#111111] border border-[#222] p-4 rounded-xl flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-zinc-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{email}</p>
                                <p className="text-zinc-500 text-xs">Email address</p>
                            </div>
                        </div>

                        <div className="bg-[#111111] border border-[#222] p-4 rounded-xl flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-zinc-400">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">Basic profile info</p>
                                <p className="text-zinc-500 text-xs">Gender, date of birth, and language</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-xs text-zinc-500 text-center mb-6">
                            Review AyScroll's <span className="text-brand-from">privacy policy</span> and <span className="text-brand-from">Terms of Service</span>.
                        </p>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-full border border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAllow}
                                isLoading={loading}
                                className="flex-1 h-12 rounded-full bg-gradient-to-r from-brand-from to-brand-to text-white hover:opacity-90 border-0"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <AccountDrawer
                isOpen={isAccountDrawerOpen}
                onClose={() => setIsAccountDrawerOpen(false)}
                user={user}
            />
        </div>
    );
}
