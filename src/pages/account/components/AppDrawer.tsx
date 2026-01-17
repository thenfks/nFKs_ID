import { useState } from 'react';
import { createPortal } from 'react-dom';
import ayscrollIcon from '../../../assets/images/apps/ayscroll.png';
import hashtribeIcon from '../../../assets/images/apps/HashTribe.png';
import notesIcon from '../../../assets/images/apps/nFKs_Notes.png';
import strivexIcon from '../../../assets/images/apps/StriveX.png';

interface AppItem {
    name: string;
    icon: string;
    url: string;
}

const APPS: AppItem[] = [
    { name: 'AyScroll', icon: ayscrollIcon, url: 'https://ayscroll.com/' },
    { name: 'HashTribe', icon: hashtribeIcon, url: '#' },
    { name: 'Notes', icon: notesIcon, url: '#' },
    { name: 'StriveX', icon: strivexIcon, url: '#' },
];

function AppIcon({ app }: { app: AppItem }) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400 font-bold text-lg select-none">
                {app.name[0]}
            </div>
        );
    }

    return (
        <img
            src={app.icon}
            alt={app.name}
            className="w-full h-full object-cover p-0"
            onError={() => setError(true)}
        />
    );
}

interface AppDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Backdrop for closing when clicking outside */}
            <div
                className="fixed inset-0 z-[60]"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div className="fixed top-16 right-6 z-[70] w-[320px] bg-[#1E1E1E] rounded-3xl shadow-2xl border border-zinc-800 p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-3 gap-4">
                    {APPS.map((app) => (
                        <a
                            key={app.name}
                            href={app.url}
                            className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-zinc-800 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-zinc-900 group-hover:bg-zinc-900/80 transition-colors">
                                <AppIcon app={app} />
                            </div>
                            <span className="text-xs font-medium text-zinc-300 group-hover:text-white text-center">
                                {app.name}
                            </span>
                        </a>
                    ))}
                </div>

                {/* Optional "More" link akin to Google's drawer */}
                <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
                    <button className="text-sm text-zinc-400 hover:text-zinc-200 font-medium px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors">
                        More from nFKs
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
}
