import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            if (formData.firstName.trim()) {
                setStep(2);
            }
        } else {
            handleRegister(e);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                    },
                },
            });

            if (error) throw error;

            navigate('/verify-email', { state: { email: formData.email } });
        } catch (error: any) {
            alert(error.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in w-full min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-[1040px] border-[#1c1c1c] bg-[#0A0A0A] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px] rounded-[28px] p-2">
                {/* Left Side */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-between relative bg-[#0A0A0A]">
                    <div>
                        <img src="/nfks_logo.png" alt="nFKs Logo" className="h-8 w-8 mb-6 rounded-lg" />
                        <h1 className="text-4xl font-normal text-white mb-4">Create a nFKs ID</h1>
                        <p className="text-lg text-white">Enter your name</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-[#0A0A0A]">
                    <form onSubmit={handleNext} className="w-full h-full flex flex-col">
                        <div className="flex-grow flex flex-col justify-center space-y-6 animate-fade-in" key={step}>
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <Input
                                        name="firstName"
                                        placeholder="First name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="bg-[#1c1c1c] border-zinc-700 text-white h-14 rounded-lg focus:border-white focus:ring-1 focus:ring-white placeholder:text-zinc-500"
                                        required
                                        autoFocus
                                    />
                                    <Input
                                        name="lastName"
                                        placeholder="Last name (optional)"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="bg-[#1c1c1c] border-zinc-700 text-white h-14 rounded-lg focus:border-white focus:ring-1 focus:ring-white placeholder:text-zinc-500"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-[#1c1c1c] border-zinc-700 text-white h-14 rounded-lg focus:border-white focus:ring-1 focus:ring-white placeholder:text-zinc-500"
                                        required
                                        autoFocus
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="bg-[#1c1c1c] border-zinc-700 text-white h-14 rounded-lg focus:border-white focus:ring-1 focus:ring-white placeholder:text-zinc-500"
                                            required
                                            rightElement={
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none text-zinc-400 hover:text-white transition-colors">
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            }
                                        />
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="bg-[#1c1c1c] border-zinc-700 text-white h-14 rounded-lg focus:border-white focus:ring-1 focus:ring-white placeholder:text-zinc-500"
                                            rightElement={
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none text-zinc-400 hover:text-white transition-colors">
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            }
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-500 max-w-xs">
                                        Use 8 or more characters with a mix of letters, numbers & symbols
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-8 mt-auto">
                            <Link to="/login" className="text-zinc-300 text-sm font-medium hover:text-white transition-colors whitespace-nowrap">
                                Sign in instead
                            </Link>

                            {/* Optional Back Button for Step 2 if we wanted, but user didn't ask explicitly. keeping minimal */}
                            {step === 2 && (
                                <button type="button" onClick={() => setStep(1)} className="mr-4 text-zinc-400 hover:text-white text-sm">Back</button>
                            )}

                            <Button
                                type="submit"
                                className="h-10 px-8 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors ml-auto"
                                isLoading={loading}
                            >
                                Next
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
