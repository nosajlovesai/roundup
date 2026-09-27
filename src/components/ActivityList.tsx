import React, { useState } from 'react';
import { Download } from 'lucide-react';
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
    link.setAttribute('download', `roundup-activity-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="activity-section" className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs text-[#17212B]">
      {/* Header with Title and Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-lg font-bold text-[#17212B]">Activity</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time ledger of simulated spare change allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Working Filters: All, YES, NO */}
          <div className="inline-flex rounded-lg p-0.5 bg-[#F7F8FA] border border-[#E5E7EB] text-xs">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-white text-[#17212B] shadow-2xs font-semibold'
                  : 'text-[#64748B] hover:text-[#17212B]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('YES')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'YES'
                  ? 'bg-white text-[#16734B] shadow-2xs font-semibold'
                  : 'text-[#64748B] hover:text-[#17212B]'
              }`}
            >
              YES
            </button>
            <button
              type="button"
              onClick={() => setFilter('NO')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'NO'
                  ? 'bg-white text-[#991B1B] shadow-2xs font-semibold'
                  : 'text-[#64748B] hover:text-[#17212B]'
              }`}
            >
              NO
            </button>
          </div>

          {activity.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              title="Export CSV"
              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#64748B] hover:text-[#17212B] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {filteredActivity.length === 0 ? (
        <div className="py-12 text-center space-y-1 text-xs">
          <p className="font-semibold text-[#17212B]">No round-ups yet.</p>
          <p className="text-[#64748B]">Choose a prediction and try a demo purchase.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table: Purchase | Prediction | Round-up | Time */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[#64748B] font-medium">
                  <th className="py-2.5 pr-4">Purchase</th>
                  <th className="py-2.5 px-4">Prediction</th>
                  <th className="py-2.5 px-4 text-right">Round-up</th>
                  <th className="py-2.5 pl-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filteredActivity.map((item, index) => {
                  const isNewest = index === 0 && item.isNew;
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isNewest ? 'bg-[#E8F5EE]/40 animate-pulse duration-1000' : 'hover:bg-[#F7F8FA]'
                      }`}
                    >
                      <td className="py-3 pr-4 font-medium text-[#17212B]">
                        <span>{item.itemName}</span>
                        <span className="block font-mono text-[11px] text-[#64748B]">
                          ${item.originalPrice.toFixed(2)} → ${item.roundedPrice.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#17212B]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                              item.side === 'YES'
                                ? 'bg-[#E8F5EE] text-[#16734B] border-[#C6E7D5]'
                                : 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                            }`}
                          >
                            {item.side}
                          </span>
                          <span className="truncate max-w-[260px] font-medium" title={item.marketQuestion}>
                            {item.marketShortTitle}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#16734B]">
                        +${item.roundUpAmount.toFixed(2)}
                      </td>

                      <td className="py-3 pl-4 text-right text-[#64748B] font-mono text-[11px]">
                        {formatTime(item.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Rows */}
          <div className="sm:hidden divide-y divide-[#F3F4F6] text-xs">
            {filteredActivity.map((item, index) => {
              const isNewest = index === 0 && item.isNew;
              return (
                <div
                  key={item.id}
                  className={`py-3 space-y-1.5 transition-colors ${
                    isNewest ? 'bg-[#E8F5EE]/40 px-2 rounded-lg' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#17212B]">{item.itemName}</span>
                      <span className="text-[11px] font-mono text-[#64748B] ml-2">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    </div>

                    <span className="font-mono font-bold text-[#16734B]">
                      +${item.roundUpAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <span
                        className={`text-[9px] font-bold px-1 py-0.5 rounded border shrink-0 ${
                          item.side === 'YES'
                            ? 'bg-[#E8F5EE] text-[#16734B] border-[#C6E7D5]'
                            : 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                        }`}
                      >
                        {item.side}
                      </span>
                      <span className="truncate">{item.marketShortTitle}</span>
                    </div>
                    <span className="shrink-0 font-mono">{formatTime(item.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
