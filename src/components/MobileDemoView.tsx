import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Coffee, RotateCcw, Play, Volume2, VolumeX, LockKeyhole, Nfc } from 'lucide-react';
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
import { RoundUpLogo } from './RoundUpLogo';

interface MobileDemoViewProps {
  initialSelectedPrediction: SelectedPrediction | null;
  totalAllocated: number;
  onAddAllocation: (allocation: {
    roundUpAmount: number; marketQuestion: string; marketShortTitle: string;
    side: PredictionSide; itemName: string; originalPrice: number; roundedPrice: number;
  }) => void;
  onResetMobileDemoAllocations: () => void;
  onBackToDashboard: () => void;
}

type Mode = 'in-store' | 'online';
type Step = 'ready' | 'review' | 'authorizing' | 'reader' | 'processing' | 'done'
  | 'receipt' | 'notification' | 'approved' | 'skipped' | 'dismissed';
type Destination = { market: PredictionMarket; side: PredictionSide };
const PRICE = 4.60;
const CHANGE = 0.40;

const STEP_LABELS: Record<Step, string> = {
  ready: 'Ready for a coffee', review: 'Review payment', authorizing: 'Face ID preview',
  reader: 'Hold near the reader', processing: 'Payment processing', done: 'Payment complete',
  receipt: 'Returning to your purchase', notification: 'Your spare change, your choice',
  approved: 'Round-up added', skipped: 'Round-up skipped', dismissed: 'Notification dismissed',
};

export const MobileDemoView: React.FC<MobileDemoViewProps> = ({
  initialSelectedPrediction, totalAllocated, onAddAllocation,
  onResetMobileDemoAllocations, onBackToDashboard,
}) => {
  const [mode, setMode] = useState<Mode>('in-store');
  const [step, setStep] = useState<Step>('ready');
  const phone = useRef<HTMLElement>(null);
  // A synchronous guard protects against rapid clicks before React commits a render.
  const stepRef = useRef<Step>('ready');
  const [autoplay, setAutoplay] = useState(false);
  const [sound, setSound] = useState(false);
  const [marketId, setMarketId] = useState(initialSelectedPrediction?.marketId || FICTIONAL_MARKETS[0].id);
  const [side, setSide] = useState<PredictionSide>(initialSelectedPrediction?.side || 'YES');
  const [destination, setDestination] = useState<Destination | null>(null);
  const market = FICTIONAL_MARKETS.find((item) => item.id === marketId) || FICTIONAL_MARKETS[0];
  const target = destination || { market, side };
  const paymentVisible = ['authorizing', 'reader', 'processing', 'done'].includes(step);
  const finished = ['approved', 'skipped', 'dismissed'].includes(step);
  const afterPayment = ['receipt', 'notification', 'approved', 'skipped', 'dismissed'].includes(step);

  const advance = (next: Step) => { stepRef.current = next; setStep(next); };
  const replay = () => {
    advance('ready');
    setDestination(null);
    setAutoplay(false);
  };
  const begin = (play: boolean) => {
    if (stepRef.current !== 'ready') return;
    setDestination({ market, side });
    setAutoplay(play);
    advance(mode === 'online' ? 'review' : 'authorizing');
    if (window.innerWidth <= 800) phone.current?.scrollIntoView({
      block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };
  const confirm = () => {
    if (stepRef.current === 'review') advance('authorizing');
  };
  const tapReader = () => {
    if (stepRef.current === 'reader') advance('processing');
  };
  const decide = (decision: 'approved' | 'skipped' | 'dismissed') => {
    if (stepRef.current !== 'notification' || !destination) return;
    advance(decision);
    if (decision === 'approved') {
      onAddAllocation({
        roundUpAmount: CHANGE, marketQuestion: destination.market.question,
        marketShortTitle: destination.market.shortName, side: destination.side,
        itemName: 'Coffee', originalPrice: PRICE, roundedPrice: 5,
      });
    }
  };

  useEffect(() => {
    let next: Step | undefined;
    let delay = 0;
    if (step === 'review' && autoplay) { next = 'authorizing'; delay = 1800; }
    if (step === 'authorizing') { next = mode === 'in-store' ? 'reader' : 'processing'; delay = 1100; }
    if (step === 'reader' && autoplay) { next = 'processing'; delay = 1800; }
    if (step === 'processing') { next = 'done'; delay = 650; }
    if (step === 'done') { next = 'receipt'; delay = 1300; }
    if (step === 'receipt') { next = 'notification'; delay = 600; }
    if (!next) return;
    const nextStep = next;
    const timer = window.setTimeout(() => {
      if (stepRef.current !== step) return;
      if (nextStep === 'done') playSimulatedChime(sound);
      advance(nextStep);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [step, mode, autoplay, sound]);

  const notification = (
    <RoundUpNotificationCard status={finished ? step as 'approved' | 'skipped' | 'dismissed' : 'active'}
      amountDue={PRICE} roundUpAmount={CHANGE} marketShortTitle={target.market.shortName}
      side={target.side} totalAllocated={totalAllocated}
      onApprove={() => decide('approved')} onSkip={() => decide('skipped')} onDismiss={() => decide('dismissed')} />
  );

  return (
    <main className="payment-demo">
      <header className="demo-toolbar">
        <button type="button" onClick={onBackToDashboard}><ArrowLeft size={17} />Dashboard</button>
        <span>Interactive demo · No real payments</span>
        <button type="button" onClick={() => { replay(); onResetMobileDemoAllocations(); }}>
          <RotateCcw size={15} />Reset
        </button>
      </header>

      <div className="demo-layout">
        <section className="demo-story" aria-label="Demo controls">
          <div className="demo-brand"><RoundUpLogo className="w-8 h-8" /><span>Round Up</span></div>
          <h1>A coffee.<br /> A little change.<br /> <em>Your next prediction.</em></h1>
          <p className="demo-intro">Pay $4.60 for your coffee. Then choose where the remaining $0.40 goes.</p>

          <div className="demo-modes" aria-label="Payment scenario">
            <button type="button" aria-pressed={mode === 'in-store'} onClick={() => { replay(); setMode('in-store'); }}>In store</button>
            <button type="button" aria-pressed={mode === 'online'} onClick={() => { replay(); setMode('online'); }}>Online checkout</button>
          </div>

          <details className="demo-destination">
            <summary><span>Round-up destination</span><strong>{target.market.shortName} · {target.side}</strong></summary>
            <label htmlFor="demo-market">Prediction</label>
            <select id="demo-market" value={marketId} disabled={step !== 'ready'} onChange={(event) => setMarketId(event.target.value)}>
              {FICTIONAL_MARKETS.map((item) => <option key={item.id} value={item.id}>{item.shortName}</option>)}
            </select>
            <div className="demo-sides">
              {(['YES', 'NO'] as const).map((value) => (
                <button key={value} type="button" disabled={step !== 'ready'} aria-pressed={side === value} onClick={() => setSide(value)}>{value}</button>
              ))}
            </div>
            {step !== 'ready' && <small>Replay to choose a new destination.</small>}
          </details>

          <div className="demo-playback">
            {step === 'ready' ? (
              <>
                <button type="button" className="demo-primary" onClick={() => begin(true)}><Play size={16} />Play demo</button>
                {mode === 'in-store' && <button type="button" className="demo-secondary" onClick={() => begin(false)}>Open Wallet step by step</button>}
              </>
            ) : <button type="button" className="demo-secondary" onClick={replay}><RotateCcw size={16} />Replay demo</button>}
            {step === 'reader' && !autoplay && <button type="button" className="demo-primary" onClick={tapReader}><Nfc size={17} />Simulate tap at reader</button>}
            {paymentVisible && mode === 'in-store' && step !== 'done' &&
              <button type="button" className="demo-text-button" onClick={replay}>Cancel payment</button>}
          </div>

          <ol className="demo-sequence" aria-label="Demo progress">
            {['Pay for coffee', 'Choose your round-up', 'See it in Round Up'].map((label, index) => (
              <li key={label} aria-current={(index === 0 && !afterPayment) || (index === 1 && step === 'notification') || (index === 2 && finished) ? 'step' : undefined}>
                <span>{index + 1}</span>{label}
              </li>
            ))}
          </ol>
          <div className="demo-running-status" role="status">{STEP_LABELS[step]}</div>
          <div className="demo-footnotes">
            <button type="button" aria-pressed={sound} onClick={() => setSound(!sound)}>
              {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}Demo sound {sound ? 'on' : 'off'}
            </button>
            <a href="https://applepaydemo.apple.com/" target="_blank" rel="noreferrer">Try Apple's native demo ↗</a>
            <p>Apple Pay interface study. Device chrome and authentication are simulated. Round Up appears after payment.</p>
          </div>
        </section>

        <section ref={phone} className={`demo-phone ${mode === 'online' ? 'demo-phone-online' : ''}`} aria-label={`${mode === 'online' ? 'Online' : 'In-store'} payment preview`}>
          <SimulatedStatusBar theme={mode === 'online' ? 'light' : 'dark'} />
          {mode === 'in-store' ? (
            <div className={`demo-screen ${paymentVisible ? 'demo-wallet' : 'demo-lock-screen'}`}>
              {paymentVisible ? (
                <>
                  <div className="demo-wallet-card"><DemoPaymentCard /></div>
                  <div className="demo-wallet-state" aria-live="polite">
                    {step === 'authorizing' && <><AppleFaceIdIcon isVerifying className="w-16 h-16" /><p>Face ID</p></>}
                    {step === 'reader' && <><Nfc size={48} strokeWidth={1.4} /><p>Hold Near Reader</p></>}
                    {step === 'processing' && <><span className="pay-spinner" /><p>Processing</p></>}
                    {step === 'done' && <ApplePayCheckmark label="Done" />}
                  </div>
                </>
              ) : (
                <>
                  <div className="demo-clock"><LockKeyhole size={22} strokeWidth={2.3} /><p>Sunday, September 27</p><time>9:41</time></div>
                  <div className="demo-lock-content">
                    {step === 'ready' && <div className="demo-lock-hint">Double-click the side button<br />to open Wallet</div>}
                    {(step === 'notification' || finished) && notification}
                    {finished && <button type="button" onClick={(event) => { if (event.detail < 2) onBackToDashboard(); }} className="demo-open-roundup">Open Round Up <span>↗</span></button>}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="demo-screen demo-checkout">
              <div className="demo-cafe-header"><Coffee size={22} /><span>Cafe</span><span>Pickup order</span></div>
              <div className="demo-order">
                {!afterPayment && <>
                  <div className="demo-coffee-art"><Coffee size={76} strokeWidth={1} /></div>
                  <p className="demo-eyebrow">FRESHLY BREWED</p>
                  <h2>Your daily coffee.</h2>
                  <p>One coffee · Pickup at the counter</p>
                </>}
                <div className="demo-order-total"><span>Total</span><strong>$4.60</strong></div>
                {afterPayment && <div className="demo-receipt"><span>✓</span><div><strong>Thanks for your order.</strong><p>$4.60 paid · Demo Debit •••• 4128</p></div></div>}
              </div>
              {(step === 'notification' || finished) && <div className="demo-online-roundup">{notification}</div>}
              {step === 'ready' && <div className="demo-checkout-action"><ApplePayButton onClick={() => begin(false)} /><small>Demo checkout · No charge</small></div>}
              {finished && <button type="button" className="demo-primary" onClick={(event) => { if (event.detail < 2) onBackToDashboard(); }}>Open Round Up</button>}
            </div>
          )}
          <div className="demo-home-indicator" aria-hidden="true" />
          {mode === 'online' && <ApplePayWebSheet isOpen={['review', 'authorizing', 'processing', 'done'].includes(step)}
            onClose={replay} onConfirm={confirm} amount={PRICE} merchantName="Cafe"
            flowStep={step === 'done' ? 'success' : step === 'review' ? 'review' : 'authorizing'} />}
        </section>
      </div>
    </main>
  );
};
