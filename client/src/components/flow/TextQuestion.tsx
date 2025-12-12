import { Textarea } from '@/components/ui/textarea';

interface TextQuestionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
  rows?: number;
}

export function TextQuestion({ 
  label, 
  value, 
  onChange, 
  placeholder = '',
  optional = false,
  rows = 4
}: TextQuestionProps) {
  return (
    <div className="space-y-3" data-testid="text-question">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {optional && (
          <span className="text-muted-foreground ml-1">(optionnel)</span>
        )}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-none bg-card border-border"
        data-testid="input-text-question"
      />
    </div>
  );
}
