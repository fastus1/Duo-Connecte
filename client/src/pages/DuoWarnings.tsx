import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { AlertTriangle, ShieldAlert, Brain, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';

export default function Warnings() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(3);
  };

  const warnings = [
    "Cet outil n'est pas un substitut à une thérapie relationnelle",
    "Vous devez avoir des bases en communication et en gestion émotionnelle pour l'utiliser efficacement",
    "Duo-Connecte n'est pas un outil de gestion de crise. Si l'émotion est trop forte, prenez une pause chacun de votre côté avant de revenir.",
    "La lenteur est votre alliée. Prenez le temps de bien vivre chaque étape pour que le processus soit efficace.",
  ];

  const theoryPages = [
    {
      title: "Précautions importantes",
      icon: ShieldAlert,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ces précautions maximisent vos chances de réussite. Ce parcours fonctionne mieux quand certaines conditions sont réunies.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Pourquoi cet outil ne remplace pas une thérapie</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Un thérapeute adapte ses interventions en temps réel. Duo-Connecte offre une structure guidée, mais ne peut pas réagir à votre dynamique comme le ferait un professionnel.
            </p>
          </div>
          
          <Callout variant="primary">
            <p>
              Si vous êtes en crise active (colère intense, menaces de rupture, détresse aiguë), vous avez besoin d'un accompagnement direct, pas d'un outil numérique.
            </p>
          </Callout>
        </div>
      )
    },
    {
      title: "Compétences de base",
      icon: Brain,
      content: (
        <div className="space-y-8">
          <Subtitle>Ce que signifie "compétences de base"</Subtitle>
          
          <BulletList
            variant="primary"
            items={[
              "Identifier vos émotions (même approximativement)",
              "Assumer votre part de responsabilité",
              "Écouter sans interrompre constamment",
              "Accepter que l'autre voit les choses différemment"
            ]}
          />
        </div>
      )
    },
    {
      title: "La lenteur est essentielle",
      icon: Clock,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <Subtitle>Pourquoi la lenteur est essentielle</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Les conflits nous poussent à accélérer : réagir, se défendre, contre-attaquer. Ce parcours fait l'inverse.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Chaque pause permet à votre système nerveux de se calmer et à votre cerveau de sortir du mode réactif.
            </p>
          </div>
          
          <div className="space-y-4">
            <Subtitle>Signes que ce n'est pas le bon moment</Subtitle>
            <BulletList
              variant="primary"
              items={[
                "L'un de vous crie ou claque des portes",
                "Vous avez eu une dispute intense il y a moins de 30 minutes",
                "L'un de vous résiste à y participer",
                "Vous êtes sous l'influence d'alcool ou de substances"
              ]}
            />
          </div>
          
          <Callout variant="primary">
            <p>
              Dans ces cas, attendez. Revenez quand vous êtes disponibles émotionnellement.
            </p>
          </Callout>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Avant de commencer
        </h1>

        <div className="w-full max-w-2xl space-y-3 md:space-y-4">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-card border border-card-border"
              data-testid={`warning-${index}`}
            >
              <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-destructive">{index + 1}</span>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-foreground">
                {warning}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <MultiPageModal
            triggerText="Plus d'infos: Théories"
            pages={theoryPages}
            finalButtonText="J'ai compris, continuer"
            onComplete={handleContinue}
          />
        </div>

        <div className="flex flex-col items-center pt-4 space-y-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handleContinue}
            disabled={isTransitioning}
            className="px-12 text-destructive border-destructive hover:bg-destructive/10"
            data-testid="button-understood"
          >
            J'ai compris, continuer
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-64 [&>div]:bg-destructive" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
