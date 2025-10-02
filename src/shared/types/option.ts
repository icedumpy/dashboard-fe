export interface OptionT {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  meta?: Record<string, string | number | boolean>;
}
