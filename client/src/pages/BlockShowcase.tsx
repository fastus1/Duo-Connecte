import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Heart, AlertTriangle, CheckCheck, Copy, Check, ChevronDown, FileText, Plus } from 'lucide-react';
import { HeroIcon, PageTitle, Subtitle, BulletList, Callout, CtaButton, RoleIndicator, WarningCard, Logo, ArrowsIcon } from '@/components/flow';

function AddButton({ template, onAdd, label }: { template: string; onAdd: (t: string) => void; label?: string }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(template);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleAdd}
      className="gap-1.5 text-xs"
      data-testid="button-add-template"
    >
      {added ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
      {added ? 'Ajouté!' : (label || 'Ajouter')}
    </Button>
  );
}

export default function BlockShowcase() {
  const [, setLocation] = useLocation();
  const [composerOpen, setComposerOpen] = useState(true);
  const [composerText, setComposerText] = useState('');
  const [allCopied, setAllCopied] = useState(false);

  const handleAddTemplate = (template: string) => {
    setComposerText(prev => prev ? `${prev}\n${template}` : template);
  };

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
        <Card className="border-primary/30 bg-primary/5 sticky top-4 z-10">
          <Collapsible open={composerOpen} onOpenChange={setComposerOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover-elevate">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Composer
                    {composerText && <span className="text-xs font-normal text-muted-foreground">({composerText.split('\n').filter(l => l.trim()).length} blocs)</span>}
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${composerOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Cliquez sur les boutons "Ajouter" pour construire votre page. Modifiez le texte si nécessaire.
                </p>
                <Textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder={`Cliquez sur "Ajouter" sur les blocs ci-dessous...`}
                  className="min-h-[150px] font-mono text-sm"
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
          <CardHeader>
            <CardTitle>Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Logo complet avec texte "AVANCER SIMPLEMENT".</p>
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <Logo size="sm" />
                </div>
                <AddButton template='Logo (sm)' onAdd={handleAddTemplate} label="sm" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <Logo size="md" />
                </div>
                <AddButton template='Logo (md)' onAdd={handleAddTemplate} label="md" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <Logo size="lg" />
                </div>
                <AddButton template='Logo (lg)' onAdd={handleAddTemplate} label="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ArrowsIcon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Icône des flèches seule (sans texte).</p>
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <ArrowsIcon size="sm" />
                </div>
                <AddButton template='ArrowsIcon (sm)' onAdd={handleAddTemplate} label="sm" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <ArrowsIcon size="md" />
                </div>
                <AddButton template='ArrowsIcon (md)' onAdd={handleAddTemplate} label="md" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg bg-background">
                  <ArrowsIcon size="lg" />
                </div>
                <AddButton template='ArrowsIcon (lg)' onAdd={handleAddTemplate} label="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HeroIcon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Icône dans un cercle coloré. Icônes: Heart, AlertTriangle, CheckCheck, MessageCircle, etc.</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center gap-2">
                <HeroIcon icon={Heart} variant="primary" />
                <AddButton template='HeroIcon (primary, Heart)' onAdd={handleAddTemplate} label="primary" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <HeroIcon icon={AlertTriangle} variant="destructive" />
                <AddButton template='HeroIcon (destructive, AlertTriangle)' onAdd={handleAddTemplate} label="destructive" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <HeroIcon icon={CheckCheck} variant="success" />
                <AddButton template='HeroIcon (success, CheckCheck)' onAdd={handleAddTemplate} label="success" />
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
            <AddButton template='PageTitle: "Titre de la page"' onAdd={handleAddTemplate} />
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
            <AddButton template={`Subtitle: "Texte d'introduction..."`} onAdd={handleAddTemplate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BulletList</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Liste à puces avec points colorés.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <BulletList 
                  items={["Premier point", "Deuxième point", "Troisième point"]} 
                  variant="primary"
                />
                <AddButton template='BulletList (primary): ["Point 1", "Point 2", "Point 3"]' onAdd={handleAddTemplate} label="primary" />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <BulletList 
                  items={["Attention à ceci", "Ne pas oublier"]} 
                  variant="destructive"
                />
                <AddButton template='BulletList (destructive): ["Point 1", "Point 2"]' onAdd={handleAddTemplate} label="destructive" />
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
              <div className="space-y-2">
                <Callout title="Conseil" variant="primary">
                  Assurez-vous d'avoir 30 à 45 minutes devant vous.
                </Callout>
                <AddButton template='Callout (primary, "Conseil"): "Contenu..."' onAdd={handleAddTemplate} label="primary + titre" />
              </div>
              <div className="space-y-2">
                <Callout variant="primary">
                  L'objectif est que l'autre comprenne vraiment ce que tu vis.
                </Callout>
                <AddButton template='Callout (primary): "Contenu..."' onAdd={handleAddTemplate} label="primary" />
              </div>
              <div className="space-y-2">
                <Callout title="Attention" variant="destructive">
                  Cet outil n'est pas un substitut à une thérapie relationnelle.
                </Callout>
                <AddButton template='Callout (destructive, "Attention"): "Contenu..."' onAdd={handleAddTemplate} label="destructive + titre" />
              </div>
              <div className="space-y-2">
                <Callout variant="neutral">
                  Information neutre sans accent de couleur particulier.
                </Callout>
                <AddButton template='Callout (neutral): "Contenu..."' onAdd={handleAddTemplate} label="neutral" />
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
              <div className="flex items-center gap-4">
                <RoleIndicator name="Marie" role="speaking" />
                <AddButton template='RoleIndicator (speaking): "Nom"' onAdd={handleAddTemplate} label="speaking" />
              </div>
              <div className="flex items-center gap-4">
                <RoleIndicator name="Pierre" role="listening" />
                <AddButton template='RoleIndicator (listening): "Nom"' onAdd={handleAddTemplate} label="listening" />
              </div>
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
              <AddButton template={`WarningCard: "Message d'avertissement"`} onAdd={handleAddTemplate} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CtaButton</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Bouton d'action principal.</p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <CtaButton onClick={() => {}} variant="primary">
                  Continuer
                </CtaButton>
                <AddButton template='CtaButton (primary): "Continuer"' onAdd={handleAddTemplate} label="primary" />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <CtaButton onClick={() => {}} variant="destructive">
                  J'ai compris, continuer
                </CtaButton>
                <AddButton template='CtaButton (destructive): "Texte..."' onAdd={handleAddTemplate} label="destructive" />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <CtaButton onClick={() => {}} icon={CheckCheck}>
                  J'ai été entendu
                </CtaButton>
                <AddButton template='CtaButton (primary, CheckCheck): "Texte..."' onAdd={handleAddTemplate} label="avec icône" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
