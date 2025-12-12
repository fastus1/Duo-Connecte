import { useTheme } from '@/components/theme-provider';
import logoBleu from '@assets/logo-bleu-320_1764950756900.png';
import logoBlanc from '@assets/logo-blanc-320_1764950756900.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-16',
  md: 'h-24',
  lg: 'h-32',
  xl: 'h-40',
};

export function Logo({ size = 'md' }: LogoProps) {
  const { actualTheme } = useTheme();
  const logoSrc = actualTheme === 'dark' ? logoBlanc : logoBleu;

  return (
    <div className="flex justify-center">
      <img 
        src={logoSrc} 
        alt="Avancer Simplement" 
        className={`${sizeClasses[size]} object-contain`}
        data-testid="img-logo"
      />
    </div>
  );
}
