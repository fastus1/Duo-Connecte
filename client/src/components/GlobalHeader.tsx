import { useLocation } from 'wouter';
import { Shield, LogOut, Home, LogIn, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { getSessionToken, clearAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { useAccess } from '@/contexts/AccessContext';

interface GlobalHeaderProps {
    onEnterPreview?: () => void;
}

export function GlobalHeader({ onEnterPreview }: GlobalHeaderProps) {
    const [location, setLocation] = useLocation();
    const sessionToken = getSessionToken();
    const isLoggedIn = !!sessionToken;
    const { circleIsAdmin } = useAccess();

    const { data: userData } = useQuery({
        queryKey: ['/api/auth/me'],
        queryFn: async () => {
            if (!sessionToken) return null;
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`,
                },
            });
            if (!response.ok) return null;
            return response.json();
        },
        enabled: isLoggedIn,
        retry: false,
    });

    const isAdmin = userData?.isAdmin || circleIsAdmin;

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/';
    };

    const isAdminPage = location === '/admin' || location === '/admin-login';
    
    if (!isAdmin && !isAdminPage) {
        return null;
    }

    let title = "Espace Membre";
    let subtitle = "Communauté Avancer Simplement";

    if (location === '/admin') {
        title = "Dashboard Admin";
        subtitle = "Espace d'administration";
    } else if (location === '/welcome' || location.startsWith('/solo') || location.startsWith('/duo')) {
        title = "Jumelage";
        subtitle = "Application duo-connecte";
    }

    return (
        <header className="border-b bg-card sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation(isLoggedIn ? '/welcome' : '/')}>
                    <Logo size="md" />
                    <div>
                        <h1 className="text-xl font-semibold">{title}</h1>
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    {onEnterPreview && (
                        <Button
                            variant="outline"
                            onClick={onEnterPreview}
                            data-testid="button-enter-preview"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Prévisualiser</span>
                        </Button>
                    )}

                    {isLoggedIn && isAdmin && location !== '/admin' && (
                        <Button
                            variant="outline"
                            onClick={() => setLocation('/admin')}
                            data-testid="button-dashboard"
                        >
                            <Shield className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Dashboard Admin</span>
                        </Button>
                    )}

                    {isLoggedIn && location === '/admin' && (
                        <Button
                            variant="outline"
                            onClick={() => setLocation('/welcome')}
                            data-testid="button-user-home"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Page d'accueil</span>
                        </Button>
                    )}

                    {isLoggedIn ? (
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            data-testid="button-logout"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </Button>
                    ) : (
                        location !== '/admin-login' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLocation('/admin-login')}
                                data-testid="button-admin-login"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Admin
                            </Button>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}
