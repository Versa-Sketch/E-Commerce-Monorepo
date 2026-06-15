# packages

Reserved for shared code extracted from `apps/customer` and `apps/merchant`, which currently
duplicate significant logic. Candidates for future shared packages:

- `theme` — colors, fonts, and spacing (currently identical `theme.ts` in both apps)
- `api-client` — axios instance with auth/token-refresh interceptors
- `constants` — storage keys, API base URL config, shared enums
- `types` — shared domain types (User, Product, Order, Address, etc.)
