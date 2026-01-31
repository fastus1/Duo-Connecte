import { useTheme } from '@/components/theme-provider';

interface ArrowsIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-12',
  md: 'h-16',
  lg: 'h-24',
  xl: 'h-32',
};

export function ArrowsIcon({ size = 'md' }: ArrowsIconProps) {
  const { actualTheme } = useTheme();
  const iconSrc = actualTheme === 'dark' ? '/logo-white.png' : '/logo-blue.png';

  return (
    <div className="flex justify-center">
      <img 
        src={iconSrc} 
        alt="App Icon" 
        className={`${sizeClasses[size]} object-contain`}
        data-testid="img-arrows"
      />
    </div>
  );
}
