import { useLocation } from 'wouter';
import { 
    Home, Shield, LogIn, Lock, Loader2, 
    User, Users, RefreshCw, Heart, MessageSquare,
    ChevronRight, HelpCircle
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Logo } from '@/components/logo';
import { soloFlow, duoFlow } from '@shared/schema';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const specialPages = [
    { path: '/welcome', label: 'Page d\'accueil', icon: Home },
    { path: '/duo/feedback', label: 'Feedback', icon: Heart },
    { path: '/duo/completion', label: 'Fin (Conversation terminée)', icon: Heart },
    { path: '/admin-login', label: 'Connexion Admin', icon: Shield },
    { path: '/admin', label: 'Dashboard Admin', icon: Shield },
    { path: '/support', label: 'Page Support', icon: HelpCircle },
];

const demoScreens = [
    { path: '/_demo/loading', label: 'Chargement', icon: Loader2 },
    { path: '/_demo/paywall', label: 'Paywall (Accès Réservé)', icon: Lock },
    { path: '/_demo/pin-creation', label: 'Création NIP (Bienvenue)', icon: Shield },
    { path: '/_demo/pin-login', label: 'Connexion NIP (Bon retour)', icon: LogIn },
];

const soloPageLabels: Record<string, string> = {
    '/solo/roles': 'Choix des rôles',
    '/solo/warnings': 'Avertissements',
    '/solo/intention': 'Intention',
    '/solo/sender-grounding': 'Ancrage émetteur',
    '/solo/receiver-grounding': 'Ancrage récepteur',
    '/solo/transition-1': 'Transition 1',
    '/solo/sender-situation': 'Situation',
    '/solo/sender-experience': 'Vécu',
    '/solo/sender-interpretation': 'Interprétation',
    '/solo/sender-impact': 'Impact',
    '/solo/sender-summary': 'Résumé émetteur',
    '/solo/receiver-validation': 'Validation récepteur',
    '/solo/sender-confirmation': 'Confirmation émetteur',
    '/solo/sender-clarification': 'Clarification',
    '/solo/receiver-experience': 'Vécu récepteur',
    '/solo/sender-validation': 'Validation émetteur',
    '/solo/receiver-confirmation': 'Confirmation récepteur',
    '/solo/transition-2': 'Transition 2',
    '/solo/sender-needs': 'Besoins émetteur',
    '/solo/receiver-response': 'Réponse récepteur',
    '/solo/transition-3': 'Transition 3',
    '/solo/sender-closing': 'Clôture émetteur',
    '/solo/receiver-closing': 'Clôture récepteur',
    '/solo/thanks': 'Remerciements',
    '/solo/feedback': 'Feedback',
    '/solo/completion': 'Fin',
};

const duoPageLabels: Record<string, string> = {
    '/duo/roles': 'Choix des rôles',
    '/duo/warnings': 'Avertissements',
    '/duo/intention': 'Intention',
    '/duo/sender-grounding': 'Ancrage émetteur',
    '/duo/receiver-grounding': 'Ancrage récepteur',
    '/duo/transition-1': 'Transition 1',
    '/duo/sender-situation': 'Situation',
    '/duo/sender-experience': 'Vécu',
    '/duo/sender-interpretation': 'Interprétation',
    '/duo/sender-impact': 'Impact',
    '/duo/sender-summary': 'Résumé émetteur',
    '/duo/receiver-validation': 'Validation récepteur',
    '/duo/sender-confirmation': 'Confirmation émetteur',
    '/duo/receiver-experience': 'Vécu récepteur',
    '/duo/sender-validation': 'Validation émetteur',
    '/duo/receiver-confirmation': 'Confirmation récepteur',
    '/duo/transition-2': 'Transition 2',
    '/duo/sender-needs': 'Besoins émetteur',
    '/duo/receiver-response': 'Réponse récepteur',
    '/duo/transition-3': 'Transition 3',
    '/duo/sender-closing': 'Clôture émetteur',
    '/duo/receiver-closing': 'Clôture récepteur',
    '/duo/feedback': 'Feedback',
    '/duo/completion': 'Fin (Conversation terminée)',
};

const inversionPageLabels: Record<string, string> = {
    '/duo/inversion-des-roles/page-7a': '7a. Situation',
    '/duo/inversion-des-roles/page-8a': '8a. Vécu',
    '/duo/inversion-des-roles/page-9a': '9a. Interprétation',
    '/duo/inversion-des-roles/page-10a': '10a. Impact',
    '/duo/inversion-des-roles/page-11a': '11a. Résumé',
    '/duo/inversion-des-roles/page-12a': '12a. Validation',
    '/duo/inversion-des-roles/page-13a': '13a. Confirmation',
    '/duo/inversion-des-roles/page-14a': '14a. Vécu récepteur',
    '/duo/inversion-des-roles/page-15a': '15a. Validation',
    '/duo/inversion-des-roles/page-16a': '16a. Confirmation',
    '/duo/inversion-des-roles/page-17a': '17a. Transition',
    '/duo/inversion-des-roles/page-18a': '18a. Besoins',
    '/duo/inversion-des-roles/page-19a': '19a. Réponse',
    '/duo/inversion-des-roles/page-20a': '20a. Transition',
};

interface CollapsibleSectionProps {
    title: string;
    icon: React.ElementType;
    color: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

function CollapsibleSection({ title, icon: Icon, color, defaultOpen = false, children }: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarGroup>
                <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="cursor-pointer hover-elevate flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <Icon className={cn("h-4 w-4", color)} />
                            <span>{title}</span>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
                    </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        {children}
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

export function AdminPreviewSidebar() {
    const [location, setLocation] = useLocation();

    const handleNavigate = (path: string) => {
        setLocation(path);
    };

    const isActive = (path: string) => location === path;

    return (
        <Sidebar>
            <SidebarHeader className="border-b p-4">
                <div className="flex items-center gap-2">
                    <Logo size="sm" />
                    <div>
                        <p className="text-sm font-semibold">Mode Prévisualisation</p>
                        <p className="text-xs text-muted-foreground">Admin uniquement</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="overflow-y-auto">
                <CollapsibleSection title="Écrans de démonstration" icon={Loader2} color="text-orange-500" defaultOpen={true}>
                    <SidebarMenu>
                        {demoScreens.map((screen) => (
                            <SidebarMenuItem key={screen.path}>
                                <SidebarMenuButton
                                    onClick={() => handleNavigate(screen.path)}
                                    isActive={isActive(screen.path)}
                                    data-testid={`sidebar-demo-${screen.path.replace(/\//g, '-')}`}
                                >
                                    <screen.icon className="h-4 w-4" />
                                    <span>{screen.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleSection>

                <CollapsibleSection title="Pages spéciales" icon={Shield} color="text-foreground">
                    <SidebarMenu>
                        {specialPages.map((page) => (
                            <SidebarMenuItem key={page.path}>
                                <SidebarMenuButton
                                    onClick={() => handleNavigate(page.path)}
                                    isActive={isActive(page.path)}
                                    data-testid={`sidebar-link-${page.path.replace(/\//g, '-') || 'home'}`}
                                >
                                    <page.icon className="h-4 w-4" />
                                    <span>{page.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleSection>

                <CollapsibleSection title="Parcours Solo" icon={User} color="text-red-500">
                    <SidebarMenu>
                        {soloFlow.pages.map((page, index) => (
                            <SidebarMenuItem key={`solo-${page.id}`}>
                                <SidebarMenuButton
                                    onClick={() => handleNavigate(page.path)}
                                    isActive={isActive(page.path) && location.startsWith('/solo')}
                                    data-testid={`sidebar-solo-${page.id}`}
                                >
                                    <span className="text-xs text-muted-foreground w-6">{index}.</span>
                                    <span className="truncate">{soloPageLabels[page.path] || page.path}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleSection>

                <CollapsibleSection title="Parcours Duo" icon={Users} color="text-blue-500">
                    <SidebarMenu>
                        {duoFlow.pages.slice(0, 23).map((page, index) => (
                            <SidebarMenuItem key={`duo-${page.id}`}>
                                <SidebarMenuButton
                                    onClick={() => handleNavigate(page.path)}
                                    isActive={isActive(page.path) && location.startsWith('/duo') && !location.includes('inversion')}
                                    data-testid={`sidebar-duo-${page.id}`}
                                >
                                    <span className="text-xs text-muted-foreground w-6">{index}.</span>
                                    <span className="truncate">{duoPageLabels[page.path] || page.path}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleSection>

                <CollapsibleSection title="Inversion des rôles" icon={RefreshCw} color="text-purple-500">
                    <SidebarMenu>
                        {duoFlow.pages.slice(25).map((page) => (
                            <SidebarMenuItem key={`inv-${page.id}`}>
                                <SidebarMenuButton
                                    onClick={() => handleNavigate(page.path)}
                                    isActive={isActive(page.path)}
                                    data-testid={`sidebar-inv-${page.id}`}
                                >
                                    <span className="truncate">{inversionPageLabels[page.path] || page.path}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleSection>
            </SidebarContent>

            <SidebarFooter className="border-t p-3 bg-sidebar">
                <p className="text-xs text-muted-foreground text-center">
                    Naviguez pour vérifier le design
                </p>
            </SidebarFooter>
        </Sidebar>
    );
}
