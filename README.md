# Tezos WalletConnect issue reproduction repo

## Issue
Issue is after connecting a tezos wallet via WalletConnect, we get a "Session settlement failed" error from WalletConnect when sending a transaction to sign.

Note: I tested this by connecting a Fireblocks wallet.

## Steps to reproduce

1. Install deps and run local dev server
```bash
bun i
bun dev
```

2. Connect your wallet via WalletConnect by scanning the QR code
3. Click the stake button to initiate a delegate transaction