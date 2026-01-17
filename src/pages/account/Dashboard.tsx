import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { MainContainer } from './components/MainContainer';

export default function Dashboard() {
    return (
        <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col font-sans">
            <Header />
            <div className="flex flex-1 w-full">
                <SideNav />
                <MainContainer />
            </div>
        </div>
    );
}
