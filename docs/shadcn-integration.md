# shadcn/ui integration guide (App Router)

This file documents the exact commands and minimal configuration to initialize shadcn/ui in this Next.js App Router project.

1) Install the initializer and run interactive setup

- From the repository root run:

npx shadcn@latest init

- During the interactive prompts choose:
  - "App Router" (or confirm it detects App Router)
  - TypeScript: yes
  - Tailwind CSS: yes (we already use Tailwind in this project)
  - Components directory: `components/ui` (default is fine)
  - Any optional integrations: you can skip for now (Radix primitives are optional)

2) After init: add components you need (example: button, input, dialog, dropdown)

- Example commands:

npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add dropdown

Each `add` command will create files under `components/ui` and update exports.

3) Tailwind configuration checklist (confirm these exist)

- tailwind.config.js should include the content paths for app and components, for example:

module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: { extend: {} },
  plugins: []
}

- Ensure `@tailwind base; @tailwind components; @tailwind utilities;` is present in your globals.css.

4) Post-install manual steps

- Review generated components under `components/ui` and replace any lightweight primitives we added earlier (components/ui/button.tsx and input.tsx) with shadcn equivalents when ready.
- If you use CSS variables for design tokens, map them in the global stylesheet.

5) App Router notes

- shadcn will create client components. Keep server components (layouts, pages) as server-side and import client components where needed.
- For Sidebar/Header responsive behavior, create a client wrapper (e.g., components/ResponsiveShell) to manage toggles and pass props to shadcn components.

6) Example workflow to replace a primitive

- Run `npx shadcn@latest add button` → review `components/ui/button.tsx` → update imports where needed (e.g., replace local Button primitive imports with shadcn Button) → run the app and verify styles.

7) Troubleshooting

- If Tailwind classes from shadcn components do not apply, ensure the `content` globs include the new file locations.
- If TypeScript complains about missing types, run `pnpm/ npm/ yarn install` and restart the dev server.

8) Suggested first components to add for admin UI

- button, input, dropdown, popover, dialog, accordion, navigation


If you want, I can now run the minimal code changes to wire a ResponsiveShell and adapt Header/Sidebar so the app is ready for shadcn replacements. Confirm and I'll apply the component edits now.