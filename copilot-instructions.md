# Copilot Instructions (Frontend)

## Project context

- App: Next.js frontend.
- Source root: src/ (pages, components, services, styles).

## Dev workflow

- Create .env.local from .env.local.example.
- Use nvm to select Node.
- Install deps: yarn install.
- Dev server: yarn dev.
- Prod build/start: yarn build && yarn start.

## Code guidance

- Prefer small, reusable components under src/components/.
- Keep API calls in src/services/api/.
- Respect Chakra UI theme usage in src/config/chakraTheme.js.
- Keep pages thin; push logic into hooks or services.
