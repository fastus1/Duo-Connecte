import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Heart, AlertTriangle, CheckCheck, Copy, Check, ChevronDown, FileText } from 'lucide-react';
import { HeroIcon, PageTitle, Subtitle, BulletList, Callout, CtaButton, RoleIndicator, WarningCard, Logo, ArrowsIcon } from '@/components/flow';

function CopyButton({ template }: { template: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
      data-testid="button-copy-template"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copié!' : 'Copier'}
    </Button>
  );
}

export default function BlockShowcase() {
  const [, setLocation] = useLocation();
  const [composerOpen, setComposerOpen] = useState(true);
  const [composerText, setComposerText] = useState('');
  const [allCopied, setAllCopied] = useState(false);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(composerText);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

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

        {/* Composer Panel */}
        <Card className="border-primary/30 bg-primary/5">
          <Collapsible open={composerOpen} onOpenChange={setComposerOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover-elevate">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Composer
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${composerOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Cliquez sur "Copier" à côté de chaque bloc, puis collez ici. Modifiez le texte selon vos besoins.
                </p>
                <Textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder={`Logo (md)\nHeroIcon (primary, Heart)\nPageTitle: "Titre de la page"\nSubtitle: "Texte d'introduction..."\nBulletList (primary): ["Point 1", "Point 2"]\nCallout (primary): "Conseil important"\nCtaButton (primary): "Continuer"`}
                  className="min-h-[200px] font-mono text-sm"
                  data-testid="textarea-composer"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleCopyAll}
                    disabled={!composerText.trim()}
                    className="gap-2"
                    data-testid="button-copy-all"
                  >
                    {allCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {allCopied ? 'Copié!' : 'Copier tout'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setComposerText('')}
                    disabled={!composerText.trim()}
                    data-testid="button-clear-composer"
                  >
                    Effacer
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Blocks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Logo</CardTitle>
            <CopyButton template='Logo (md)' />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Logo complet avec texte "AVANCER SIMPLEMENT". Tailles: sm, md, lg, xl</p>
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
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>ArrowsIcon</CardTitle>
            <CopyButton template='ArrowsIcon (md)' />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Icône des flèches seule (sans texte). Tailles: sm, md, lg</p>
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
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>HeroIcon</CardTitle>
            <CopyButton template='HeroIcon (primary, Heart)' />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Icône dans un cercle coloré. Variantes: primary, destructive, success. Icônes: Heart, AlertTriangle, CheckCheck, etc.</p>
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
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>PageTitle</CardTitle>
            <CopyButton template='PageTitle: "Titre de la page"' />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Titre principal de la page, centré, police serif.</p>
            <div className="py-4 border rounded-lg bg-background">
              <PageTitle>Se connecter</PageTitle>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Subtitle</CardTitle>
            <CopyButton template={`Subtitle: "Texte d'introduction..."`} />
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
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>BulletList</CardTitle>
            <CopyButton template='BulletList (primary): ["Point 1", "Point 2", "Point 3"]' />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Liste à puces. Variantes: primary, destructive</p>
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
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Callout</CardTitle>
            <CopyButton template='Callout (primary, "Titre"): "Contenu du conseil"' />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Encadré pour mettre en valeur. Variantes: primary, destructive, neutral. Titre optionnel.</p>
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
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>RoleIndicator</CardTitle>
            <CopyButton template='RoleIndicator (speaking): "Marie"' />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Indicateur de rôle. Rôles: speaking, listening</p>
            <div className="space-y-3">
              <RoleIndicator name="Marie" role="speaking" />
              <RoleIndicator name="Pierre" role="listening" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>WarningCard</CardTitle>
            <CopyButton template={`WarningCard: "Message d'avertissement"`} />
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
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>CtaButton</CardTitle>
            <CopyButton template='CtaButton (primary): "Continuer"' />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Bouton d'action. Variantes: primary, destructive. Icône optionnelle.</p>
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
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
