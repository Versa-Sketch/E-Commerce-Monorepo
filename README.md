# E-Commerce Monorepo

pnpm workspaces monorepo containing the customer app, merchant app, and admin panel.

## Layout

```
apps/
  customer/   Expo/React Native customer-facing app
  merchant/   Expo/React Native merchant ("ShopKeeper") app
  admin/      Vite + React admin web panel
packages/      Shared packages (currently empty, see packages/README.md)
```

## Getting started

```bash
pnpm install
```

## Development

```bash
pnpm dev:customer   # expo start (customer app)
pnpm dev:merchant   # expo start (merchant app)
pnpm dev:admin      # vite dev server (admin panel)
```
