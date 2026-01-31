import { useTheme } from '@/components/theme-provider';
import logoBleu from '@assets/logo-bleu-320_1764950756900.png';
import logoBlanc from '@assets/logo-blanc-320_1764950756900.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizeConfig = {
  sm: { image: 'h-12', text: 'text-sm' },
  md: { image: 'h-20', text: 'text-base' },
  lg: { image: 'h-28', text: 'text-xl' },
  xl: { image: 'h-36', text: 'text-2xl' },
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const { actualTheme } = useTheme();
  const logoSrc = actualTheme === 'dark' ? logoBlanc : logoBleu;
  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <img 
        src={logoSrc} 
        alt="App Logo"
        className={`${config.image} object-contain`}
        data-testid="img-logo"
      />
      {showText && (
        <div
          className={`${config.text} font-black italic text-primary`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          CIRCLE APP
        </div>
      )}
    </div>
  );
}
