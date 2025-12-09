import { Link } from 'wouter';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SupportButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href="/support">
          <Button
            size="icon"
            className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
            data-testid="button-floating-support"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Aide & Contact</p>
      </TooltipContent>
    </Tooltip>
  );
}
