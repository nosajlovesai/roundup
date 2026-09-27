import React, { useState } from 'react';
import { RotateCcw, HelpCircle, X, Smartphone } from 'lucide-react';
import { RoundUpLogo } from './RoundUpLogo';

interface HeaderProps {
  onReset: () => void;
  hasStateToReset: boolean;
  activeSection: 'markets' | 'activity';
  onNavigate: (section: 'markets' | 'activity') => void;
  onOpenMobileDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasStateToReset,
  activeSection,
  onNavigate,
  onOpenMobileDemo,
}) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left: Logo + Name + Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <RoundUpLogo className="w-7 h-7 rounded-full shrink-0" />
              <span className="text-base font-bold tracking-tight text-[#17212B]">
                Round Up
              </span>
            </div>

            {/* Navigation: Markets & Activity */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => onNavigate('markets')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeSection === 'markets'
                    ? 'text-[#16734B] bg-[#E8F5EE] font-semibold'
                    : 'text-[#64748B] hover:text-[#17212B] hover:bg-[#F3F4F6]'
                }`}
              >
                Markets
              </button>
              <button
                type="button"
                onClick={() => onNavigate('activity')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeSection === 'activity'
                    ? 'text-[#16734B] bg-[#E8F5EE] font-semibold'
                    : 'text-[#64748B] hover:text-[#17212B] hover:bg-[#F3F4F6]'
                }`}
              >
                Activity
              </button>
              <button
                type="button"
                onClick={onOpenMobileDemo}
                className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold text-[#16734B] bg-[#E8F5EE] hover:bg-[#D6EFE2] transition-colors cursor-pointer shrink-0"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile demo</span>
                <span className="sm:hidden">App demo</span>
              </button>
            </nav>
          </div>

          {/* Right: Demo mode badge, How it works, Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center text-xs font-medium text-[#64748B] bg-[#F7F8FA] border border-[#E5E7EB] px-2 py-0.5 rounded">
              Demo mode
            </span>

            <button
              type="button"
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#64748B] hover:text-[#17212B] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">How it works</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              title="Reset prototype state"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#64748B] hover:text-[#17212B] hover:bg-[#F3F4F6] border border-[#E5E7EB] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* How It Works Dialog */}
      {showHowItWorks && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowHowItWorks(false)}
        >
          <div
            className="bg-white border border-[#E5E7EB] rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 text-[#17212B]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-bold text-[#17212B]">How Round Up works</h3>
              <button
                type="button"
                onClick={() => setShowHowItWorks(false)}
                className="text-[#64748B] hover:text-[#17212B] p-1 rounded-md hover:bg-[#F3F4F6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#16734B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-[#17212B]">Choose a prediction and side</p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Browse active prediction markets and pick YES or NO on any outcome you want to back.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#16734B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-[#17212B]">Turn on round-ups</p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Toggle automatic round-ups in your side panel to route future spare change toward your selected contract.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#16734B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-[#17212B]">Try a demo purchase and watch spare change get allocated</p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Simulate everyday card swipes (like a $4.60 coffee rounding up to $5.00) and track your allocations in real time.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHowItWorks(false)}
                className="w-full py-2 px-4 rounded-lg bg-[#16734B] text-white text-xs font-semibold hover:bg-[#125838] transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
