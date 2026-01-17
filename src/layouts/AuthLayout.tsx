import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full flex justify-center relative z-10 perspective-1000">
                <Outlet />
            </div>

            <div className="absolute bottom-6 text-center w-full text-xs text-muted-foreground">
                <p>© 2026 nFKs. All Rights Reserved</p>
            </div>
        </div>
    );
};
