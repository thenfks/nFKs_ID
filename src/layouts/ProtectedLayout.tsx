import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            navigate(`/login${location.search}`, {
                state: { from: location },
                replace: true
            });
        }
    }, [user, loading, navigate, location]);

    if (loading) {
        return <div className="min-h-screen w-full bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return <Outlet />;
};
