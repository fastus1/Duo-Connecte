export default function DemoLoadingScreen() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto">
                    <img
                        src="/logo-blue.png"
                        alt="Logo"
                        className="w-16 h-16 animate-pulse dark:hidden"
                    />
                    <img
                        src="/logo-white.png"
                        alt="Logo"
                        className="w-16 h-16 animate-pulse hidden dark:block"
                    />
                </div>
                <p className="text-muted-foreground">Vérification de l'accès...</p>
            </div>
        </div>
    );
}
