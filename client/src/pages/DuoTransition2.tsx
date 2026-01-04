import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Lightbulb, Layers, Target, Gift, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';

export default function Transition2() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(18);
  };

  const theoryPages = [
    {
      title: "Vers les besoins",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Cette transition marque le passage de l'expression du vécu vers l'identification de vos besoins. C'est une étape délicate mais essentielle pour transformer votre compréhension mutuelle en pistes concrètes.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Pourquoi parler des besoins maintenant</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Vous venez de partager vos vécus et de vous valider mutuellement. Vous avez créé ensemble un espace de confiance où les besoins peuvent maintenant être identifiés, clarifiés, puis exprimés et accueillis.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Deux phases distinctes",
      icon: Layers,
      content: (
        <div className="space-y-8">
          <Subtitle>Deux phases distinctes : Introspection et Expression</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Avant d'exprimer votre besoin à votre partenaire, vous allez d'abord faire un travail d'introspection rapide pour identifier ce dont vous avez besoin.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-medium text-foreground mb-2">Phase 1 - Introspection (pour vous)</p>
              <p className="text-muted-foreground">Besoin → Désir → Demande</p>
              <p className="text-sm text-muted-foreground mt-2">
                Cette progression interne vous aide à passer d'un malaise flou à une proposition claire.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-medium text-foreground mb-2">Phase 2 - Expression (à votre partenaire)</p>
              <p className="text-muted-foreground">"J'ai besoin de..." + "Pourrais-tu...?"</p>
              <p className="text-sm text-muted-foreground mt-2">
                Vous exprimez votre besoin et votre demande. Le désir reste dans votre réflexion.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Le besoin",
      icon: Target,
      content: (
        <div className="space-y-8">
          <Subtitle>La structure d'introspection : Besoin → Désir → Demande</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Comprendre cette progression change tout dans votre communication.
          </p>
          
          <div className="space-y-4">
            <Subtitle>1. Le besoin (non négociable)</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              C'est ce qui nourrit votre bien-être fondamental. Le besoin est universel et légitime par nature. Personne ne peut vous dire "tu ne devrais pas avoir ce besoin".
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground font-medium">
              Exemples de besoins : respect, sécurité émotionnelle, connexion, reconnaissance, autonomie, être entendu.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Le désir",
      icon: Gift,
      content: (
        <div className="space-y-8">
          <Subtitle>2. Le désir (une voie parmi d'autres)</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Le désir est une façon possible de combler votre besoin. Il existe toujours de multiples voies pour répondre au même besoin. Le désir ouvre des possibilités, il n'impose pas une solution unique.
          </p>
        </div>
      )
    },
    {
      title: "La demande",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <Subtitle>3. La demande (manifestation concrète du désir)</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            La demande exprime votre désir de façon claire et actionnable. C'est votre proposition pour combler le besoin. Elle est négociable, adaptable, et peut être ajustée selon ce qui fonctionne pour vous deux.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-medium">
            La demande, elle, sera exprimée clairement à votre partenaire.
          </p>
        </div>
      )
    },
    {
      title: "Exemple complet",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <Subtitle>Exemple complet du processus</Subtitle>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium text-foreground mb-3">Introspection (ce qui se passe en vous) :</p>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="text-primary font-medium">Besoin :</span> "J'ai besoin de me sentir respecté et écouté"</p>
                <p><span className="text-primary font-medium">Désir :</span> "Je désire avoir son attention visuelle quand on se parle"</p>
                <p><span className="text-primary font-medium">Demande :</span> "Pourrais-tu me regarder quand je te parle?"</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-medium text-foreground mb-3">Expression (ce que vous dites à votre partenaire) :</p>
              <p className="text-muted-foreground italic">
                "J'ai besoin de me sentir respecté et écouté. Pourrais-tu faire attention de me regarder quand je te parle? Ça ferait une vraie différence pour moi."
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Autres exemples",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <Subtitle>Autres exemples</Subtitle>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Exemple 1 :</p>
              <p className="text-sm text-muted-foreground">
                Introspection : Besoin de sécurité émotionnelle → Désir de prévisibilité → Demande de communication
              </p>
              <Callout variant="neutral">
                <p className="text-base italic">
                  "J'ai besoin de sécurité émotionnelle. Pourrais-tu me prévenir si tu as besoin de temps seul, plutôt que de partir sans explication?"
                </p>
              </Callout>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-foreground">Exemple 2 :</p>
              <p className="text-sm text-muted-foreground">
                Introspection : Besoin de connexion → Désir de moments réguliers → Demande de temps quotidien
              </p>
              <Callout variant="neutral">
                <p className="text-base italic">
                  "J'ai besoin de connexion. Est-ce qu'on pourrait prendre 20 minutes par jour pour parler, juste nous deux, sans téléphone?"
                </p>
              </Callout>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pourquoi ça libère",
      icon: Sparkles,
      content: (
        <div className="space-y-8">
          <Subtitle>Pourquoi cette distinction libère la conversation</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Quand vous séparez le besoin (non négociable) de la demande (négociable), vous ouvrez un espace de collaboration. Votre partenaire peut accueillir votre besoin comme légitime, puis chercher avec vous des façons de le combler qui fonctionnent pour vous deux.
          </p>
          
          <Callout variant="primary">
            <p className="text-base">
              Vous passez de <span className="font-medium">"Tu dois faire ça"</span> à <span className="font-medium">"Voici ce dont j'ai besoin, voici ce qui pourrait m'aider — comment peut-on y répondre ensemble?"</span>
            </p>
          </Callout>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          La base des besoins
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              Êtes-vous prêts à passer à l'étape suivante?
            </h2>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Vous allez maintenant aborder vos besoins respectifs. C'est le moment d'exprimer ce qui pourrait améliorer votre situation et renforcer votre connexion.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              La différence entre un besoin, un désir et une demande transforme complètement la façon dont vous communiquez. Cette distinction remplace l'exigence par l'invitation et ouvre la porte à la collaboration.
            </p>

            <p className="text-base text-primary font-medium">
              Cliquez pour en apprendre davantage (notions importantes)
            </p>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="On continue"
              onComplete={handleContinue}
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-continue"
              >
                On continue
              </Button>
            </div>
            
            {isTransitioning && (
              <div className="flex justify-center">
                <Progress value={progress} className="w-full md:w-48" />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
