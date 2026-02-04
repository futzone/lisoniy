import { useState, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
    Menu,
    X,
    LogOut,
    LayoutDashboard,
    Database,
    FileUp,
    BookOpen,
    Languages,
    CheckSquare,
    Eye,
    FileText,
    MessageSquare,
    Trophy,
    Code,
    BookMarked,
    Github,
    User,
    Settings,
    BookA,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { AnimatePresence, motion } from 'motion/react';

interface SidebarItem {
    id: string;
    label: string;
    icon: any;
    href: string;
}

interface SidebarSection {
    id: string;
    title: string;
    items: SidebarItem[];
}

interface AppLayoutProps {
    children: ReactNode;
    pageTitle?: string;
}

const sidebarSections: SidebarSection[] = [
    {
        id: 'main',
        title: 'Asosiy',
        items: [
            { id: 'dashboard', label: 'Bosh sahifa', icon: LayoutDashboard, href: '/dashboard' },
            { id: 'explore', label: 'Datasetlarni ko\'rish', icon: Database, href: '/dashboard/explore-datasets' },
            { id: 'learn', label: 'O\'rganing', icon: BookOpen, href: '/dashboard/learn' },
            { id: 'contributions', label: 'Mening hissalarim', icon: FileUp, href: '/dashboard/contributions' },
        ]
    },
    {
        id: 'linguistic',
        title: 'Til asboblari',
        items: [
            { id: 'transliteration', label: 'Transliteratsiya', icon: Languages, href: '/tools/transliteration' },
            { id: 'spellchecker', label: 'Imlo tekshiruv', icon: CheckSquare, href: '/tools/spellchecker' },
            { id: 'ner', label: 'NER Vizualizator', icon: Eye, href: '/tools/ner' },
            { id: 'dictionary', label: 'Lug\'at', icon: BookOpen, href: '/tools/dictionary' },
            { id: 'terms', label: 'Atamalar', icon: BookA, href: '/dashboard/terms' },
        ]
    },
    {
        id: 'community',
        title: 'Hamjamiyat',
        items: [
            { id: 'articles', label: 'Maqolalar', icon: FileText, href: '/hamjamiyat?tab=articles' },
            { id: 'forum', label: 'Forum', icon: MessageSquare, href: '/hamjamiyat?tab=forum' },
            { id: 'leaderboard', label: 'Yetakchilar', icon: Trophy, href: '/hamjamiyat/leaderboard' },
        ]
    },
    {
        id: 'support',
        title: 'Hujjatlar',
        items: [
            { id: 'api', label: 'API Hujjatlari', icon: Code, href: '/docs/api' },
            { id: 'guidelines', label: 'Ko\'rsatmalar', icon: BookMarked, href: '/docs/guidelines' },
            { id: 'opensource', label: 'Ochiq manba', icon: Github, href: '/docs/opensource' },
        ]
    },
    {
        id: 'account',
        title: 'Shaxsiy kabinet',
        items: [
            { id: 'profile', label: 'Mening profilim', icon: User, href: '/dashboard/profile' },
            { id: 'settings', label: 'Sozlamalar', icon: Settings, href: '/dashboard/settings' },
        ]
    },
];

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
                <div className="flex h-16 items-center gap-2 border-b border-border px-6">
                    <img src="/lisoniy_small.png" alt="Lisoniy Logo" className="h-8 w-8 object-cover rounded-lg" />
                    <span className="font-bold text-foreground">Lisoniy</span>
                </div>

                <nav className="flex-1 overflow-y-auto p-3">
                    {sidebarSections.map((section) => {
                        return (
                            <div key={section.id} className="mb-4">
                                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {section.title}
                                </div>
                                <div className="mt-1 space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.href ||
                                            (item.href.includes('?') && location.pathname + location.search === item.href);

                                        return (
                                            <Link key={item.id} to={item.href}>
                                                <Button
                                                    variant={isActive ? "default" : "ghost"}
                                                    className="w-full justify-start gap-3 px-6 py-2 h-auto text-sm"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    {item.label}
                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="border-t border-border p-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Chiqish
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-border bg-card lg:hidden flex"
                        >
                            <div className="flex h-16 items-center justify-between border-b border-border px-6">
                                <div className="flex items-center gap-2">
                                    <img src="/lisoniy_small.png" alt="Lisoniy Logo" className="h-8 w-8 object-cover rounded-lg" />
                                    <span className="font-bold text-foreground">Lisoniy</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-3">
                                {sidebarSections.map((section) => {
                                    return (
                                        <div key={section.id} className="mb-4">
                                            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                {section.title}
                                            </div>
                                            <div className="mt-1 space-y-1">
                                                {section.items.map((item) => {
                                                    const Icon = item.icon;
                                                    const isActive = location.pathname === item.href ||
                                                        (item.href.includes('?') && location.pathname + location.search === item.href);

                                                    return (
                                                        <Link key={item.id} to={item.href} onClick={() => setSidebarOpen(false)}>
                                                            <Button
                                                                variant={isActive ? "default" : "ghost"}
                                                                className="w-full justify-start gap-3 px-6 py-2 h-auto text-sm"
                                                            >
                                                                <Icon className="h-4 w-4" />
                                                                {item.label}
                                                            </Button>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </nav>

                            <div className="border-t border-border p-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Chiqish
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        {pageTitle && (
                            <h1 className="text-xl font-bold text-foreground">{pageTitle}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-medium text-foreground">{user?.fullName}</span>
                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                        <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {user?.fullName?.split(" ").map(n => n[0]).join("") || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden md:inline">Chiqish</span>
                        </Button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
