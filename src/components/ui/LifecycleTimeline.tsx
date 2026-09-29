import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { LifecycleEvent } from '@/types';

interface LifecycleTimelineProps {
  events: LifecycleEvent[];
  className?: string;
}

export function LifecycleTimeline({ events, className }: LifecycleTimelineProps) {
  return (
    <ol className={cn('relative border-l border-gray-200 ml-4', className)}>
      {events.map((event, i) => {
        const isDone = event.status === 'completed';
        const isCurrent = event.status === 'current';
        return (
          <li key={i} className="mb-8 ml-6">
            <span
              className={cn(
                'absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white',
                isDone ? 'bg-forest-600' : isCurrent ? 'bg-amber-400' : 'bg-gray-200'
              )}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              ) : isCurrent ? (
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              ) : (
                <Circle className="w-3 h-3 text-gray-400" />
              )}
            </span>
            <h4 className={cn('text-sm font-semibold', isDone ? 'text-gray-900' : 'text-gray-400')}>
              {event.stage}
            </h4>
            {event.date && (
              <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.date)} · {event.actor}</p>
            )}
            {event.txHash && (
              <p className="text-xs font-mono text-gray-400 mt-0.5 truncate max-w-xs">{event.txHash}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
