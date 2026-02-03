import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { HelpCircle, Send, ChevronDown, ChevronUp, Mail, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

const supportFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  description: z.string().min(20, "Veuillez décrire votre problème en détail (minimum 20 caractères)"),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

const faqItems = [
  {
    question: "À quoi sert Duo-Connecte?",
    answer: "Duo-Connecte est un guide qui vous accompagne pas à pas dans une conversation difficile ou délicate avec votre partenaire. L'application structure l'échange pour vous aider à vous exprimer et à vous écouter mutuellement."
  },
  {
    question: "Puis-je reprendre un parcours plus tard?",
    answer: "Le parcours est conçu pour être complété en une seule session. Si vous devez interrompre, vous devrez recommencer depuis le début. Prévoyez environ 45 à 60 minutes dans un endroit calme."
  },
  {
    question: "L'application ne fonctionne pas correctement, que faire?",
    answer: "Essayez d'abord de rafraîchir la page. Si le problème persiste, assurez-vous d'utiliser un navigateur récent (Chrome, Firefox, Safari, Edge). Si ça ne fonctionne toujours pas, contactez-nous via le formulaire ci-dessous."
  },
  {
    question: "Comment accéder à l'application?",
    answer: "L'accès se fait automatiquement si vous êtes connecté à la plateforme Avancer Simplement et que vous avez acheté l'application. Aucune inscription supplémentaire n'est requise."
  },
  {
    question: "Mes données sont-elles collectées?",
    answer: "Non. Aucune donnée personnelle n'est collectée par l'application. Vos conversations ne sont pas enregistrées sur nos serveurs. L'authentification fonctionne uniquement par synchronisation avec votre compte Avancer Simplement."
  },
  {
    question: "Est-ce que Duo-Connecte remplace une thérapie de couple?",
    answer: "Non. Duo-Connecte est un outil d'accompagnement pour des conversations ponctuelles. Il ne remplace pas un suivi avec un thérapeute, surtout en cas de crise ou de conflits récurrents."
  },
  {
    question: "Puis-je utiliser l'application seul·e?",
    answer: "Non, Duo-Connecte est conçu pour être utilisé à deux, en même temps. Les deux partenaires doivent être présents et disponibles pour que le parcours fonctionne.\n\nSi vous souhaitez travailler la gestion de vos émotions en solo, découvrez Solo-Connecte, notre application d'accompagnement individuel.",
    hasLink: true,
    linkText: "Essayer Solo-Connecte",
    linkUrl: "https://avancersimplement.com/solo-connecte"
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  hasLink?: boolean;
  linkText?: string;
  linkUrl?: string;
}

function FAQItem({ question, answer, hasLink, linkText, linkUrl }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover-elevate rounded-md px-2"
        data-testid={`faq-toggle-${question.substring(0, 20)}`}
      >
        <span className="font-medium text-foreground">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-96 pb-4" : "max-h-0"
      )}>
        <p className="text-muted-foreground px-2 whitespace-pre-line">{answer}</p>
        {hasLink && linkUrl && linkText && (
          <div className="px-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              data-testid="button-solo-connecte"
            >
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                {linkText}
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/welcome');
    }
  };
  
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      description: '',
    },
  });

  const submitTicket = useMutation({
    mutationFn: async (data: SupportFormValues) => {
      return await apiRequest('POST', '/api/support/tickets', data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message envoyé",
        description: "Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SupportFormValues) => {
    submitTicket.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 text-muted-foreground hover:text-foreground"
            data-testid="button-back-from-support"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'application
          </Button>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Aide & Contact</h1>
          <p className="text-muted-foreground">
            Trouvez des réponses à vos questions ou contactez-nous
          </p>
        </div>

        <Card data-testid="card-faq">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Questions fréquentes
            </CardTitle>
            <CardDescription>
              Consultez les réponses aux questions les plus courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {faqItems.map((item, index) => (
                <FAQItem 
                  key={index} 
                  question={item.question} 
                  answer={item.answer}
                  hasLink={item.hasLink}
                  linkText={item.linkText}
                  linkUrl={item.linkUrl}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-contact-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Nous contacter
            </CardTitle>
            <CardDescription>
              Vous n'avez pas trouvé la réponse ? Envoyez-nous un message
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Message envoyé</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Merci de nous avoir contactés. Nous examinerons votre demande et vous répondrons dans les plus brefs délais.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                  data-testid="button-send-another"
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Votre nom" 
                              {...field} 
                              data-testid="input-support-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="votre@email.com" 
                              {...field} 
                              data-testid="input-support-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sujet</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Résumez votre demande" 
                            {...field} 
                            data-testid="input-support-subject"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre problème ou question en détail..."
                            className="min-h-[120px]"
                            {...field} 
                            data-testid="input-support-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={submitTicket.isPending}
                    data-testid="button-submit-support"
                  >
                    {submitTicket.isPending ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Vous pouvez également nous contacter directement à{' '}
            <a 
              href="mailto:support@avancersimplement.com" 
              className="text-primary hover:underline"
              data-testid="link-email-support"
            >
              support@avancersimplement.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
