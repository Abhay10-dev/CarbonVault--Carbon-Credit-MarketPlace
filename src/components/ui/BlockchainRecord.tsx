import { Link2, Copy, CheckCircle2 } from 'lucide-react';
import { cn, truncateWallet, truncateTxHash } from '@/lib/utils';
import { useState } from 'react';

interface BlockchainRecordProps {
  tokenId: string;
  contractAddress: string;
  ownerWallet: string;
  txHash: string;
  network?: string;
  className?: string;
}

export function BlockchainRecord({
  tokenId,
  contractAddress,
  ownerWallet,
  txHash,
  network = 'Ethereum Test Network',
  className,
}: BlockchainRecordProps) {
  const [copied, setCopied] = useState(false);

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn('bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3', className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Blockchain Record</span>
        <span className="ml-auto text-xs text-gray-400">{network}</span>
      </div>

      {[
        { label: 'Token ID', value: tokenId },
        { label: 'Contract', value: truncateWallet(contractAddress), full: contractAddress },
        { label: 'Owner', value: truncateWallet(ownerWallet), full: ownerWallet },
        { label: 'Transaction', value: truncateTxHash(txHash), full: txHash },
      ].map(row => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="text-xs text-gray-500 w-24 shrink-0">{row.label}</span>
          <span className="text-xs font-mono text-gray-800 truncate">{row.value}</span>
          <button
            onClick={() => copy(row.full ?? row.value)}
            className="ml-2 text-gray-400 hover:text-gray-600 shrink-0"
            title="Copy"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      ))}

      <button className="mt-2 flex items-center gap-1 text-xs text-forest-700 hover:underline font-medium">
        <Link2 className="w-3.5 h-3.5" />
        View Blockchain Record
      </button>
    </div>
  );
}
