interface BulletListProps {
  items: string[];
  variant?: 'primary' | 'destructive';
}

const bulletColors = {
  primary: 'text-primary',
  destructive: 'text-destructive',
};

export function BulletList({ items, variant = 'primary' }: BulletListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className={`text-xl ${bulletColors[variant]}`}>•</span>
          <span className="text-base md:text-lg leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
