import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-between relative overflow-y-auto">
            {/* Ambient background effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none fixed" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none fixed" />

            <div className="w-full flex-grow flex items-center justify-center p-4 relative z-10 perspective-1000 py-10">
                <Outlet />
            </div>

            <div className="w-full text-center text-xs text-muted-foreground pb-6 relative z-10">
                <p>© 2026 nFKs. All Rights Reserved</p>
            </div>
        </div>
    );
};
