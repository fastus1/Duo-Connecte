import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Ear, ShieldAlert, Layers, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList } from '@/components/flow';

export default function SenderExperience() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(9);
  };

  const theoryPages = [
    {
      title: "Le cœur de l'échange",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Maintenant que le déclencheur est nommé, c'est le moment de partager ton expérience intérieure. Cette étape est le cœur de la communication authentique : révéler ce qui se passe en toi.
          </p>
        </div>
      )
    },
    {
      title: "La vulnérabilité",
      icon: ShieldAlert,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Pourquoi c'est difficile : La vulnérabilité
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Nommer ses émotions demande de la vulnérabilité. C'est plus facile de dire "Tu m'as énervé" que "Je me sens blessé·e et impuissant·e". Par contre, c'est cette vulnérabilité qui crée la connexion.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              La règle d'or : parler de TOI, pas de l'autre
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-destructive text-xl">✗</span>
                <span className="text-base md:text-lg leading-relaxed">
                  "Tu m'as fait sentir ignoré·e" → Accusation
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-base md:text-lg leading-relaxed">
                  "Je me sens ignoré·e" → Vulnérabilité
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-destructive text-xl">✗</span>
                <span className="text-base md:text-lg leading-relaxed">
                  "Tu me rends triste quand tu fais ça" → Responsabilise l'autre
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-base md:text-lg leading-relaxed">
                  "Je me sens triste" → Partage ton expérience
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Plusieurs émotions",
      icon: Layers,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Tu n'es pas limité·e à une seule émotion. Souvent, plusieurs cohabitent. Par exemple :
          </p>
          
          <BulletList
            variant="primary"
            items={[
              "\"Je me sens en colère, mais aussi blessé·e et découragé·e.\"",
              "\"Je ressens de la frustration, de la tristesse, et aussi de la peur qu'on ne se comprenne jamais.\"",
              "\"Je me sens déçu·e, fatigué·e de cette situation, et inquiet·ète pour nous.\""
            ]}
          />
        </div>
      )
    },
    {
      title: "Exemples concrets",
      icon: MessageCircle,
      content: (
        <div className="space-y-8">
          <BulletList
            variant="primary"
            items={[
              "\"Quand tu as regardé ton téléphone pendant que je parlais, je me suis senti invisible et sans importance.\"",
              "\"Quand tu as annulé notre sortie, je me suis senti·e déçu·e, puis en colère, puis triste.\"",
              "\"Quand tu as soupiré sans répondre, je me suis senti·e rejeté·e et découragé·e.\"",
              "\"Face à ton silence, je ressens de la solitude et de l'impuissance.\""
            ]}
          />
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Prends le temps de creuser. La première émotion qui vient n'est pas toujours la plus profonde.
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

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Nomme ton vécu
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, parle de ce que tu as vécu face à cette situation
          </h2>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Face à cette situation, je me sens...
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Reste centré·e sur toi et tes émotions, pas sur l'autre
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Prends ton temps pour identifier et nommer ce que tu ressens
              </span>
            </li>
          </ul>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="Étape suivante"
              onComplete={handleContinue}
            />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-next"
            >
              Étape suivante
            </Button>
            {isTransitioning && (
              <Progress value={progress} className="w-full md:w-48" />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
