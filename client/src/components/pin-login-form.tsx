import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';

const loginPinSchema = z.object({
  pin: z.string()
    .regex(/^\d{4,6}$/, 'Le NIP doit contenir 4 à 6 chiffres'),
});

type LoginPinFormData = z.infer<typeof loginPinSchema>;

interface PinLoginFormProps {
  userEmail: string;
  onSuccess: (sessionToken: string, userId: string, isAdmin?: boolean) => void;
  onError: (message: string) => void;
}

export function PinLoginForm({ userEmail, onSuccess, onError }: PinLoginFormProps) {
  const [showPin, setShowPin] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const form = useForm<LoginPinFormData>({
    resolver: zodResolver(loginPinSchema),
    defaultValues: {
      pin: '',
    },
  });

  const validatePinMutation = useMutation({
    mutationFn: async (data: LoginPinFormData) => {
      const response = await apiRequest('POST', '/api/auth/validate-pin', {
        email: userEmail,
        pin: data.pin,
      });
      return await response.json();
    },
    onSuccess: (result) => {
      setRateLimitError(false);
      if (result.success) {
        onSuccess(result.session_token, result.user_id, result.is_admin);
      }
    },
    onError: (error: any) => {
      if (error.message?.includes('429') || error.message?.includes('tentatives')) {
        setRateLimitError(true);
        onError('Trop de tentatives. Veuillez réessayer dans 15 minutes.');
      } else {
        onError(error.message || 'NIP incorrect');
      }
      form.reset();
    },
  });

  const onSubmit = (data: LoginPinFormData) => {
    setRateLimitError(false);
    validatePinMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md shadow-lg" data-testid="card-pin-login">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-center">
          Bon retour !
        </CardTitle>
        <CardDescription className="text-center text-base">
          Entrez votre NIP pour accéder à l'application
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {rateLimitError && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20" data-testid="alert-rate-limit">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Trop de tentatives de connexion. Votre compte est temporairement verrouillé pour des raisons de sécurité. 
                Veuillez réessayer dans 15 minutes.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="login-pin" className="text-base font-medium">
              Votre NIP <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                {...form.register('pin')}
                id="login-pin"
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                placeholder="Entrez votre NIP"
                className="h-12 pr-10 text-base"
                disabled={validatePinMutation.isPending || rateLimitError}
                autoFocus
                data-testid="input-login-pin"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={rateLimitError}
                data-testid="button-toggle-login-pin-visibility"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.pin && (
              <p className="text-sm text-destructive" data-testid="text-login-pin-error">
                {form.formState.errors.pin.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={validatePinMutation.isPending || !form.formState.isValid || rateLimitError}
            data-testid="button-validate-pin"
          >
            {validatePinMutation.isPending ? 'Vérification...' : 'Se connecter'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => {
                onError('Pour réinitialiser votre NIP, veuillez contacter le support.');
              }}
              data-testid="link-forgot-pin"
            >
              NIP oublié ?
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
