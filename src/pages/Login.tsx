import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'email' | 'password'>(location.state?.email ? 'password' : 'email');
    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setStep('password');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            navigate('/');
        } catch (error: any) {
            toast({
                title: "Authentication failed",
                description: error.message || 'An error occurred during login',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in w-full max-w-[1040px] mx-auto p-4">
            <Card className="w-full border-[#1c1c1c] bg-[#0A0A0A] shadow-2xl overflow-hidden rounded-[28px] flex flex-col md:flex-row min-h-[400px]">
                {/* Left Side */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-start bg-[#0A0A0A]">
                    <img src="/nfks_logo.png" alt="nFKs Logo" className="h-8 w-8 mb-6 rounded-lg" />
                    <h1 className="text-4xl font-normal text-white mb-4">Sign in</h1>
                    <p className="text-lg text-white">Use your nFKs Account</p>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#0A0A0A]">
                    <div className="mb-10">
                        {step === 'password' && (
                            <div className="mb-6">
                                <button
                                    onClick={() => setStep('email')}
                                    className="flex items-center text-zinc-300 text-sm hover:text-white transition-colors border border-zinc-800 rounded-full px-3 py-1.5 bg-zinc-900/50"
                                >
                                    <span className="w-5 h-5 rounded-full bg-zinc-700 text-white flex items-center justify-center text-xs font-medium mr-2">
                                        {email.charAt(0).toUpperCase()}
                                    </span>
                                    {email}
                                    <span className="ml-2 text-[10px] opacity-60">▼</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={step === 'email' ? handleEmailSubmit : handleLogin} className="w-full space-y-8">
                        <div className="space-y-2">
                            <Input
                                type={step === 'email' ? "email" : "password"}
                                placeholder={step === 'email' ? "Email or phone" : "Enter your password"}
                                value={step === 'email' ? email : password}
                                onChange={(e) => step === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                                required
                                className="bg-[#1c1c1c] border-zinc-700 text-white h-14 rounded-lg focus:border-white focus:ring-1 focus:ring-white placeholder:text-zinc-500 text-base"
                            />
                            {step === 'email' ? (
                                <button type="button" className="text-zinc-300 text-sm font-medium hover:text-white transition-colors pt-1">
                                    Forgot email?
                                </button>
                            ) : (
                                <Link to="/forgot-password" className="text-zinc-300 text-sm font-medium hover:text-white transition-colors inline-block pt-1">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <div className="space-y-6">
                            <p className="text-sm text-zinc-500">
                                Not your computer? Use Guest mode to sign in privately. <span className="text-white cursor-pointer hover:underline">Learn more</span>
                            </p>

                            <div className="flex justify-between items-center pt-4">
                                {step === 'email' ? (
                                    <Link to="/register" className="text-zinc-300 text-sm font-medium hover:text-white transition-colors">
                                        Create account
                                    </Link>
                                ) : (
                                    <div></div>
                                )}

                                <Button
                                    type="submit"
                                    className="h-10 px-8 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
                                    isLoading={loading}
                                >
                                    {step === 'email' ? 'Next' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
