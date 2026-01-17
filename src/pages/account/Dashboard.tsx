import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Search, Home, User, Shield, Key, Share2, CreditCard, HelpCircle, Grid, Camera } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col font-sans">
            {/* Top Bar */}
            <div className="w-full px-6 py-3 flex items-center justify-between border-b border-zinc-900 sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <img src="/nfks_logo.png" alt="nFKs" className="w-6 h-6 rounded-md" />
                    <span className="text-xl font-medium text-zinc-300">nFKs Account</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                        <HelpCircle size={20} />
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                        <Grid size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium cursor-pointer ring-2 ring-[#0A0A0A] hover:opacity-90 transition-opacity" onClick={handleLogout}>
                        M
                    </div>
                </div>
            </div>

            <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
                {/* Sidebar */}
                <aside className="w-[280px] flex-shrink-0 py-6 hidden md:block">
                    <nav className="flex flex-col gap-1 px-4">
                        <SidebarItem icon={<Home size={18} />} label="Home" active color="text-blue-400" />
                        <SidebarItem icon={<User size={18} />} label="Personal info" color="text-red-500" />
                        <SidebarItem icon={<Shield size={18} />} label="Data & privacy" color="text-blue-500" />
                        <SidebarItem icon={<Key size={18} />} label="Security" color="text-yellow-500" />
                        <SidebarItem icon={<Share2 size={18} />} label="People & sharing" color="text-green-500" />
                        <SidebarItem icon={<CreditCard size={18} />} label="Payments & subs" color="text-orange-500" />
                        <SidebarItem icon={<Grid size={18} />} label="Connected Apps" color="text-purple-500" />
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-8 py-10 flex flex-col items-center">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-4xl font-normal relative mb-4">
                            M
                            <div className="absolute bottom-0 right-0 bg-[#1c1c1c] p-1.5 rounded-full border border-[#0A0A0A] cursor-pointer hover:bg-zinc-800 transition-colors">
                                <Camera size={14} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-normal text-white mb-1">Mayank Jha</h1>
                        <p className="text-zinc-500">mayankjha@ayscroll.com</p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full max-w-2xl mb-16">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search nFKs Account"
                                className="w-full h-14 pl-12 pr-4 rounded-full border border-zinc-700 bg-[#1c1c1c] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Content Grid (Placeholder for now, keeping it clean like image) */}
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* We can add Cards here later basically sections */}
                    </div>

                    <div className="mt-auto pt-20 pb-10 text-center max-w-2xl">
                        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                            Only you can see your settings. You might also want to review your settings for Maps, Search or whatever nFKs service that you use the most. nFKs keeps your data private, safe and secure. <span className="text-blue-400 cursor-pointer hover:underline">Learn more</span>
                        </p>
                        <Shield className="w-10 h-10 text-blue-500/80 mx-auto" />
                    </div>

                    {/* Footer Links */}
                    <div className="w-full flex gap-6 mt-6 text-xs text-zinc-500 max-w-4xl justify-center">
                        <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
                        <a href="#" className="hover:text-zinc-300 transition-colors">Help</a>
                        <a href="#" className="hover:text-zinc-300 transition-colors">About</a>
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active, color }: { icon: React.ReactNode, label: string, active?: boolean, color: string }) {
    return (
        <a href="#" className={`flex items-center gap-4 px-6 py-3 text-sm font-medium transition-colors w-full relative ${active ? 'text-white bg-zinc-900' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${active ? '' : ''} ${active ? 'text-white' : color.replace('bg-', 'text-').replace('/10', '').replace('500', '400')}`}>
                {/* Simplified icon color logic: If active, white. If not, use the colored text style but no bg circle to keep it clean, or keep the circle? 
                   The user said "add White Line instead of Blue active tab". 
                   Let's keep the colored icon for non-active, but make active icon White.
                   And remove the background circle for non-active to be cleaner? Or keep it?
                   The previous code had `color` passed as `bg-blue-500/10 text-blue-400`.
                   Let's just use the icon.
                */}
                {/* Re-using the color prop for the icon TEXT color only, removing bg circle for minimal look suitable for "White Line" style */}
                <div className={`${active ? 'text-white' : color.split(' ')[1]}`}>
                    {icon}
                </div>
            </div>
            {label}
        </a>
    )
}
