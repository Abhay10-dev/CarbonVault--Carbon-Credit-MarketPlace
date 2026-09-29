import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  colorClass?: string;
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, colorClass = 'text-forest-700', className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4', className)}>
      {icon && (
        <div className={cn('p-2 rounded-lg bg-gray-50', colorClass)}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={cn('text-2xl font-semibold mt-1', colorClass)}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
