import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Target, Gift, MessageSquare, Sparkles, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function Transition2() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            Sans cette étape claire, vous risquez de rester dans le flou sur vos besoins réels et sur la façon de les combler. Cela conduit souvent à une insatisfaction grandissante et à des malentendus répétés.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            De plus, chaque personne perçoit les situations différemment. S'attendre à ce que votre partenaire devine vos besoins sans les exprimer clairement relève de la pensée magique.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Pourquoi cette étape est cruciale :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Elle transforme les insatisfactions en demandes claires et actionnables</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Elle crée un espace de dialogue et de collaboration au lieu de l'affrontement</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Elle permet de distinguer ce qui est fondamental (le besoin) de ce qui peut être adapté (la demande)</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Le Besoin (non négociable)",
      icon: Target,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            C'est ce qui nourrit votre bien-être fondamental.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Un besoin est universel et légitime par nature. Personne ne peut vous dire "tu ne devrais pas avoir ce besoin".
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Exemples de besoins :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Respect</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Sécurité émotionnelle</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Connexion</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Reconnaissance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Autonomie</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Être entendu</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Confiance</span>
              </li>
            </ul>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Un même besoin peut exister chez les deux partenaires. Ce n'est pas un débat.
          </p>
        </div>
      )
    },
    {
      title: "Le Désir (une proposition)",
      icon: Gift,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Le désir est une façon possible de combler votre besoin.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            C'est important : il existe toujours plusieurs voies pour répondre au même besoin.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Exemple :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Si votre besoin est <span className="text-foreground font-medium">la connexion</span>, votre désir pourrait être :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Des conversations profondes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Du temps ensemble sans téléphone</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Des moments physiques</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Partager vos pensées</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Faire des activités ensemble</span>
              </li>
            </ul>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Le désir ouvre des possibilités. Il n'impose pas UNE solution unique.
          </p>
        </div>
      )
    },
    {
      title: "La Demande (action concrète)",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            La demande exprime votre désir de façon claire et actionnable.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            C'est votre proposition pour combler le besoin. Elle est :
          </p>
          
          <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>Spécifique</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>Réalisable</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><span className="text-foreground font-medium">Négociable. C'est une proposition</span> (c'est la clé)</span>
            </li>
          </ul>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Exemple :
            </p>
            <div className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <p>Besoin : <span className="text-foreground font-medium">Connexion</span></p>
              <p>Désir : <span className="text-foreground font-medium">Des moments de qualité ensemble</span></p>
              <p>Demande : <span className="text-foreground font-medium">"Pourrais-tu poser ton téléphone quand on discute le soir?"</span></p>
            </div>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            La demande peut être ajustée. Peut-être que votre partenaire proposera autre chose qui fonctionne aussi bien.
          </p>
        </div>
      )
    },
    {
      title: "Pourquoi cette distinction libère",
      icon: Sparkles,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Quand vous séparez le besoin (non négociable) de la demande (négociable), vous ouvrez un espace de collaboration.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Avant (sans distinction) :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "Tu dois me donner plus d'attention!"
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              → L'autre se sent contrôlé, se défend, refuse.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Après (avec distinction) :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de me sentir importante pour toi. Pourrais-tu poser ton téléphone quand je te parle?"
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              → L'autre comprend le besoin et peut proposer : "Je peux faire ça les soirs de semaine, mais pas les fins de semaine. Comment c'est pour toi?"
            </p>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Vous devenez une équipe.
          </p>
        </div>
      )
    },
    {
      title: "Processus complet",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Face à la situation de départ où l'autre regarde souvent son téléphone quand vous discutez.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              L'introspection :
            </p>
            <ol className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground list-decimal list-inside">
              <li>Besoin : "J'ai besoin de me sentir respecté et écouté"</li>
              <li>Désir : "Je désire son attention visuelle quand on parle"</li>
              <li>Demande : "Pourrais-tu me regarder quand je te parle?"</li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que vous dites à votre partenaire (expression) :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de me sentir respecté et écouté. Pourrais-tu faire attention de me regarder quand je te parle? Ça ferait une vraie différence pour moi."
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce qui devient possible :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Votre partenaire peut dire :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>"Oui, je comprends pourquoi c'est important. Je vais faire attention."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>"Je comprends, mais je ne peux pas tous les jours. Et si je le faisais les soirs?"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>"C'est difficile pour moi, mais je désire vraiment répondre à ton besoin de respect. Peut-être qu'on pourrait démarrer le téléphone dans une autre pièce?"</span>
              </li>
            </ul>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            C'est la collaboration, pas l'exigence.
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
          La base des besoins
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              Étape théorique pour comprendre les besoins, les désirs et comment formuler une demande claire.
            </h2>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Vous avez maintenant partagé votre vécu et avez été validé·e·s dans votre perspective. C'est maintenant le moment d'identifier ce dont vous avez besoin pour améliorer la situation et renforcer votre connexion.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Cette étape vous aidera à transformer votre vécu en besoin, puis en pistes d'action concrètes.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Pour y arriver, vous devez d'abord comprendre la différence entre un <span className="text-foreground font-medium">besoin</span>, un <span className="text-foreground font-medium">désir</span> et une <span className="text-foreground font-medium">demande</span>.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-base text-primary font-semibold hover:underline cursor-pointer"
              data-testid="link-open-theory"
            >
              Cliquez pour en apprendre davantage (notions importantes)
            </button>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="On continue"
              onComplete={handleContinue}
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
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
