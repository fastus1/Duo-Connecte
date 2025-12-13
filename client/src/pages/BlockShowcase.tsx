import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Heart, AlertTriangle, CheckCheck, Copy, Check, ChevronDown, FileText, Plus, Users, MessageSquare, RefreshCw, Smile, User, UserCheck, Settings } from 'lucide-react';
import { HeroIcon, PageTitle, Subtitle, BulletList, Callout, CtaButton, RoleIndicator, WarningCard, Logo, ArrowsIcon, ChoiceCards, StarRating, TextQuestion, ExplanationModal, QuoteBlock, TipCard, Separator, StepProgress, ToggleCard } from '@/components/flow';

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
  const [demoRating, setDemoRating] = useState(0);
  const [demoText, setDemoText] = useState('');
  const [demoToggle1, setDemoToggle1] = useState(false);
  const [demoToggle2, setDemoToggle2] = useState(true);
  const [stickyTop, setStickyTop] = useState('0px');

  useEffect(() => {
    const updateStickyTop = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue('--global-header-height').trim();
      setStickyTop(value || '0px');
    };

    updateStickyTop();

    const intervalId = setInterval(updateStickyTop, 100);
    setTimeout(() => clearInterval(intervalId), 2000);

    const observer = new MutationObserver(updateStickyTop);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

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
        <Card className="border-primary/30 bg-card sticky z-10 shadow-lg" style={{ top: stickyTop }}>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">muted (gris)</p>
                <Subtitle variant="muted">
                  Texte en gris, plus discret.
                </Subtitle>
                <AddButton template={`Subtitle (muted): "Texte..."`} onAdd={handleAddTemplate} label="muted" />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">default (blanc/noir)</p>
                <Subtitle variant="default">
                  Texte en couleur principale.
                </Subtitle>
                <AddButton template={`Subtitle (default): "Texte..."`} onAdd={handleAddTemplate} label="default" />
              </div>
            </div>
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

        <Card>
          <CardHeader>
            <CardTitle>ChoiceCards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Cartes de choix avec icône, titre, description et bouton. Flexible de 1 à 3 cartes.
            </p>
            
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium">1 carte</p>
              <div className="p-4 border rounded-lg bg-background">
                <ChoiceCards cards={[
                  { icon: Heart, title: "Option A", description: "Description A", buttonText: "Choisir A" }
                ]} />
              </div>
              <AddButton 
                template={`ChoiceCards (1):\n  - Icon: Heart, Title: "Option A", Description: "...", Button: "Action"`} 
                onAdd={handleAddTemplate} 
                label="1 carte" 
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium">2 cartes</p>
              <div className="p-4 border rounded-lg bg-background">
                <ChoiceCards cards={[
                  { icon: Heart, title: "Option A", description: "Description A", buttonText: "Choisir A" },
                  { icon: Users, title: "Option B", description: "Description B", buttonText: "Choisir B" }
                ]} />
              </div>
              <AddButton 
                template={`ChoiceCards (2):\n  - Icon: Heart, Title: "Option A", Description: "...", Button: "Action"\n  - Icon: Users, Title: "Option B", Description: "...", Button: "Action"`} 
                onAdd={handleAddTemplate} 
                label="2 cartes" 
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium">2 cartes avec sous-titre</p>
              <div className="p-4 border rounded-lg bg-background">
                <ChoiceCards cards={[
                  { icon: MessageSquare, title: "Option A", subtitle: "Sous-titre A", description: "Description A", buttonText: "Choisir A" },
                  { icon: RefreshCw, title: "Option B", subtitle: "Sous-titre B", description: "Description B", buttonText: "Choisir B" }
                ]} />
              </div>
              <AddButton 
                template={`ChoiceCards (2):\n  - Icon: MessageSquare, Title: "Option A", Subtitle: "Sous-titre A", Description: "...", Button: "Action"\n  - Icon: RefreshCw, Title: "Option B", Subtitle: "Sous-titre B", Description: "...", Button: "Action"`} 
                onAdd={handleAddTemplate} 
                label="2 cartes + sous-titre" 
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium">3 cartes</p>
              <div className="p-4 border rounded-lg bg-background">
                <ChoiceCards cards={[
                  { icon: User, title: "Option A", description: "Description A", buttonText: "Choisir A" },
                  { icon: Users, title: "Option B", description: "Description B", buttonText: "Choisir B" },
                  { icon: Smile, title: "Option C", description: "Description C", buttonText: "Choisir C" }
                ]} />
              </div>
              <AddButton 
                template={`ChoiceCards (3):\n  - Icon: User, Title: "Option A", Description: "...", Button: "Action"\n  - Icon: Users, Title: "Option B", Description: "...", Button: "Action"\n  - Icon: Smile, Title: "Option C", Description: "...", Button: "Action"`} 
                onAdd={handleAddTemplate} 
                label="3 cartes" 
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium">4 cartes</p>
              <div className="p-4 border rounded-lg bg-background">
                <ChoiceCards cards={[
                  { icon: Heart, title: "Option A", description: "Description A", buttonText: "Choisir A" },
                  { icon: MessageSquare, title: "Option B", description: "Description B", buttonText: "Choisir B" },
                  { icon: UserCheck, title: "Option C", description: "Description C", buttonText: "Choisir C" },
                  { icon: Settings, title: "Option D", description: "Description D", buttonText: "Choisir D" }
                ]} />
              </div>
              <AddButton 
                template={`ChoiceCards (4):\n  - Icon: Heart, Title: "Option A", Description: "...", Button: "Action"\n  - Icon: MessageSquare, Title: "Option B", Description: "...", Button: "Action"\n  - Icon: UserCheck, Title: "Option C", Description: "...", Button: "Action"\n  - Icon: Settings, Title: "Option D", Description: "...", Button: "Action"`} 
                onAdd={handleAddTemplate} 
                label="4 cartes" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>StarRating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Système de notation par étoiles cliquables.</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">sm</p>
                <StarRating value={demoRating} onChange={setDemoRating} size="sm" />
                <AddButton template='StarRating (sm)' onAdd={handleAddTemplate} label="sm" />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">md</p>
                <StarRating value={demoRating} onChange={setDemoRating} size="md" />
                <AddButton template='StarRating (md)' onAdd={handleAddTemplate} label="md" />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">lg (défaut)</p>
                <StarRating value={demoRating} onChange={setDemoRating} size="lg" />
                <AddButton template='StarRating (lg)' onAdd={handleAddTemplate} label="lg" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Valeur actuelle : {demoRating}/5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TextQuestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Champ de texte avec label et placeholder.</p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <TextQuestion
                  label="Qu'est-ce qui a été le plus utile?"
                  value={demoText}
                  onChange={setDemoText}
                  placeholder="Par exemple: la structure étape par étape..."
                  optional
                />
                <AddButton 
                  template='TextQuestion (optional): "Question?" placeholder="Exemple..."' 
                  onAdd={handleAddTemplate} 
                  label="optionnel" 
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <TextQuestion
                  label="Votre message"
                  value={demoText}
                  onChange={setDemoText}
                  placeholder="Écrivez ici..."
                />
                <AddButton 
                  template='TextQuestion: "Question?" placeholder="Exemple..."' 
                  onAdd={handleAddTemplate} 
                  label="requis" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ExplanationModal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Popup fullscreen pour explications détaillées avec support audio optionnel.
            </p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Sans audio</p>
                <ExplanationModal
                  triggerText="En savoir plus"
                  title="Qu'est-ce que le vécu?"
                >
                  <p className="text-foreground leading-relaxed mb-4">
                    Le vécu désigne l'ensemble des sensations, émotions et ressentis que vous avez expérimentés dans une situation donnée.
                  </p>
                  <p className="text-foreground leading-relaxed mb-4">
                    Il s'agit de ce que vous avez ressenti "dans votre corps" : tension, chaleur, froid, oppression, légèreté, etc.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Exprimer son vécu permet à l'autre de mieux comprendre l'impact émotionnel d'une situation sur vous.
                  </p>
                </ExplanationModal>
                <AddButton 
                  template={`ExplanationModal: "Titre"\n  triggerText: "En savoir plus"\n  Contenu: paragraphes d'explication`} 
                  onAdd={handleAddTemplate} 
                  label="sans audio" 
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Avec audio</p>
                <ExplanationModal
                  triggerText="Écouter l'explication"
                  title="L'importance de l'ancrage"
                  audioSrc="/audio/example.mp3"
                >
                  <p className="text-foreground leading-relaxed mb-4">
                    L'ancrage est une technique qui permet de se recentrer sur le moment présent avant d'entamer une conversation importante.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Il aide à réduire le stress et à aborder l'échange avec plus de clarté mentale.
                  </p>
                </ExplanationModal>
                <AddButton 
                  template={`ExplanationModal: "Titre"\n  triggerText: "Écouter l'explication"\n  audioSrc: "/audio/fichier.mp3"\n  Contenu: paragraphes d'explication`} 
                  onAdd={handleAddTemplate} 
                  label="avec audio" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QuoteBlock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Citation mise en valeur avec guillemets décoratifs.
            </p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Sans auteur</p>
                <QuoteBlock>
                  Prendre le temps de s'exprimer, c'est se donner la chance d'être entendu.
                </QuoteBlock>
                <AddButton 
                  template={`QuoteBlock: "Votre citation ici"`} 
                  onAdd={handleAddTemplate} 
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Avec auteur</p>
                <QuoteBlock author="Marshall Rosenberg">
                  Derrière chaque comportement, il y a un besoin qui cherche à être satisfait.
                </QuoteBlock>
                <AddButton 
                  template={`QuoteBlock: "Citation"\n  author: "Nom de l'auteur"`} 
                  onAdd={handleAddTemplate} 
                  label="avec auteur"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TipCard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Carte conseil avec icône ampoule pour donner des astuces pratiques.
            </p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Titre par défaut</p>
                <TipCard>
                  Prends une grande respiration avant de commencer à t'exprimer. Cela t'aidera à te recentrer.
                </TipCard>
                <AddButton 
                  template={`TipCard: "Texte du conseil"`} 
                  onAdd={handleAddTemplate} 
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Titre personnalisé</p>
                <TipCard title="Astuce">
                  Tu peux reformuler ce que tu as entendu pour t'assurer d'avoir bien compris.
                </TipCard>
                <AddButton 
                  template={`TipCard: "Texte du conseil"\n  title: "Titre personnalisé"`} 
                  onAdd={handleAddTemplate} 
                  label="titre custom"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Separator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ligne de séparation stylisée avec 3 variantes.
            </p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Ligne simple</p>
                <Separator variant="line" />
                <AddButton 
                  template={`Separator: line`} 
                  onAdd={handleAddTemplate} 
                  label="line"
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Points</p>
                <Separator variant="dots" />
                <AddButton 
                  template={`Separator: dots`} 
                  onAdd={handleAddTemplate} 
                  label="dots"
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Gradient</p>
                <Separator variant="gradient" />
                <AddButton 
                  template={`Separator: gradient`} 
                  onAdd={handleAddTemplate} 
                  label="gradient"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>StepProgress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Indicateur de progression avec 3 variantes visuelles.
            </p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Points</p>
                <StepProgress currentStep={3} totalSteps={5} variant="dots" />
                <AddButton 
                  template={`StepProgress: 3/5 (dots)`} 
                  onAdd={handleAddTemplate} 
                  label="dots"
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Barres</p>
                <StepProgress currentStep={2} totalSteps={4} variant="bars" />
                <AddButton 
                  template={`StepProgress: 2/4 (bars)`} 
                  onAdd={handleAddTemplate} 
                  label="bars"
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Numéros</p>
                <StepProgress currentStep={2} totalSteps={4} variant="numbers" />
                <AddButton 
                  template={`StepProgress: 2/4 (numbers)`} 
                  onAdd={handleAddTemplate} 
                  label="numbers"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ToggleCard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Carte avec switch on/off pour des options binaires.
            </p>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Simple</p>
                <ToggleCard 
                  label="Activer les notifications"
                  checked={demoToggle1}
                  onChange={setDemoToggle1}
                />
                <AddButton 
                  template={`ToggleCard: "Label"\n  checked: false\n  onChange: handler`} 
                  onAdd={handleAddTemplate} 
                />
              </div>
              <div className="p-4 border rounded-lg bg-background space-y-3">
                <p className="text-xs text-muted-foreground mb-2">Avec description</p>
                <ToggleCard 
                  label="Mode silencieux"
                  description="Désactive tous les sons de l'application"
                  checked={demoToggle2}
                  onChange={setDemoToggle2}
                />
                <AddButton 
                  template={`ToggleCard: "Label"\n  description: "Description"\n  checked: true\n  onChange: handler`} 
                  onAdd={handleAddTemplate} 
                  label="avec desc"
                />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
