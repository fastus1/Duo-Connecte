import { useTheme } from './theme-provider';
import logoBleu from '@assets/logo-bleu-320_1764950756900.png';
import logoBlanc from '@assets/logo-blanc-320_1764950756900.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const { actualTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const logoSrc = actualTheme === 'dark' ? logoBlanc : logoBleu;

  return (
    <img 
      src={logoSrc} 
      alt="App Logo" 
      className={`${sizeClasses[size]} object-contain ${className}`}
      data-testid="img-logo"
    />
  );
}
