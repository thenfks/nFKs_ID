import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../components/ui/Card';

// Mock data for accounts
const MOCK_ACCOUNTS = [
    { id: '1', name: 'Mayank Jha', email: 'mayank@nfks.com', avatar: 'MJ' },
    { id: '2', name: 'Mayank Personal', email: 'mayank.jha@gmail.com', avatar: 'MP' },
];

export default function ChooseAccount() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<string | null>(null);

    const handleAccountSelect = (accountId: string) => {
        setLoading(accountId);
        // Simulate selection delay
        setTimeout(() => {
            setLoading(null);
            navigate('/consent');
        }, 800);
    };

    return (
        <div className="animate-fade-in w-full max-w-xl mx-auto">
            <Card className="w-full border-[#1c1c1c] bg-[#0A0A0A] shadow-2xl rounded-[28px] overflow-hidden">
                <div className="flex items-center p-6 pb-2 border-b border-[#1A1A1A]">
                    <img src="/nfks_logo.png" alt="nFKs Logo" className="h-6 w-6 mr-3 rounded-md" />
                    <span className="text-white text-sm font-medium">Sign in with nFKs</span>
                </div>

                <CardContent className="p-8 pb-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white mb-2">Choose an account</h1>
                        <p className="text-muted-foreground text-base">
                            to continue to <span className="text-white font-medium">AyScroll</span>
                        </p>
                    </div>

                    <div className="space-y-1">
                        {MOCK_ACCOUNTS.map((account) => (
                            <div
                                key={account.id}
                                onClick={() => handleAccountSelect(account.id)}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-zinc-800 text-white rounded-full flex items-center justify-center font-medium text-sm border border-zinc-700">
                                        {account.avatar}
                                    </div>
                                    <div className="ml-4 text-left">
                                        <p className="text-sm font-medium text-white">{account.name}</p>
                                        <p className="text-xs text-zinc-500">{account.email}</p>
                                    </div>
                                </div>
                                {loading === account.id && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
                            </div>
                        ))}

                        <div
                            onClick={() => navigate('/login')}
                            className="flex items-center p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group mt-2"
                        >
                            <div className="h-10 w-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-zinc-500 transition-colors">
                                <Plus className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Use another account</p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex-col gap-2 pt-0 pb-6 border-t border-[#1A1A1A] p-6">
                    <p className="text-xs text-zinc-500 text-center w-full mt-4">
                        Before continuing, review AyScroll's <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span> and <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span>.
                    </p>

                    <div className="flex w-full justify-between items-center text-[10px] text-zinc-600 mt-4 px-2">
                        <span>English (United Kingdom)</span>
                        <div className="flex gap-4">
                            <span>Help</span>
                            <span>Privacy</span>
                            <span>Terms</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
