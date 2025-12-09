import { useLocation } from 'wouter';
import { Shield, LogOut, Home, LogIn, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { getSessionToken, clearAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { useAccess } from '@/contexts/AccessContext';
import { soloFlow, duoFlow } from '@shared/schema';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

const specialPages = [
    { path: '/', label: 'Page de connexion (Auth)' },
    { path: '/admin-login', label: 'Connexion Admin' },
    { path: '/admin', label: 'Dashboard Admin' },
];

const soloPageLabels: Record<string, string> = {
    '/welcome': '0. Accueil',
    '/solo/roles': '1. Choix des rôles',
    '/solo/warnings': '2. Avertissements',
    '/solo/intention': '3. Intention',
    '/solo/sender-grounding': '4. Ancrage émetteur',
    '/solo/receiver-grounding': '5. Ancrage récepteur',
    '/solo/transition-1': '6. Transition 1',
    '/solo/sender-situation': '7. Situation',
    '/solo/sender-experience': '8. Vécu',
    '/solo/sender-interpretation': '9. Interprétation',
    '/solo/sender-impact': '10. Impact',
    '/solo/sender-summary': '11. Résumé émetteur',
    '/solo/receiver-validation': '12. Validation récepteur',
    '/solo/sender-confirmation': '13. Confirmation émetteur',
    '/solo/sender-clarification': '14. Clarification',
    '/solo/receiver-experience': '15. Vécu récepteur',
    '/solo/sender-validation': '16. Validation émetteur',
    '/solo/receiver-confirmation': '17. Confirmation récepteur',
    '/solo/transition-2': '18. Transition 2',
    '/solo/sender-needs': '19. Besoins émetteur',
    '/solo/receiver-response': '20. Réponse récepteur',
    '/solo/transition-3': '21. Transition 3',
    '/solo/sender-closing': '22. Clôture émetteur',
    '/solo/receiver-closing': '23. Clôture récepteur',
    '/solo/thanks': '24. Remerciements',
    '/solo/feedback': '25. Feedback',
    '/solo/completion': '26. Fin',
};

const duoPageLabels: Record<string, string> = {
    '/welcome': '0. Accueil',
    '/duo/roles': '1. Choix des rôles',
    '/duo/warnings': '2. Avertissements',
    '/duo/intention': '3. Intention',
    '/duo/sender-grounding': '4. Ancrage émetteur',
    '/duo/receiver-grounding': '5. Ancrage récepteur',
    '/duo/transition-1': '6. Transition 1',
    '/duo/sender-situation': '7. Situation',
    '/duo/sender-experience': '8. Vécu',
    '/duo/sender-interpretation': '9. Interprétation',
    '/duo/sender-impact': '10. Impact',
    '/duo/sender-summary': '11. Résumé émetteur',
    '/duo/receiver-validation': '12. Validation récepteur',
    '/duo/sender-confirmation': '13. Confirmation émetteur',
    '/duo/receiver-experience': '14. Vécu récepteur',
    '/duo/sender-validation': '15. Validation émetteur',
    '/duo/receiver-confirmation': '16. Confirmation récepteur',
    '/duo/transition-2': '17. Transition 2',
    '/duo/sender-needs': '18. Besoins émetteur',
    '/duo/receiver-response': '19. Réponse récepteur',
    '/duo/transition-3': '20. Transition 3',
    '/duo/sender-closing': '21. Clôture émetteur',
    '/duo/receiver-closing': '22. Clôture récepteur',
    '/duo/feedback': '23. Feedback',
    '/duo/completion': '24. Fin',
};

const inversionPageLabels: Record<string, string> = {
    '/duo/inversion-des-roles/page-7a': '7a. Situation (inversé)',
    '/duo/inversion-des-roles/page-8a': '8a. Vécu (inversé)',
    '/duo/inversion-des-roles/page-9a': '9a. Interprétation (inversé)',
    '/duo/inversion-des-roles/page-10a': '10a. Impact (inversé)',
    '/duo/inversion-des-roles/page-11a': '11a. Résumé (inversé)',
    '/duo/inversion-des-roles/page-12a': '12a. Validation (inversé)',
    '/duo/inversion-des-roles/page-13a': '13a. Confirmation (inversé)',
    '/duo/inversion-des-roles/page-14a': '14a. Vécu récepteur (inversé)',
    '/duo/inversion-des-roles/page-15a': '15a. Validation (inversé)',
    '/duo/inversion-des-roles/page-16a': '16a. Confirmation (inversé)',
    '/duo/inversion-des-roles/page-17a': '17a. Transition (inversé)',
    '/duo/inversion-des-roles/page-18a': '18a. Besoins (inversé)',
    '/duo/inversion-des-roles/page-19a': '19a. Réponse (inversé)',
    '/duo/inversion-des-roles/page-20a': '20a. Transition (inversé)',
};

export function GlobalHeader() {
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

    const handleNavigate = (path: string) => {
        setLocation(path);
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

                    {isAdmin && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" data-testid="button-page-preview">
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Prévisualiser</span>
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-y-auto">
                                <DropdownMenuLabel>Pages spéciales</DropdownMenuLabel>
                                {specialPages.map((page) => (
                                    <DropdownMenuItem
                                        key={page.path}
                                        onClick={() => handleNavigate(page.path)}
                                        data-testid={`link-preview-${page.path.replace(/\//g, '-')}`}
                                    >
                                        {page.label}
                                    </DropdownMenuItem>
                                ))}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <span className="text-red-600 dark:text-red-400">Parcours Solo</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="max-h-80 overflow-y-auto">
                                        {soloFlow.pages.map((page) => (
                                            <DropdownMenuItem
                                                key={`solo-${page.id}`}
                                                onClick={() => handleNavigate(page.path)}
                                                data-testid={`link-preview-solo-${page.id}`}
                                            >
                                                {soloPageLabels[page.path] || page.path}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <span className="text-blue-600 dark:text-blue-400">Parcours Duo</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="max-h-80 overflow-y-auto">
                                        {duoFlow.pages.slice(0, 25).map((page) => (
                                            <DropdownMenuItem
                                                key={`duo-${page.id}`}
                                                onClick={() => handleNavigate(page.path)}
                                                data-testid={`link-preview-duo-${page.id}`}
                                            >
                                                {duoPageLabels[page.path] || page.path}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <span className="text-purple-600 dark:text-purple-400">Inversion des rôles</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="max-h-80 overflow-y-auto">
                                        {duoFlow.pages.slice(25).map((page) => (
                                            <DropdownMenuItem
                                                key={`inv-${page.id}`}
                                                onClick={() => handleNavigate(page.path)}
                                                data-testid={`link-preview-inv-${page.id}`}
                                            >
                                                {inversionPageLabels[page.path] || page.path}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
