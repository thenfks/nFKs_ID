import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate verification or implement actual Supabase verifyOtp
        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    return (
        <div className="animate-fade-in w-full max-w-[1040px] flex items-center justify-center p-4">
            <Card className="w-full border-[#1c1c1c] bg-black shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px] rounded-[28px] p-2">
                {/* Left Side - Content */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-between relative bg-[#0A0A0A] rounded-[20px]">
                    <div>
                        <img src="/nfks_logo.png" alt="nFKs Logo" className="h-8 w-8 mb-6 rounded-lg" />
                        <h1 className="text-4xl font-normal text-white mb-4">Verify your email address</h1>
                        <p className="text-base text-zinc-400">
                            Enter the verification code we sent to your email. If you don't see it, check your spam folder.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6 mt-8">
                        <Input
                            type="text"
                            placeholder="Enter code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="bg-[#1c1c1c] border-zinc-700 text-white h-14 rounded-lg focus:border-white focus:ring-1 focus:ring-white placeholder:text-zinc-500"
                            required
                        />

                        <div className="flex justify-between items-center pt-8">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="text-zinc-300 text-sm font-medium hover:text-white transition-colors"
                            >
                                Back
                            </button>

                            <Button
                                type="submit"
                                className="h-10 px-8 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
                            >
                                Verify
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right Side - Illustration */}
                <div className="w-full md:w-1/2 bg-[#0A0A0A] flex items-center justify-center p-10 rounded-[20px]">
                    <div className="relative w-48 h-48 opacity-80 flex items-center justify-center">
                        {/* Mail Envelope Icon */}
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
                            <rect width="20" height="16" x="2" y="4" rx="2" className="text-zinc-800" fill="#1A1A1A" stroke="none" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="white" />
                            <rect width="20" height="16" x="2" y="4" rx="2" stroke="#333" />
                        </svg>
                    </div>
                </div>
            </Card>
        </div>
    );
}
