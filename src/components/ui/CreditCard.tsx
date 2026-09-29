import React from 'react';
import { ShieldCheck, MapPin, Award, ArrowRight } from 'lucide-react';
import type { Credit } from '@/types';
import { formatINR, formatNumber, CREDIT_STATUS_COLORS, CREDIT_STATUS_LABELS } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';

interface CreditCardProps {
  credit: Credit;
  onView?: (credit: Credit) => void;
  onBuy?: (credit: Credit) => void;
  onSell?: (credit: Credit) => void;
  onRetire?: (credit: Credit) => void;
  showActions?: boolean;
}

export function CreditCard({
  credit,
  onView,
  onBuy,
  onSell,
  onRetire,
  showActions = true,
}: CreditCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <StatusBadge
            label={CREDIT_STATUS_LABELS[credit.status]}
            colorClass={CREDIT_STATUS_COLORS[credit.status]}
          />
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {credit.tokenId}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
          {credit.projectName}
        </h3>

        <div className="flex items-center text-xs text-gray-500 mb-3 gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{credit.location}</span>
        </div>

        <div className="bg-forest-50/60 rounded-lg p-3 mb-4 border border-forest-100/50">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-forest-800 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-forest-600" /> Available Credits
            </span>
            <span className="text-base font-bold text-forest-900">
              {formatNumber(credit.quantity)} <span className="text-xs font-normal">tCO₂e</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-xs text-gray-600 font-medium">Price per Credit</span>
            <span className="text-sm font-semibold text-gray-900">
              {credit.pricePerCredit ? formatINR(credit.pricePerCredit) : 'Market rate'}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Methodology:</span>
            <span className="font-medium text-gray-700 truncate max-w-[150px]">{credit.methodology}</span>
          </div>
          <div className="flex justify-between">
            <span>Verifier:</span>
            <span className="font-medium text-gray-700 truncate max-w-[150px]">{credit.verifiedBy}</span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
          {onView && (
            <button
              onClick={() => onView(credit)}
              className="text-xs font-medium text-gray-700 hover:text-forest-700 transition-colors flex items-center gap-1"
            >
              View Details <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {onBuy && credit.status === 'listed' && (
              <button
                onClick={() => onBuy(credit)}
                className="px-3 py-1.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
              >
                Buy Credits
              </button>
            )}

            {onSell && credit.status === 'available' && (
              <button
                onClick={() => onSell(credit)}
                className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition-colors"
              >
                Sell
              </button>
            )}

            {onRetire && (credit.status === 'available' || credit.status === 'transferred') && (
              <button
                onClick={() => onRetire(credit)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
              >
                Retire
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
