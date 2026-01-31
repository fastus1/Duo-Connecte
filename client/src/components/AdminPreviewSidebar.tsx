import { useLocation } from 'wouter';
import { Home, Shield, HelpCircle } from 'lucide-react';
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
import { Logo } from '@/components/logo';

const templatePages = [
    { path: '/welcome', label: 'Welcome Page', icon: Home },
    { path: '/admin-login', label: 'Admin Login', icon: Shield },
    { path: '/admin', label: 'Admin Dashboard', icon: Shield },
    { path: '/support', label: 'Support Page', icon: HelpCircle },
];

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
                        <p className="text-sm font-semibold">Preview Mode</p>
                        <p className="text-xs text-muted-foreground">Admin only</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="overflow-y-auto">
                <SidebarGroup>
                    <SidebarGroupLabel className="py-2">
                        <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span>Template Pages</span>
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {templatePages.map((page) => (
                                <SidebarMenuItem key={page.path}>
                                    <SidebarMenuButton
                                        onClick={() => handleNavigate(page.path)}
                                        isActive={isActive(page.path)}
                                    >
                                        <page.icon className="h-4 w-4" />
                                        <span>{page.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-3 bg-sidebar">
                <p className="text-xs text-muted-foreground text-center">
                    Navigate to verify design
                </p>
            </SidebarFooter>
        </Sidebar>
    );
}
