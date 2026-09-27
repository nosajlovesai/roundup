import React, { useState } from 'react';
import { History, Download, ArrowRight, Coins, Clock } from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivityListProps {
  activity: ActivityItem[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activity }) => {
  const [filter, setFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL');

  const filteredActivity = activity.filter((item) => {
    if (filter === 'ALL') return true;
    return item.side === filter;
  });

  const formatTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleExportCSV = () => {
    if (activity.length === 0) return;
    const header = ['Timestamp', 'Item', 'Original Price', 'Rounded Price', 'Allocated', 'Side', 'Market'];
    const rows = activity.map((item) => [
      new Date(item.timestamp).toISOString(),
      `"${item.itemName}"`,
      item.originalPrice.toFixed(2),
      item.roundedPrice.toFixed(2),
      item.roundUpAmount.toFixed(2),
      item.side,
      `"${item.marketQuestion.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `roundup-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const yesCount = activity.filter((it) => it.side === 'YES').length;
  const noCount = activity.filter((it) => it.side === 'NO').length;

  return (
    <section className="rounded-2xl bg-white border border-[#E3DDD1] p-5 sm:p-6 shadow-xs">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-[#EBE6DA]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#1C4E31]" />
          <h3 className="text-base font-bold text-[#142C1E]">
            Allocation History
          </h3>
          <span className="text-xs text-[#5E7164] font-medium ml-1">
            ({activity.length} {activity.length === 1 ? 'transaction' : 'transactions'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter segment control (Interactive buttons allowed by design constitution) */}
          <div className="flex items-center gap-1 p-1 bg-[#F5F2EA] rounded-lg border border-[#E5DFD1]">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-white text-[#163E27] shadow-2xs'
                  : 'text-[#627768] hover:text-[#163E27]'
              }`}
            >
              All ({activity.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('YES')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'YES'
                  ? 'bg-[#154E2F] text-white shadow-2xs'
                  : 'text-[#627768] hover:text-[#163E27]'
              }`}
            >
              YES ({yesCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('NO')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'NO'
                  ? 'bg-[#963730] text-white shadow-2xs'
                  : 'text-[#627768] hover:text-[#163E27]'
              }`}
            >
              NO ({noCount})
            </button>
          </div>

          {/* Export CSV button */}
          {activity.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="p-1.5 rounded-lg border border-[#E2DCCE] bg-white text-[#345240] hover:bg-[#F3EFE4] transition-colors cursor-pointer"
              title="Export CSV Ledger"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="mt-3 overflow-y-auto max-h-[380px] pr-1">
        {filteredActivity.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl bg-[#FAF8F3] border border-dashed border-[#E3DCCF]">
            <div className="w-10 h-10 rounded-full bg-[#ECE6D8] text-[#284C37] flex items-center justify-center mx-auto mb-2">
              <Coins className="w-5 h-5 text-[#245D3B]" />
            </div>
            <p className="text-sm font-bold text-[#1F3D2A]">
              {activity.length === 0 ? 'No round-ups recorded yet' : 'No transactions match this filter'}
            </p>
            <p className="text-xs text-[#5D7063] mt-1 max-w-sm mx-auto leading-relaxed">
              {activity.length === 0
                ? 'Select BUY YES or BUY NO on any market, then simulate a card swipe to route spare change directly into prediction contracts.'
                : 'Switch filters back to "All" to inspect your complete allocation ledger.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredActivity.map((item, index) => {
              const isFirst = index === 0;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isFirst && item.isNew
                      ? 'bg-[#F2FAF4] border-[#B7E2C3] shadow-xs'
                      : 'bg-[#FAF8F3] border-[#E7E2D5] hover:border-[#D5CDC0]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Item and time */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#163826]">
                        {item.itemName}
                      </span>
                      <span className="text-[11px] text-[#697A70] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#3B664C]" />
                        {formatTime(item.timestamp)}
                      </span>
                    </div>

                    {/* Allocated amount */}
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#144829]">
                      <span className="text-[11px] font-normal text-[#5B6F63]">
                        ${item.originalPrice.toFixed(2)} → ${item.roundedPrice.toFixed(2)}
                      </span>
                      <span className="bg-[#E4F3EA] text-[#134927] px-2 py-0.5 rounded-md border border-[#C2E4CD]">
                        +${item.roundUpAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Destination Market Line */}
                  <div className="mt-1.5 flex items-center gap-2 text-xs pt-1.5 border-t border-[#EDE7D9]">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        item.side === 'YES'
                          ? 'bg-[#154E2F] text-white'
                          : 'bg-[#963730] text-white'
                      }`}
                    >
                      {item.side}
                    </span>
                    <p className="text-[11px] text-[#3A4E41] truncate font-medium">
                      {item.marketQuestion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
