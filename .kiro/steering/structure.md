# Project Structure

## Monorepo Layout

```
douyin/
├── packages/              # All sub-applications
│   ├── douyin-portal/    # Vue 3 user portal
│   ├── douyin-creator/   # React creator platform
│   ├── douyin-admin/     # React admin dashboard
│   └── api-docs/         # React API documentation
├── docs/                 # Documentation and images
├── pnpm-workspace.yaml   # Workspace configuration
└── package.json          # Root scripts
```

## Package Structure Patterns

### douyin-portal (Vue 3)

```
src/
├── api/                  # API layer
│   ├── apis.ts          # API functions
│   ├── request.ts       # Axios instance
│   ├── types.ts         # API types
│   └── urls.ts          # Endpoint URLs
├── assets/              # Static assets
│   ├── icons/           # SVG icons (auto-imported)
│   └── styles/          # Global SCSS (mixin.scss, variables.scss)
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── header/         # Header components
│   ├── video-player/   # Video player components
│   └── ui/             # UI primitives
├── composables/         # Vue composables
├── directives/          # Custom directives (e.g., v-lazy)
├── hooks/               # Composition hooks
├── layout/              # Layout components
├── router/              # Vue Router configuration
├── service/             # Service layer (organized by domain)
│   ├── auth/
│   ├── videos/
│   ├── request/
│   └── index.ts
├── stores/              # Pinia stores
│   ├── user.ts
│   ├── videos.ts
│   ├── comment.ts
│   └── setting.ts
├── utils/               # Utility functions
├── views/               # Page components
│   ├── discover/
│   ├── my/
│   ├── user/
│   └── video/
├── App.vue
└── main.ts
```

### douyin-creator (React)

```
src/
├── assets/              # Static assets
│   └── icon/           # SVG icons
├── components/          # Reusable components
│   ├── Chart/          # Chart components (G2/BizCharts)
│   ├── Header/
│   ├── Sider/
│   ├── Icon/           # Icon components
│   └── [Feature]/      # Feature-specific components
├── hooks/               # Custom React hooks
├── mock/                # Mock data
├── pages/               # Page components (route-based)
│   ├── home/
│   ├── content/
│   │   ├── manage/
│   │   ├── publish/
│   │   └── upload/
│   ├── data/
│   └── help/
├── store/               # Zustand stores
│   ├── index.ts
│   └── useConfigStore.ts
├── utils/               # Utility functions
├── context.tsx          # React context
├── layout.tsx           # Layout component
├── routes.tsx           # Route configuration
└── main.tsx
```

### douyin-admin (React)

```
src/
├── api/                 # API layer
├── assets/              # Static assets
├── components/          # Reusable components
│   ├── Chart/          # Chart components
│   ├── NavBar/
│   ├── Footer/
│   ├── Settings/
│   └── PermissionWrapper/
├── locale/              # i18n configuration
├── mock/                # Mock data
├── pages/               # Page components (route-based)
│   ├── dashboard/
│   │   ├── monitor/
│   │   └── workplace/
│   ├── system/
│   │   ├── manage/
│   │   ├── menu/
│   │   ├── role/
│   │   └── permission/
│   ├── monitor/
│   │   ├── login/
│   │   ├── online/
│   │   └── operation/
│   ├── login/
│   └── user/
├── store/               # Redux store
├── utils/               # Utility functions
│   ├── authentication.ts
│   ├── checkLogin.tsx
│   └── useStorage.ts
├── context.tsx
├── layout.tsx
├── routes.ts
├── settings.json        # App settings
└── main.tsx
```

### api-docs (React)

```
src/
├── components/
│   ├── ApiExplorer/     # API exploration components
│   ├── common/          # Shared components
│   ├── Layout/          # Layout components
│   └── ui/              # shadcn/ui components
├── data/                # Static data
│   ├── api-registry.ts
│   └── example-responses/
├── hooks/               # Custom hooks
├── lib/                 # Utilities
├── types/               # TypeScript types
├── utils/               # Utility functions
├── App.tsx
└── main.tsx
```

## Common Patterns

### Component Organization

- **Portal (Vue)**: Organized by feature/domain (auth, video-player, header)
- **Creator/Admin (React)**: Mix of feature-based (Chart, Icon) and layout-based (Header, Sider)
- Style files co-located with components using `style/` subdirectories or `.module.scss`/`.module.less`

### State Management

- **Portal**: Pinia stores in `stores/` (domain-based: user, videos, comment, setting)
- **Creator**: Zustand stores in `store/`
- **Admin**: Redux store in `store/`

### Routing

- **Portal**: Vue Router with views in `views/` directory
- **Creator/Admin**: React Router with pages in `pages/` directory
- Route-based code splitting used in all apps

### API Layer

- Centralized in `api/` or `service/` directory
- Axios instance with interceptors in `request.ts`
- API functions in `apis.ts`, types in `types.ts`, URLs in `urls.ts`
- Service layer organized by domain (portal uses `service/[domain]/` pattern)

### Styling

- **Portal**: SCSS with global mixins/variables auto-imported
- **Creator**: SCSS modules (`.module.scss`)
- **Admin**: Less (`.less`)
- **API Docs**: Tailwind CSS

### Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc` / `.eslintrc.cjs` - ESLint rules
- `.prettierrc` / `.prettierrc.json` - Prettier config
- `.stylelintrc` - Stylelint config
- `.env.*` - Environment variables

## Naming Conventions

- **Files**: kebab-case for most files, PascalCase for components
- **Components**: PascalCase (e.g., `VideoPlayer.tsx`, `UserInfo.vue`)
- **Utilities**: camelCase (e.g., `useStorage.ts`, `authentication.ts`)
- **Styles**: Match component name with `.module.scss` or in `style/` subdirectory
- **Types**: PascalCase interfaces/types in `types.ts` or `types/` directory
