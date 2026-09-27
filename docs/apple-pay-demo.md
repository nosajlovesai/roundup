# Apple Pay demo: sources and fidelity

The `#/mobile-demo` route is an interactive **browser simulation**, not an Apple Pay integration. It never opens an `ApplePaySession`, charges a card, uses biometrics, reads NFC, or reads device battery/network state. Its purchases and prediction allocations are fictional.

## Official sources reviewed

- [Apple Pay Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/apple-pay): payment-sheet information hierarchy, merchant total, result before dismissal, and separate order confirmation.
- [Apple Pay design template](https://developer.apple.com/design/resources/#technologies), [Apple's Sketch document](https://sketch.com/s/b0fa95e1-e12d-4694-895f-a70f39b8f313), and [Apple's Figma document](https://www.figma.com/community/file/1367915141082663884/apple-pay): the iPhone light sheet uses a 58pt navigation region, a 66pt payment-card row, 17pt primary / 15pt secondary card text, and side-button confirmation. The template inspected was the January 9, 2026 version. The demo adapts those measurements to its container; it does not claim pixel equivalence across OS releases.
- [Apple's interactive web demo](https://applepaydemo.apple.com/): the official `apple-pay-button` component and its supported styling variables. The SDK is loaded from `https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js`. No user-agent detection or hand-drawn button branding is used.
- [Apple Pay marketing artwork](https://developer.apple.com/apple-pay/marketing/): `public/apple-pay/apple-pay-mark.svg` is the **unaltered** `Apple_Pay_Mark_RGB_041619.svg` from [Apple-Pay-Mark.zip](https://developer.apple.com/apple-pay/marketing/Apple-Pay-Mark.zip). It is used as an informational mark in the sheet, not as a payment button. Apple owns the artwork; its usage guidelines apply.
- [Pay with Apple Pay](https://support.apple.com/en-us/102626): in-store double-click → authentication → hold near reader → Done; online payment-sheet review → double-click → authentication → Done.
- [Status bars](https://developer.apple.com/design/human-interface-guidelines/status-bars), [SF Symbols](https://developer.apple.com/sf-symbols/), and [Apple Design Resources](https://developer.apple.com/design/resources/): references for device chrome, rather than claims that React can render native iOS system UI.

## What is exact, and what remains simulated

| Element | Implementation |
| --- | --- |
| Online payment button | Apple's SDK web component, not a replica. If the SDK is unavailable, a neutral “Preview payment sheet” button keeps the demo usable. |
| Apple Pay mark | Apple's original SVG with its border and aspect ratio preserved. |
| Typeface | Native system stack; San Francisco where the Apple OS supplies it. No proprietary font files are bundled. Windows/Linux render a local fallback. |
| Desktop battery, Wi-Fi, cellular | Original, documented SVG approximations with corrected clipping and proportions. **Not** SF Symbols exports or live readings. |
| Phone status bar | Simulated status and home bars are hidden below 640px; the actual mobile browser/OS supplies its own chrome. |
| Payment sheet, Face ID, completion, Wallet | HTML/CSS previews informed by the references. Authentication, timing, checkmark and contactless symbol remain illustrative, not native assets or native behavior. |
| Card | A fictional demo debit card, with standard card proportions. No claim of a real issuer, Apple Card, or provisioned Wallet pass. |
| Round Up | Product-owned, post-payment notification concept. Tap to expand it, then approve, skip, or dismiss. It is not inserted inside Apple's payment sheet. |

Apple's UI kits and SF Symbols are not unrestricted web asset libraries. See the [Apple Design Resources license](https://developer.apple.com/support/downloads/terms/apple-design-resources/Apple-Design-Resources-License-20230621-English.pdf). The downloaded design template, its fonts, and extracted system glyphs are not redistributed in this repository.

## Getting the actual Apple UI

Use the linked Apple web demo to inspect a genuine system payment sheet. For Round Up to invoke one, implement [Apple Pay on the Web](https://developer.apple.com/documentation/applepayontheweb) with a merchant identifier, verified HTTPS domain, merchant validation on a server, and a supported payment processor. Use [Apple's sandbox](https://developer.apple.com/apple-pay/sandbox-testing/) for test transactions. Apple renders the sheet and authentication UI; a website does not customize the system Wi-Fi/battery glyphs or embed arbitrary Round Up controls in it.

For exact in-store Wallet footage, capture a real supported iPhone flow and composite the Round Up product concept after payment. A browser cannot reproduce native Wallet authorization, NFC, or a hardware side-button event. Live post-payment notifications also need an actual transaction event integration; Apple Pay JS does not subscribe to unrelated Wallet purchases.

## Demo behavior and verification

- Play demo advances through payment automatically, then stops for an explicit Round Up decision. The step-by-step in-store flow waits for the external reader control. Online checkout waits for side-button confirmation unless autoplay was selected.
- The destination is captured when payment begins. Changing scenarios clears that capture. A synchronous step guard accepts at most one approval per purchase.
- Replay, cancel, mode changes, reset, and unmount cancel the current transition timer. Reset removes mobile-demo allocations through the existing dashboard callback.
- Approval adds $0.40; skip, dismissal, cancellation and merely completing the coffee payment add nothing. The coffee remains $4.60 throughout the payment UI.
- The native HTML dialog traps focus and supports Escape during review. Motion honors `prefers-reduced-motion`. No custom payment form requests card data.

Run `npm run lint` and `npm run build`. This repository uses `bun.lock`; when installing with npm, its existing Vite/esbuild peer mismatch requires `npm install --legacy-peer-deps` (no dependency versions were changed in this work).

Manual regression cases: both complete flows, approve once and see the dashboard ledger, skip, dismiss, cancel during payment, replay during animation, change scenarios during animation, reset allocations, keyboard review/Escape, SDK unavailable, and desktop/tablet/mobile layouts.
