import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { HelpCircle, Send, ChevronDown, ChevronUp, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

const supportFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Please describe your issue in detail (minimum 20 characters)"),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

const faqItems = [
  {
    question: "What is this template for?",
    answer: "This template provides a starting point for building Circle.so embedded apps. It includes authentication, admin dashboard, user management, and support ticket infrastructure."
  },
  {
    question: "How do I customize this template?",
    answer: "Start by updating the branding in client/index.html and client/public/manifest.json. Then modify the pages in client/src/pages/ to add your app's functionality."
  },
  {
    question: "The app is not working correctly, what should I do?",
    answer: "First try refreshing the page. If the problem persists, make sure you're using a modern browser (Chrome, Firefox, Safari, Edge). If it still doesn't work, contact support using the form below."
  },
  {
    question: "How do I access the app?",
    answer: "Access is automatic if you're logged into your Circle community and have purchased access. No additional registration is required."
  },
  {
    question: "Is my data collected?",
    answer: "No personal data is collected by the app. Authentication works through your Circle.so account synchronization."
  },
  {
    question: "How do I deploy this app?",
    answer: "This template can be deployed to Railway, Vercel, or any Node.js hosting platform. See the README for detailed deployment instructions."
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
        title: "Message sent",
        description: "We have received your request and will respond as soon as possible.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
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
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Help & Contact</h1>
          <p className="text-muted-foreground">
            Find answers to your questions or contact us
          </p>
        </div>

        <Card data-testid="card-faq">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Find answers to the most common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {faqItems.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-contact-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
            <CardDescription>
              Didn't find the answer? Send us a message
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Message Sent</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Thank you for contacting us. We will review your request and respond as soon as possible.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                  data-testid="button-send-another"
                >
                  Send another message
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
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name" 
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
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Summarize your request" 
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
                            placeholder="Describe your issue or question in detail..."
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
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
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
            You can also contact us directly at{' '}
            <a
              href="mailto:support@example.com"
              className="text-primary hover:underline"
              data-testid="link-email-support"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
