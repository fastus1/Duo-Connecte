import { cn } from '@/lib/utils';

interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  rounded?: boolean;
  className?: string;
}

export function ImageBlock({ 
  src, 
  alt, 
  caption,
  rounded = true,
  className 
}: ImageBlockProps) {
  return (
    <figure className={cn("w-full", className)}>
      <div className={cn(
        "overflow-hidden bg-muted",
        rounded && "rounded-lg"
      )}>
        <img 
          src={src} 
          alt={alt}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
