import { Checkbox } from '@/components/ui/checkbox';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface ChecklistProps {
  items: ChecklistItem[];
}

export function Checklist({ items }: ChecklistProps) {
  return (
    <div className="space-y-3" data-testid="checklist">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-4 rounded-lg bg-card border border-card-border hover-elevate transition-colors"
        >
          <Checkbox
            id={item.id}
            checked={item.checked}
            onCheckedChange={item.onChange}
            className="mt-0.5"
            data-testid={`checkbox-${item.id}`}
          />
          <label
            htmlFor={item.id}
            className="text-base md:text-lg leading-relaxed cursor-pointer flex-1"
          >
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
}
