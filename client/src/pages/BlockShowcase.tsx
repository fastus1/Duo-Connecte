import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, AlertTriangle, CheckCheck, MessageCircle } from 'lucide-react';
import { HeroIcon, PageTitle, Subtitle, BulletList, Callout, CtaButton, RoleIndicator, WarningCard, Logo, ArrowsIcon } from '@/components/flow';

export default function BlockShowcase() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/admin')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Design System</h1>
            <p className="text-muted-foreground">Bibliothèque des blocs réutilisables</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Logo complet avec texte "AVANCER SIMPLEMENT". S'adapte au mode clair/sombre.</p>
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <Logo size="sm" />
                </div>
                <span className="text-xs text-muted-foreground">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <Logo size="md" />
                </div>
                <span className="text-xs text-muted-foreground">md</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <Logo size="lg" />
                </div>
                <span className="text-xs text-muted-foreground">lg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ArrowsIcon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Icône des flèches seule (sans texte). S'adapte au mode clair/sombre.</p>
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <ArrowsIcon size="sm" />
                </div>
                <span className="text-xs text-muted-foreground">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <ArrowsIcon size="md" />
                </div>
                <span className="text-xs text-muted-foreground">md</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <ArrowsIcon size="lg" />
                </div>
                <span className="text-xs text-muted-foreground">lg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HeroIcon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Icône dans un cercle coloré, utilisé en haut de chaque page.</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center gap-2">
                <HeroIcon icon={Heart} variant="primary" />
                <span className="text-xs text-muted-foreground">primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <HeroIcon icon={AlertTriangle} variant="destructive" />
                <span className="text-xs text-muted-foreground">destructive</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <HeroIcon icon={CheckCheck} variant="success" />
                <span className="text-xs text-muted-foreground">success</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PageTitle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Titre principal de la page, centré, police serif.</p>
            <div className="py-4 border rounded-lg bg-background">
              <PageTitle>Se connecter</PageTitle>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subtitle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Texte d'introduction sous le titre.</p>
            <div className="py-4 border rounded-lg bg-background px-4">
              <Subtitle>
                Vous avez choisi d'avoir une conversation authentique. C'est un beau geste de confiance.
              </Subtitle>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BulletList</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Liste à puces avec points colorés alignés.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-xs text-muted-foreground mb-2">primary</p>
                <BulletList 
                  items={[
                    "Premier point important",
                    "Deuxième point à retenir",
                    "Troisième élément clé"
                  ]} 
                  variant="primary"
                />
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-xs text-muted-foreground mb-2">destructive</p>
                <BulletList 
                  items={[
                    "Attention à ceci",
                    "Ne pas oublier cela",
                    "Point critique"
                  ]} 
                  variant="destructive"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Callout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Encadré pour mettre en valeur une information.</p>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">primary (avec titre)</p>
                <Callout title="Conseil" variant="primary">
                  Assurez-vous d'avoir 30 à 45 minutes devant vous, sans interruption.
                </Callout>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">primary (sans titre)</p>
                <Callout variant="primary">
                  L'objectif est que l'autre comprenne vraiment ce que tu vis.
                </Callout>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">destructive</p>
                <Callout title="Attention" variant="destructive">
                  Cet outil n'est pas un substitut à une thérapie relationnelle.
                </Callout>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">neutral</p>
                <Callout variant="neutral">
                  Information neutre sans accent de couleur particulier.
                </Callout>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RoleIndicator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Indicateur de qui parle ou écoute.</p>
            <div className="space-y-3">
              <RoleIndicator name="Marie" role="speaking" />
              <RoleIndicator name="Pierre" role="listening" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WarningCard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Carte d'avertissement avec icône danger.</p>
            <div className="space-y-3">
              <WarningCard>
                Cet outil n'est pas un substitut à une thérapie relationnelle
              </WarningCard>
              <WarningCard>
                Le piège principal est d'aller trop vite. Un rythme lent est essentiel.
              </WarningCard>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CtaButton</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Bouton d'action principal avec barre de progression optionnelle.</p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-xs text-muted-foreground mb-2">primary</p>
                <CtaButton onClick={() => {}} variant="primary">
                  Continuer
                </CtaButton>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-xs text-muted-foreground mb-2">destructive (outline)</p>
                <CtaButton onClick={() => {}} variant="destructive">
                  J'ai compris, continuer
                </CtaButton>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-xs text-muted-foreground mb-2">avec icône</p>
                <CtaButton onClick={() => {}} icon={CheckCheck}>
                  J'ai été entendu
                </CtaButton>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <p className="text-xs text-muted-foreground mb-2">avec progression</p>
                <CtaButton onClick={() => {}} isLoading={true} progress={65}>
                  Chargement...
                </CtaButton>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
