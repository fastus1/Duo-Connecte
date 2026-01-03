import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Target, Shield, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';

export default function Intention() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(4);
  };

  const theoryPages = [
    {
      title: "L'intention fondamentale",
      icon: Target,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Cette page rappelle l'intention fondamentale de votre échange. Sans cette clarté, vous risquez de retomber dans vos automatismes : défense, attaque, justification.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Pourquoi "être bien ensemble" est le vrai objectif</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Dans une conversation tendue, votre cerveau cherche à se protéger. Il veut prouver que vous avez raison, que l'autre a tort. Ce réflexe sabote la connexion.
            </p>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Communiquer pour être bien ensemble signifie accepter que :
          </p>
          
          <BulletList
            variant="primary"
            items={[
              "Vous pouvez tous les deux avoir raison",
              "Vos deux vérités sont valides",
              "L'objectif est de comprendre, pas de convaincre"
            ]}
          />
        </div>
      )
    },
    {
      title: "Accepter le malaise",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <Subtitle>Accepter le malaise au lieu de le fuir</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              L'inconfort est inévitable. Ne pas l'accepter consciemment et le prendre de face nous pousse à minimiser, contre-attaquer ou fuir.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Accepter le malaise, c'est choisir d'y faire face avec l'autre.
            </p>
          </div>
          
          <div className="space-y-4">
            <Subtitle>Postures à éviter</Subtitle>
            <BulletList
              variant="destructive"
              items={[
                "L'opposition et l'attaque",
                "La justification et l'argumentation"
              ]}
            />
          </div>
          
          <div className="space-y-4">
            <Subtitle>Postures constructives</Subtitle>
            <BulletList
              variant="primary"
              items={[
                "Croire que le vécu de l'autre est vrai pour lui",
                "Se soucier de l'autre",
                "Vouloir se rapprocher"
              ]}
            />
          </div>
        </div>
      )
    },
    {
      title: "Vous êtes une équipe",
      icon: Users,
      content: (
        <div className="space-y-8">
          <Callout variant="primary">
            <p className="font-medium">
              Rappel : Si la conversation devient un débat, faites une pause. Respirez.
            </p>
          </Callout>
          
          <p className="text-xl md:text-2xl leading-relaxed text-foreground font-medium text-center">
            Vous êtes une équipe, pas des opposants.
          </p>
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

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Rappel important
        </h1>

        <div className="w-full max-w-2xl space-y-5 md:space-y-6">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-4">
            <p className="text-lg md:text-xl leading-relaxed text-foreground font-medium">
              Malgré les malaises que ça peut créer, le but de la communication est d'être bien ensemble.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Accepter ce malaise tout en restant en lien est la clé d'une communication réussie.
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="leading-relaxed text-base md:text-lg">
              Sortez de la dynamique du "qui a raison". Cette conversation n'est pas un débat à gagner, mais une chance de vous rapprocher. Essayez de vous comprendre plutôt que de convaincre.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <MultiPageModal
            triggerText="Plus d'infos: Théories"
            pages={theoryPages}
            finalButtonText="Étape suivante"
            onComplete={handleContinue}
          />
        </div>

        <div className="flex flex-col items-center pt-4 space-y-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={isTransitioning}
            className="px-12"
            data-testid="button-next"
          >
            Étape suivante
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-64" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
