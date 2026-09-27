import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Coffee,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  Store,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import { FICTIONAL_MARKETS } from '../data/markets';
import { PredictionMarket, PredictionSide, SelectedPrediction } from '../types';
import { playSimulatedChime } from '../utils/audio';
import { AppleFaceIdIcon } from './AppleFaceIdIcon';
import { ApplePayCheckmark } from './ApplePayCheckmark';
import { ApplePayButton } from './ApplePayButton';
import { ApplePayWebSheet } from './ApplePayWebSheet';
import { SimulatedStatusBar } from './SimulatedStatusBar';
import { DemoPaymentCard } from './DemoPaymentCard';
import { RoundUpNotificationCard } from './RoundUpNotificationCard';

interface MobileDemoViewProps {
  initialSelectedPrediction: SelectedPrediction | null;
  totalAllocated: number;
  onAddAllocation: (allocation: {
    roundUpAmount: number;
    marketQuestion: string;
    marketShortTitle: string;
    side: PredictionSide;
    itemName: string;
    originalPrice: number;
    roundedPrice: number;
  }) => void;
  onResetMobileDemoAllocations: () => void;
  onBackToDashboard: () => void;
}

type DemoMode = 'in-store' | 'online';

type InStoreState =
  | 'ready_to_pay'
  | 'wallet_authorizing'
  | 'hold_near_reader'
  | 'sensor_tap'
  | 'payment_done'
  | 'lock_screen_idle'
  | 'notification_active'
  | 'notification_approved'
  | 'notification_skipped'
  | 'notification_dismissed';

type OnlineState =
  | 'checkout'
  | 'sheet_open'
  | 'processing'
  | 'payment_success'
  | 'post_payment'
  | 'notification_active'
  | 'notification_approved'
  | 'notification_skipped'
  | 'notification_dismissed';

export const MobileDemoView: React.FC<MobileDemoViewProps> = ({
  initialSelectedPrediction,
  totalAllocated,
  onAddAllocation,
  onResetMobileDemoAllocations,
  onBackToDashboard,
}) => {
  const [activeMode, setActiveMode] = useState<DemoMode>('in-store');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Market and outcome configuration
  const [selectedMarketId, setSelectedMarketId] = useState<string>(
    initialSelectedPrediction?.marketId || 'sports-monarchs'
  );
  const [selectedSide, setSelectedSide] = useState<PredictionSide>(
    initialSelectedPrediction?.side || 'YES'
  );

  const [showMarketSelector, setShowMarketSelector] = useState(false);

  // In-Store flow state
  const [inStoreState, setInStoreState] = useState<InStoreState>('ready_to_pay');

  // Online flow state (secondary)
  const [onlineState, setOnlineState] = useState<OnlineState>('checkout');

  // Destination captured at payment initiation to prevent later market redirection
  const [lockedDestination, setLockedDestination] = useState<{
    market: PredictionMarket;
    side: PredictionSide;
  } | null>(null);

  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const addTimeout = (callback: () => void, ms: number) => {
    const timer = setTimeout(callback, ms);
    timerRefs.current.push(timer);
    return timer;
  };

  const clearAllTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const activeMarket =
    FICTIONAL_MARKETS.find((m) => m.id === selectedMarketId) || FICTIONAL_MARKETS[0];

  const destinationToDisplay = lockedDestination || {
    market: activeMarket,
    side: selectedSide,
  };

  // ==========================================
  // IN-STORE FLOW (MAIN DEMO)
  // ==========================================

  // Step B: Open Wallet & simulated authorization
  const handleOpenWallet = () => {
    clearAllTimers();
    // Lock prediction target for this purchase
    setLockedDestination({
      market: activeMarket,
      side: selectedSide,
    });

    setInStoreState('wallet_authorizing');

    // Restrained authorization transition
    addTimeout(() => {
      setInStoreState('hold_near_reader');
    }, 850);
  };

  // User cancels payment before tapping reader
  const handleCancelInStorePayment = () => {
    clearAllTimers();
    setInStoreState('ready_to_pay');
    setLockedDestination(null);
  };

  // Step D -> E: Tap Contactless Reader
  const handleTapContactlessReader = () => {
    if (inStoreState !== 'hold_near_reader') return;

    setInStoreState('sensor_tap');

    // Short contact handshake
    addTimeout(() => {
      playSimulatedChime(soundEnabled);
      setInStoreState('payment_done');

      // Hold checkmark state briefly (~1000ms), then return to lock screen
      addTimeout(() => {
        setInStoreState('lock_screen_idle');

        // Step 5: Wait approximately 600ms after payment interface closes, then show notification
        addTimeout(() => {
          setInStoreState('notification_active');
        }, 600);
      }, 1050);
    }, 450);
  };

  // Step 6: Approve Round Up
  const handleApproveInStoreRoundUp = () => {
    if (inStoreState !== 'notification_active' || !lockedDestination) return;

    setInStoreState('notification_approved');
    onAddAllocation({
      roundUpAmount: 0.4,
      marketQuestion: lockedDestination.market.question,
      marketShortTitle: lockedDestination.market.shortName,
      side: lockedDestination.side,
      itemName: 'Coffee',
      originalPrice: 4.6,
      roundedPrice: 5.0,
    });
  };

  // Step 6: Skip Round Up
  const handleSkipInStoreRoundUp = () => {
    if (inStoreState !== 'notification_active') return;
    setInStoreState('notification_skipped');
  };

  // Dismiss notification
  const handleDismissInStoreRoundUp = () => {
    if (inStoreState !== 'notification_active') return;
    setInStoreState('notification_dismissed');
  };

  // Replay in-store flow
  const handleReplayInStore = () => {
    clearAllTimers();
    setInStoreState('ready_to_pay');
    setLockedDestination(null);
  };

  // ==========================================
  // ONLINE FLOW (SECONDARY)
  // ==========================================

  const handleStartOnlineApplePay = () => {
    clearAllTimers();
    setLockedDestination({
      market: activeMarket,
      side: selectedSide,
    });
    setOnlineState('sheet_open');
  };

  const handleCancelOnlineSheet = () => {
    clearAllTimers();
    setOnlineState('checkout');
    setLockedDestination(null);
  };

  const handleConfirmOnlinePayment = () => {
    setOnlineState('processing');

    addTimeout(() => {
      playSimulatedChime(soundEnabled);
      setOnlineState('payment_success');

      addTimeout(() => {
        setOnlineState('post_payment');

        // Wait 600ms after payment sheet closes
        addTimeout(() => {
          setOnlineState('notification_active');
        }, 600);
      }, 950);
    }, 850);
  };

  const handleApproveOnlineRoundUp = () => {
    if (onlineState !== 'notification_active' || !lockedDestination) return;

    setOnlineState('notification_approved');
    onAddAllocation({
      roundUpAmount: 0.4,
      marketQuestion: lockedDestination.market.question,
      marketShortTitle: lockedDestination.market.shortName,
      side: lockedDestination.side,
      itemName: 'Coffee',
      originalPrice: 4.6,
      roundedPrice: 5.0,
    });
  };

  const handleSkipOnlineRoundUp = () => {
    if (onlineState !== 'notification_active') return;
    setOnlineState('notification_skipped');
  };

  const handleDismissOnlineRoundUp = () => {
    if (onlineState !== 'notification_active') return;
    setOnlineState('notification_dismissed');
  };

  const handleReplayOnline = () => {
    clearAllTimers();
    setOnlineState('checkout');
    setLockedDestination(null);
  };

  // Master demo reset
  const handleResetDemo = () => {
    clearAllTimers();
    setInStoreState('ready_to_pay');
    setOnlineState('checkout');
    setLockedDestination(null);
    onResetMobileDemoAllocations();
  };

  const isPaymentCardVisible =
    inStoreState === 'wallet_authorizing' ||
    inStoreState === 'hold_near_reader' ||
    inStoreState === 'sensor_tap' ||
    inStoreState === 'payment_done';

  return (
    <div className="min-h-screen bg-[#F0F2F5] sm:py-8 sm:px-4 flex flex-col items-center justify-center selection:bg-[#E8F5EE] selection:text-[#16734B]">
      {/* Outer Navigation & Control Bar (Desktop) */}
      <div className="w-full max-w-[400px] mb-3 hidden sm:flex items-center justify-between text-xs text-[#4B5563] px-1">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 font-semibold text-[#17212B] hover:text-[#16734B] p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Sound Toggle (Off by default as required) */}
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? 'Mute simulated audio' : 'Enable simulated prototype chime'}
            className="inline-flex items-center gap-1 font-medium text-[#64748B] hover:text-[#17212B] p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#16734B]" />
                <span className="text-[#16734B]">Sound: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span>Sound: Off</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-1 font-medium text-[#64748B] hover:text-[#17212B] p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Segmented Mode Selector */}
      <div className="w-full max-w-[390px] mb-3 px-2 sm:px-0">
        <div className="bg-[#E2E5EA] p-1 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              clearAllTimers();
              setActiveMode('in-store');
              setInStoreState('ready_to_pay');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'in-store'
                ? 'bg-white text-[#17212B] shadow-xs'
                : 'text-[#64748B] hover:text-[#17212B]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>In-Store (Tap)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              clearAllTimers();
              setActiveMode('online');
              setOnlineState('checkout');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'online'
                ? 'bg-white text-[#17212B] shadow-xs'
                : 'text-[#64748B] hover:text-[#17212B]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Online (Web Checkout)</span>
          </button>
        </div>
      </div>

      {/* Simulated Phone Frame */}
      <div className="w-full sm:max-w-[390px] min-h-screen sm:min-h-[810px] sm:max-h-[844px] bg-black sm:rounded-[54px] sm:shadow-2xl sm:border-[10px] sm:border-[#1E1E20] flex flex-col justify-between relative overflow-hidden text-[#17212B]">
        {/* Simulated Hardware Side Button (Desktop only, single click activates) */}
        {activeMode === 'in-store' && inStoreState === 'ready_to_pay' && (
          <button
            type="button"
            onClick={handleOpenWallet}
            title="Click side button to open Wallet"
            className="hidden sm:block absolute -right-[12px] top-[145px] w-2.5 h-16 bg-zinc-600 hover:bg-zinc-400 rounded-r-md cursor-pointer z-50 transition-colors"
          />
        )}

        {/* ========================================================================= */}
        {/* 1. IN-STORE PAYMENT FLOW (PRIMARY DEMO)                                   */}
        {/* ========================================================================= */}
        {activeMode === 'in-store' && (
          <div className="flex-1 flex flex-col justify-between relative bg-gradient-to-b from-[#181E29] via-[#0F141C] to-[#080B10] text-white select-none">
            {/* iOS Status Bar */}
            <SimulatedStatusBar theme="dark" time="9:41" />

            {/* In-Store Canvas */}
            <div className="flex-1 flex flex-col justify-between p-5 relative overflow-hidden">
              {/* STAGE A: READY TO PAY / LOCK SCREEN SETUP */}
              {inStoreState === 'ready_to_pay' && (
                <div className="flex-1 flex flex-col justify-between py-2 text-center animate-in fade-in duration-200 relative">
                  {/* Side Button Trigger Capsule on Screen Bezel */}
                  <div className="absolute right-0 top-[105px] z-40 animate-side-prompt">
                    <button
                      type="button"
                      onClick={handleOpenWallet}
                      className="bg-white/95 text-black font-semibold text-xs py-2 pl-3.5 pr-2.5 rounded-l-full shadow-xl flex items-center gap-1 border border-r-0 border-white/50 cursor-pointer active:scale-95 transition-transform"
                    >
                      <span className="text-[11px] font-sans">Double-Click Side Button</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-700 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Lock Screen Clock */}
                  <div className="space-y-0.5 pt-4">
                    <span className="text-xs font-medium text-zinc-400">
                      Sunday, September 27
                    </span>
                    <h1 className="text-6xl font-light tracking-tight text-white font-sans">
                      9:41
                    </h1>
                  </div>

                  {/* Order Context Card */}
                  <div className="my-auto space-y-3 p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800">
                      <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                        <Coffee className="w-4 h-4 text-[#10B981]" />
                        <span>Ready to pay · Cafe</span>
                      </span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-sans">
                        Simulated
                      </span>
                    </div>

                    <div className="py-2 space-y-1">
                      <span className="text-xs text-zinc-400">Coffee Purchase</span>
                      <div className="text-3xl font-bold font-mono text-white">$4.60</div>
                    </div>

                    {/* Pre-payment round-up setup configuration */}
                    <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 text-left text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Round-up target</span>
                        <button
                          type="button"
                          onClick={() => setShowMarketSelector(true)}
                          className="text-[#10B981] hover:underline font-semibold cursor-pointer"
                        >
                          Change
                        </button>
                      </div>

                      <div className="flex items-center justify-between font-semibold text-zinc-200">
                        <span className="truncate max-w-[200px]">
                          {destinationToDisplay.market.shortName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            destinationToDisplay.side === 'YES'
                              ? 'bg-[#E8F5EE] text-[#16734B]'
                              : 'bg-[#FEE2E2] text-[#991B1B]'
                          }`}
                        >
                          {destinationToDisplay.side}
                        </span>
                      </div>
                    </div>

                    {/* Prominent Action to Open Wallet */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleOpenWallet}
                        className="w-full py-3.5 px-4 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Open Wallet to Pay ($4.60)</span>
                      </button>
                    </div>
                  </div>

                  {/* Lock Screen Bottom Help */}
                  <div className="text-center pb-2">
                    <span className="text-[11px] text-zinc-500 font-sans">
                      Click the button above or side bezel to present payment card
                    </span>
                  </div>
                </div>
              )}

              {/* STAGES B, C, D, E: APPLE PAYMENT INTERFACE */}
              {/* Notice: Round Up is kept OUT of this interface entirely */}
              {isPaymentCardVisible && (
                <div className="flex-1 flex flex-col justify-between py-2 space-y-4 animate-wallet-card-enter">
                  {/* Top Header: Cancel Button */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-xs text-zinc-400 font-sans">Payment Card</span>
                    {inStoreState === 'hold_near_reader' && (
                      <button
                        type="button"
                        onClick={handleCancelInStorePayment}
                        className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Payment Card (Neutral demo payment card with masked digits) */}
                  <div className="relative">
                    <DemoPaymentCard
                      onClick={
                        inStoreState === 'hold_near_reader'
                          ? handleTapContactlessReader
                          : undefined
                      }
                      className={
                        inStoreState === 'hold_near_reader'
                          ? 'cursor-pointer hover:scale-[1.01] transition-transform'
                          : ''
                      }
                    />
                  </div>

                  {/* SUB-STATE: Simulated Face ID Authorization */}
                  {inStoreState === 'wallet_authorizing' && (
                    <div className="my-auto py-6 flex flex-col items-center justify-center space-y-3 animate-in zoom-in-95 duration-150">
                      <div className="w-20 h-20 rounded-3xl bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center shadow-xl">
                        <AppleFaceIdIcon isVerifying={true} className="w-12 h-12" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <span className="text-sm font-medium text-white block">Face ID</span>
                        <span className="text-xs text-zinc-400 font-sans">Authorizing…</span>
                      </div>
                    </div>
                  )}

                  {/* SUB-STATE: Hold Near Reader (Contactless Tap Target) */}
                  {inStoreState === 'hold_near_reader' && (
                    <div className="my-auto flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-white/20 animate-contactless-wave" />
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white z-10">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-6 h-6 rotate-90"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                            <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                            <path d="M15.5 21.5a12 12 0 0 1 0-19" />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-medium text-white tracking-tight font-sans">
                          Hold Near Reader
                        </h3>
                        <p className="text-xs text-zinc-400 font-sans">
                          Purchase amount: $4.60
                        </p>
                      </div>

                      {/* Obvious Tap Target to complete contactless payment */}
                      <div className="w-full pt-2">
                        <button
                          type="button"
                          onClick={handleTapContactlessReader}
                          className="w-full py-3.5 px-4 rounded-2xl bg-[#10B981] text-zinc-950 font-semibold text-xs hover:bg-[#059669] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                        >
                          <span>Tap Reader to Complete ($4.60)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUB-STATE: Sensor Handshake Feedback */}
                  {inStoreState === 'sensor_tap' && (
                    <div className="my-auto py-8 flex flex-col items-center justify-center space-y-3 animate-in zoom-in-95 duration-150">
                      <div className="flex items-center gap-2.5 p-3 bg-zinc-900 rounded-full border border-zinc-700">
                        <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                        <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                        <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                        <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <span className="text-sm font-semibold text-white block">Connecting…</span>
                        <span className="text-xs text-zinc-400 font-mono">Processing $4.60</span>
                      </div>
                    </div>
                  )}

                  {/* SUB-STATE: Payment Done Checkmark */}
                  {inStoreState === 'payment_done' && (
                    <div className="my-auto py-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-150">
                      <ApplePayCheckmark label="Done" size={72} />
                      <span className="text-xs text-zinc-400 font-mono mt-3">$4.60 paid to Cafe</span>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE F: LOCK SCREEN WITH ROUND UP NOTIFICATION (APPEARS AFTER PAYMENT) */}
              {(inStoreState === 'lock_screen_idle' ||
                inStoreState === 'notification_active' ||
                inStoreState === 'notification_approved' ||
                inStoreState === 'notification_skipped' ||
                inStoreState === 'notification_dismissed') && (
                <div className="flex-1 flex flex-col justify-between py-2 text-center animate-in fade-in duration-200">
                  {/* Lock Screen Clock */}
                  <div className="space-y-0.5 pt-4">
                    <span className="text-xs font-medium text-zinc-400">
                      Sunday, September 27
                    </span>
                    <h1 className="text-6xl font-light tracking-tight text-white font-sans">
                      9:41
                    </h1>
                  </div>

                  {/* Notification Area */}
                  <div className="my-auto space-y-3">
                    {/* Base transaction settled indicator */}
                    <div className="text-center pb-1">
                      <span className="text-xs font-mono text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-full">
                        Coffee: $4.60 settled
                      </span>
                    </div>

                    {/* Round Up Notification (slides in ~600ms after payment completion) */}
                    {(inStoreState === 'notification_active' ||
                      inStoreState === 'notification_approved' ||
                      inStoreState === 'notification_skipped' ||
                      inStoreState === 'notification_dismissed') && (
                      <RoundUpNotificationCard
                        status={
                          inStoreState === 'notification_approved'
                            ? 'approved'
                            : inStoreState === 'notification_skipped'
                            ? 'skipped'
                            : inStoreState === 'notification_dismissed'
                            ? 'dismissed'
                            : 'active'
                        }
                        amountDue={4.6}
                        roundUpAmount={0.4}
                        marketShortTitle={destinationToDisplay.market.shortName}
                        side={destinationToDisplay.side}
                        totalAllocated={totalAllocated}
                        onApprove={handleApproveInStoreRoundUp}
                        onSkip={handleSkipInStoreRoundUp}
                        onDismiss={handleDismissInStoreRoundUp}
                      />
                    )}

                    {/* Post-Decision Replay / Back Navigation */}
                    {(inStoreState === 'notification_approved' ||
                      inStoreState === 'notification_skipped' ||
                      inStoreState === 'notification_dismissed') && (
                      <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                        <button
                          type="button"
                          onClick={handleReplayInStore}
                          className="w-full py-2.5 px-4 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Tap to pay again</span>
                        </button>
                        <button
                          type="button"
                          onClick={onBackToDashboard}
                          className="w-full py-2 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          Back to dashboard
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-center pb-2">
                    <span className="text-[11px] text-zinc-500 font-sans">
                      Lock screen active
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="pb-2 pt-1 flex justify-center bg-black/40">
              <div className="w-32 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ONLINE CHECKOUT FLOW (SECONDARY DEMO)                                  */}
        {/* ========================================================================= */}
        {activeMode === 'online' && (
          <div className="flex-1 flex flex-col justify-between relative bg-white text-[#17212B]">
            {/* Status Bar */}
            <SimulatedStatusBar theme="light" time="9:41" />

            {/* Top Navigation */}
            <div className="px-4 py-2 bg-white border-b border-[#F3F4F6] flex items-center justify-between text-xs z-10">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1 text-[#16734B] font-semibold hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <span className="text-xs font-semibold text-[#17212B]">
                Cafe Checkout
              </span>

              <button
                type="button"
                onClick={handleResetDemo}
                className="text-xs text-[#64748B] hover:text-[#17212B] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Checkout Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col justify-between relative">
              {/* Notification Banner on Web Page (after payment completes) */}
              {(onlineState === 'notification_active' ||
                onlineState === 'notification_approved' ||
                onlineState === 'notification_skipped' ||
                onlineState === 'notification_dismissed') && (
                <div className="mb-4">
                  <RoundUpNotificationCard
                    status={
                      onlineState === 'notification_approved'
                        ? 'approved'
                        : onlineState === 'notification_skipped'
                        ? 'skipped'
                        : onlineState === 'notification_dismissed'
                        ? 'dismissed'
                        : 'active'
                    }
                    amountDue={4.6}
                    roundUpAmount={0.4}
                    marketShortTitle={destinationToDisplay.market.shortName}
                    side={destinationToDisplay.side}
                    totalAllocated={totalAllocated}
                    onApprove={handleApproveOnlineRoundUp}
                    onSkip={handleSkipOnlineRoundUp}
                    onDismiss={handleDismissOnlineRoundUp}
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB]">
                  <div className="w-12 h-12 rounded-xl bg-[#E8F5EE] text-[#16734B] flex items-center justify-center shrink-0">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-[#17212B] leading-tight">
                      Coffee
                    </h2>
                    <span className="text-xs text-[#64748B] block">Fresh Brew</span>
                    <span className="text-xs font-mono font-semibold text-[#16734B]">
                      $4.60
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] text-xs space-y-2">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Coffee</span>
                    <span className="font-mono text-[#17212B] font-medium">$4.60</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Sales Tax</span>
                    <span className="font-mono text-[#17212B] font-medium">$0.00</span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E7EB] flex justify-between font-bold text-sm text-[#17212B]">
                    <span>Total</span>
                    <span className="font-mono">$4.60</span>
                  </div>
                </div>

                {/* Round Up Target Configuration (before checkout) */}
                <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#64748B]">
                      Round-up target
                    </span>
                    {onlineState === 'checkout' && (
                      <button
                        type="button"
                        onClick={() => setShowMarketSelector(true)}
                        className="text-[11px] text-[#16734B] font-semibold hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-semibold text-xs text-[#17212B] truncate max-w-[200px]">
                      {destinationToDisplay.market.shortName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        destinationToDisplay.side === 'YES'
                          ? 'bg-[#E8F5EE] text-[#16734B] border-[#C6E7D5]'
                          : 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                      }`}
                    >
                      {destinationToDisplay.side}
                    </span>
                  </div>
                </div>

                {/* Post-Transaction Replay controls */}
                {(onlineState === 'notification_approved' ||
                  onlineState === 'notification_skipped' ||
                  onlineState === 'notification_dismissed') && (
                  <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                    <button
                      type="button"
                      onClick={handleReplayOnline}
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#17212B] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Order again</span>
                    </button>

                    <button
                      type="button"
                      onClick={onBackToDashboard}
                      className="w-full min-h-[40px] py-2 px-4 rounded-xl bg-white border border-[#E5E7EB] text-[#17212B] text-xs font-semibold hover:bg-[#F3F4F6] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Back to dashboard</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Apple Pay Button Trigger */}
              {onlineState === 'checkout' && (
                <div className="pt-4">
                  <ApplePayButton
                    buttonType="plain"
                    buttonStyle="black"
                    onClick={handleStartOnlineApplePay}
                    className="w-full"
                  />
                </div>
              )}

              {/* Settled indicator */}
              {(onlineState === 'post_payment' ||
                onlineState === 'notification_active' ||
                onlineState === 'notification_approved' ||
                onlineState === 'notification_skipped' ||
                onlineState === 'notification_dismissed') && (
                <div className="pt-2 text-center text-xs text-[#64748B]">
                  <span className="font-mono text-[11px] text-[#16734B]">
                    Paid $4.60
                  </span>
                </div>
              )}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="pb-2 pt-1 flex justify-center bg-white">
              <div className="w-32 h-1 bg-[#D1D5DB] rounded-full" />
            </div>

            {/* Apple Pay Web Sheet Modal */}
            <ApplePayWebSheet
              isOpen={
                onlineState === 'sheet_open' ||
                onlineState === 'processing' ||
                onlineState === 'payment_success'
              }
              onClose={handleCancelOnlineSheet}
              onConfirm={handleConfirmOnlinePayment}
              flowStep={
                onlineState === 'processing'
                  ? 'authorizing'
                  : onlineState === 'payment_success'
                  ? 'success'
                  : 'review'
              }
              amount={4.6}
              merchantName="Cafe"
              itemName="Coffee"
            />
          </div>
        )}

        {/* Prediction Destination Picker Sheet */}
        {showMarketSelector && (
          <div
            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150"
            onClick={() => setShowMarketSelector(false)}
          >
            <div
              className="bg-white rounded-t-3xl p-5 space-y-4 shadow-2xl max-h-[80%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <h3 className="text-sm font-bold text-[#17212B]">
                  Select round-up destination
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMarketSelector(false)}
                  className="text-[#64748B] hover:text-[#17212B] p-1 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {FICTIONAL_MARKETS.map((market) => (
                  <div
                    key={market.id}
                    className="p-3 rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] space-y-2"
                  >
                    <div>
                      <span className="font-semibold text-[#17212B] block">
                        {market.shortName}
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        {market.categoryLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMarketId(market.id);
                          setSelectedSide('YES');
                          setShowMarketSelector(false);
                        }}
                        className={`py-2 px-2.5 rounded-xl font-semibold text-xs border transition-colors cursor-pointer ${
                          selectedMarketId === market.id && selectedSide === 'YES'
                            ? 'bg-[#16734B] text-white border-[#16734B]'
                            : 'bg-white text-[#16734B] border-[#C6E7D5] hover:bg-[#E8F5EE]'
                        }`}
                      >
                        YES · {market.simulatedProbabilityYes}¢
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMarketId(market.id);
                          setSelectedSide('NO');
                          setShowMarketSelector(false);
                        }}
                        className={`py-2 px-2.5 rounded-xl font-semibold text-xs border transition-colors cursor-pointer ${
                          selectedMarketId === market.id && selectedSide === 'NO'
                            ? 'bg-[#991B1B] text-white border-[#991B1B]'
                            : 'bg-white text-[#991B1B] border-[#FECACA] hover:bg-[#FEE2E2]'
                        }`}
                      >
                        NO · {100 - market.simulatedProbabilityYes}¢
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiet disclaimer note outside simulated phone frame */}
      <div className="mt-3 text-center text-xs text-[#64748B] select-none">
        <span>Interactive prototype · No real payments</span>
      </div>
    </div>
  );
};
