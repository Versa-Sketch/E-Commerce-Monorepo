# E-Commerce Monorepo

pnpm workspaces monorepo containing the customer app, merchant app, and delivery partner app.

## Layout

```
apps/
  customer/   Expo/React Native customer-facing app
  merchant/   Expo/React Native merchant ("ShopKeeper") app
  delivery/   Expo/React Native delivery partner app
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
pnpm dev:delivery   # expo start (delivery partner app)
```
