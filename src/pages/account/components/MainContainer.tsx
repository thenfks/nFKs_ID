import { Search, Shield, Camera } from 'lucide-react';

export function MainContainer() {
    return (
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

            {/* Content Grid (Placeholder) */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cards can be added here */}
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
    );
}
