import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

export function StarRating({ 
  value, 
  onChange, 
  maxStars = 5,
  size = 'lg'
}: StarRatingProps) {
  return (
    <div className="flex justify-center gap-2" data-testid="star-rating">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full p-1"
          data-testid={`star-${star}`}
          aria-label={`Note ${star} sur ${maxStars}`}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-transparent text-muted-foreground/50'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
