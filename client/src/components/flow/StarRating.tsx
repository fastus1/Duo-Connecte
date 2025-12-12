import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  allowHalf?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const halfClickWidth = {
  sm: 'w-3',
  md: 'w-4',
  lg: 'w-5',
};

export function StarRating({ 
  value, 
  onChange, 
  maxStars = 5,
  size = 'lg',
  allowHalf = true
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating ?? value ?? 0;

  return (
    <div 
      className="flex justify-center gap-2" 
      data-testid="star-rating"
      onMouseLeave={() => setHoverRating(null)}
    >
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((starIndex) => {
        const fullStarValue = starIndex;
        const halfStarValue = starIndex - 0.5;

        return (
          <div key={starIndex} className={`relative ${sizeClasses[size]}`}>
            {/* Étoile de fond (grise) */}
            <Star className={`${sizeClasses[size]} text-muted-foreground/50 stroke-muted-foreground/50`} />
            
            {/* Étoile jaune avec clip-path pour l'effet demi-étoile */}
            <div 
              className="absolute inset-0 overflow-hidden transition-all duration-150"
              style={{
                clipPath: displayRating >= fullStarValue 
                  ? 'inset(0 0 0 0)' 
                  : displayRating >= halfStarValue 
                  ? 'inset(0 50% 0 0)' 
                  : 'inset(0 100% 0 0)'
              }}
            >
              <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
            </div>
            
            {allowHalf ? (
              <>
                {/* Zone cliquable gauche (demi-étoile) */}
                <button
                  type="button"
                  onClick={() => onChange(halfStarValue)}
                  onMouseEnter={() => setHoverRating(halfStarValue)}
                  className={`absolute left-0 top-0 ${halfClickWidth[size]} h-full cursor-pointer`}
                  data-testid={`star-${halfStarValue}`}
                  aria-label={`Note ${halfStarValue} sur ${maxStars}`}
                />
                
                {/* Zone cliquable droite (étoile complète) */}
                <button
                  type="button"
                  onClick={() => onChange(fullStarValue)}
                  onMouseEnter={() => setHoverRating(fullStarValue)}
                  className={`absolute right-0 top-0 ${halfClickWidth[size]} h-full cursor-pointer`}
                  data-testid={`star-${fullStarValue}`}
                  aria-label={`Note ${fullStarValue} sur ${maxStars}`}
                />
              </>
            ) : (
              <button
                type="button"
                onClick={() => onChange(fullStarValue)}
                onMouseEnter={() => setHoverRating(fullStarValue)}
                className="absolute inset-0 cursor-pointer"
                data-testid={`star-${fullStarValue}`}
                aria-label={`Note ${fullStarValue} sur ${maxStars}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
