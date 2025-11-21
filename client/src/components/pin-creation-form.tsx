import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';

const pinSchema = z.object({
  pin: z.string()
    .regex(/^\d{4,6}$/, 'Le NIP doit contenir 4 à 6 chiffres'),
  confirmPin: z.string()
    .regex(/^\d{4,6}$/, 'Le NIP doit contenir 4 à 6 chiffres'),
}).refine((data) => data.pin === data.confirmPin, {
  message: 'Les NIP ne correspondent pas',
  path: ['confirmPin'],
});

type PinFormData = z.infer<typeof pinSchema>;

interface PinCreationFormProps {
  userName: string;
  userEmail: string;
  circleId: number;
  onSuccess: (sessionToken: string, userId: string) => void;
  onError: (message: string) => void;
}

export function PinCreationForm({ userName, userEmail, circleId, onSuccess, onError }: PinCreationFormProps) {
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const form = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });

  const createPinMutation = useMutation({
    mutationFn: async (data: PinFormData) => {
      const result = await apiRequest('/api/auth/create-pin', {
        method: 'POST',
        body: JSON.stringify({
          email: userEmail,
          circle_id: circleId,
          name: userName,
          pin: data.pin,
        }),
      });
      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        onSuccess(result.session_token, result.user_id);
      }
    },
    onError: (error: Error) => {
      onError(error.message || 'Erreur lors de la création du NIP');
    },
  });

  const onSubmit = (data: PinFormData) => {
    createPinMutation.mutate(data);
  };

  const pinValue = form.watch('pin');
  const confirmPinValue = form.watch('confirmPin');
  const pinsMatch = pinValue && confirmPinValue && pinValue === confirmPinValue;

  return (
    <Card className="w-full max-w-md shadow-lg" data-testid="card-pin-creation">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-center">
          Bienvenue, {userName.split(' ')[0]} !
        </CardTitle>
        <CardDescription className="text-center text-base">
          Créez un NIP de 4 à 6 chiffres pour sécuriser votre compte
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* PIN Input */}
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-base font-medium">
                Nouveau NIP <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  {...form.register('pin')}
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Entrez 4-6 chiffres"
                  className="h-12 pr-10 text-base"
                  disabled={createPinMutation.isPending}
                  data-testid="input-pin"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-toggle-pin-visibility"
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.pin && (
                <p className="text-sm text-destructive" data-testid="text-pin-error">
                  {form.formState.errors.pin.message}
                </p>
              )}
            </div>

            {/* Confirm PIN Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPin" className="text-base font-medium">
                Confirmer le NIP <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  {...form.register('confirmPin')}
                  id="confirmPin"
                  type={showConfirmPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Confirmez votre NIP"
                  className="h-12 pr-10 text-base"
                  disabled={createPinMutation.isPending}
                  data-testid="input-confirm-pin"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-toggle-confirm-pin-visibility"
                >
                  {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {pinsMatch && confirmPinValue.length >= 4 && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                )}
              </div>
              {form.formState.errors.confirmPin && (
                <p className="text-sm text-destructive" data-testid="text-confirm-pin-error">
                  {form.formState.errors.confirmPin.message}
                </p>
              )}
            </div>
          </div>

          <Alert className="bg-muted border-border">
            <AlertDescription className="text-sm">
              <strong>Conseil de sécurité :</strong> Choisissez un NIP que vous pourrez mémoriser facilement, 
              mais qui ne soit pas évident (évitez 1234, votre année de naissance, etc.)
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={createPinMutation.isPending || !form.formState.isValid}
            data-testid="button-create-pin"
          >
            {createPinMutation.isPending ? 'Création en cours...' : 'Créer mon NIP'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
