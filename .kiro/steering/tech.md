# Technology Stack

## Build System

- **Package Manager**: pnpm (required)
- **Monorepo**: pnpm workspaces
- **Build Tool**: Vite (all packages)
- **Node Version**: >=16.0.0

## Tech Stack by Package

### douyin-portal (Vue)

- **Framework**: Vue 3 + TypeScript
- **State**: Pinia with persistence plugin
- **Router**: Vue Router 4
- **UI**: Element Plus (auto-imported)
- **Video**: xgplayer (with HLS/FLV support)
- **HTTP**: Axios
- **Utilities**: @vueuse/core, qrcode, uuid
- **Styling**: SCSS with global mixins/variables
- **Dev Port**: 3000

### douyin-creator (React)

- **Framework**: React 19 + TypeScript
- **State**: Zustand
- **Router**: React Router 7
- **UI**: Semi UI (ByteDance design system) with custom theme `@semi-bot/semi-theme-doucreator`
- **Charts**: @antv/g2, BizCharts
- **Image**: fabric.js, react-image-crop
- **HTTP**: Axios
- **Utilities**: ahooks, lodash, classnames
- **Styling**: SCSS modules
- **Dev Port**: 3001

### douyin-admin (React)

- **Framework**: React 18 + TypeScript
- **State**: Redux
- **Router**: React Router 5
- **UI**: Arco Design (ByteDance enterprise design) with theme `@arco-themes/react-arco-pro`
- **Charts**: BizCharts
- **HTTP**: Axios
- **Utilities**: lodash, dayjs, classnames
- **Styling**: Less
- **Dev Port**: 30001

### api-docs (React)

- **Framework**: React 19 + TypeScript
- **Router**: React Router 7
- **UI**: Radix UI primitives + shadcn/ui patterns
- **Styling**: Tailwind CSS
- **Icons**: lucide-react

## Common Patterns

### Auto-imports (Portal)

Vue 3 Composition API, Vue Router, Pinia, and @vueuse/core are auto-imported via `unplugin-auto-import`. No explicit imports needed for `ref`, `computed`, `useRouter`, etc.

### Path Aliases

All packages use `@` alias pointing to `src/` directory.

### Environment Files

- `.env.dev` - Development
- `.env.staging` - Staging (portal default)
- `.env.prod` - Production

Access via `import.meta.env.VITE_*` variables.

### Code Quality

- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Styling**: Stylelint (for Less/SCSS)
- Pre-commit hooks configured with pretty-quick

## Common Commands

### Development

```bash
# From root - start individual apps
pnpm portal      # Start user portal (port 3000)
pnpm creator     # Start creator platform (port 3001)
pnpm admin       # Start admin dashboard (port 30001)
pnpm api-docs    # Start API docs

# From package directory
pnpm dev
```

### Building

```bash
# From root
pnpm build:portal      # Production build
pnpm build:portal-dev  # Development build
pnpm build:creator
pnpm build:admin
pnpm build:api-docs

# From package directory
pnpm build
```

### Preview

```bash
pnpm preview:portal
pnpm preview:creator
pnpm preview:admin
pnpm preview:api-docs
```

### Code Quality

```bash
# From package directory
pnpm eslint      # Lint and fix JS/TS
pnpm stylelint   # Lint and fix styles
pnpm format      # Format with Prettier (portal only)
```

### Installation

```bash
# Install all dependencies
pnpm install

# Install for specific package
pnpm --filter douyin-portal install
pnpm --filter douyin-creator install
pnpm --filter douyin-admin install
```

## Build Optimizations

### Portal

- Manual chunks: vue-vendor, element-plus, utils-vendor, xgplayer (split by player modules)
- Assets organized by type: js/, css/, images/, fonts/
- Console/debugger removed in production
- CSS code splitting enabled

### Creator & Admin

- Vendor code split into separate chunk
- Route-based code splitting (home, content modules)
- Console/debugger removed in production

## Proxy Configuration

All apps proxy `/api` requests to backend URL defined in `VITE_BASE_URL` env variable. Portal also proxies `/douyin` to `https://www.douyin.com` for API integration.
