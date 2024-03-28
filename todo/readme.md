# [Learn Anything Todo](https://todo.learn-anything.xyz) [![Discord](https://img.shields.io/badge/Discord-100000?style=flat&logo=discord&logoColor=white&labelColor=black&color=black)](https://discord.com/invite/bxtD8x6aNF)

> Fast fully keyboard driven todo app with GitHub integration and AI features

<!-- Existing + future features are listed on [landing page](https://todo.learn-anything.xyz). -->

It's an extension to [Learn Anything](https://github.com/learn-anything/learn-anything.xyz). The goal is to make the best task manager. It uses the same database that LA is using.

High chance this code will be part of the LA app itself. This repo is used exploration mostly. The goal is to make LA be both a great note taking app, todo app and social network all in one app without sacraficing UX. If that is impossible to do and 2 apps are needed, LA will release this app too.

Todo app might be built in both SwiftUI and NativeScript just to have deeper understanding of the tech.

It will be a design challenge to make a rich task manager with GitHub integration part of [LA](https://github.com/learn-anything/learn-anything.xyz) itself but it will most likele by done to avoid having 2 separate apps.

###### Contents

- [File structure](#file-structure) - make sense of how code is laid out in the repo
- [Setup](#setup) - get started with development
- [Run server](#run-server)
- [Run web](#run-web)
- [Mobile apps](#mobile-apps)
- [Contribute](#contribute) - contribute to project effectively
- [Docs](#docs)

Ask questions on [Discord](https://discord.com/invite/bxtD8x6aNF) if interested in developing the project or you get issues with setup.

Everything below needs to be updated.

## File structure

Tech stack is described in [docs/tech-stack.md](docs/tech-stack.md).

- [grafbase](grafbase) - [Grafbase](https://grafbase.com/) provides GraphQL API layer to talk with DB
  - [schema.graphql](grafbase/schema.graphql) - GraphQL schema with models + resolvers defined
  - [resolvers](grafbase/resolvers) - custom resolvers (functions) to run custom logic exposed via GraphQL
- [src](src) - code for website built with [Solid](https://www.solidjs.com/) (on top of [Solid Start](https://github.com/solidjs/solid-start) starter)
  - [GlobalContext](src/GlobalContext)
    - [store.tsx](src/GlobalContext/store.tsx) - global state (store's signals defined then exposed via context)
    - [todos.ts](src/GlobalContext/todos.ts) - Defines `todosState` which exposes a store of todos. When first run, loads todos signal with data from grafbase, can then [modify the store via exposed methods and it sends mutations to grafbase in background for persistance](https://twitter.com/nikitavoloboev/status/1651358480526106624). There are more stores, each store is synced with Grafbase where needed. The goal is to keep state management local. Polling to be added later.
  - [components](src/components) - solid components
  - [graphql](src/graphql) - GraphQL utils
  - [lib](src/lib) - generic utils
  - [pages](src/pages) - components for pages inside the app
  - [routes](src/routes) - routes defined using file system
- [src-tauri](src-tauri) - [Tauri](https://tauri.app) rust code that makes the desktop app, in future will use SQLite (or something else) to setup local caching in the app. Maybe with some CRDTs mixed in.

## Setup

Everything is driven using [pnpm](https://pnpm.io/installation) commands as part of monorepo setup using [pnpm workspaces](https://pnpm.io/workspaces).

First run:

```
pnpm i
```

> TODO: `pnpm dev-setup` should create .env variables with default env

Before running the app, you need to setup up some environment variables.

### Setup env variables

Create new file `.env` at root of project with this content:

```
VITE_HANKO_API=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
VITE_GRAFBASE_API_URL=http://127.0.0.1:4000/graphql
VITE_TINYBIRD_API_KEY=
```

Above Hanko API uses LA's staging auth setup. You can create your own new project at [hanko.io](https://www.hanko.io) and fill it with own API value. Set App URL to http://localhost:3000.

Create new file at `grafbase/.env` with this content:

```
GRAFBASE_API_URL=http://127.0.0.1:4000/graphql
HANKO_API_ENDPOINT=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io/.well-known/jwks.json
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
OPENAI_API_KEY=
TINYBIRD_API_KEY=
```

[Upstash](https://upstash.com/) Redis URL/Token can be gotten by creating new project in [Upstash Console](https://console.upstash.com).

Can use your own OpenAI key. Get it from [here](https://openai.com/blog/openai-api).

[Tinybird](https://www.tinybird.co/) is used for analytics. Can get the key for it in dashboard.

## Run server

```
npx grafbase@latest dev
```

Open http://localhost:4000 for GraphQL playground. Read [Grafbase getting started](https://grafbase.com/docs/quickstart/get-started) to get familiar.

## Run web

```
pnpm dev
```

Then go to http://localhost:3000/, it renders route defined at [src/routes/index.tsx](src/routes/index.tsx).

If signed in (there is valid token stored in cookie), it shows the app, otherwise the landing page.

## Mobile app

Check [mobile](mobile)

## Contribute

The tasks to do are outlined in [GitHub issues](../../issues) and in [todo.md](todo.md) (sorted by priority).

If issue/idea you have is not there, [open new issue](../../issues/new/choose) or [start discussion](../../discussions).

Any PR with code/doc improvements is welcome. ✨

Join [Discord](https://discord.gg/f8YHjyrX3h) for more indepth discussions.

## Docs

All docs can be seen in [docs](docs).
