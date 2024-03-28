Files that were used in some way in LA but currently have no use.

The folder/file structure is exactly as it was in LA before. So files at root here were at root of LA repo too.

## Old readme (can move what is useful later to LA)

#### Contents

- [Setup EdgeDB](#setup-edgedb)
  - [Generate edgedb-js bindings](#generate-edgedb-js-bindings)
  - [Seed EdgeDB with content](#seed-edgedb-with-content)

## Setup

[Bun](https://bun.sh) is used to run things as part of monorepo. However [pnpm](https://pnpm.io) & [pnpm workspaces](https://pnpm.io/workspaces) are used to manage dependencies ([bun gave issues with installing deps and breaking builds](docs/bun.md))

### Setup EdgeDB

> **Warning**
> Instructions might break, if you get an unexpected error or anything, reach out on [Discord](https://discord.com/invite/bxtD8x6aNF), we will resolve it

Install EdgeDB by running `curl ..` command from [EdgeDB](https://www.edgedb.com) website. It is used as main server database. Should be below command for Linux/Mac:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh
```

Then run:

```
bun db:init
```

Follow instructions, name EdgeDB instance `learn-anything`.

Then run `bun cmd.ts seedEdgeDb`.

Then do:

```
cd grafbase/edgedb
edgedb database wipe -I learn-anything
edgedb restore seed.db
```

Now you can run `bun db:ui`. This will open EdgeDB graphical interface where you can run queries or explore the schema. The EdgeDB database you got, has all the content of existing Learn Anything, you can explore the data inside and run various queries.

If you ran `bun setup`, you should have already a `grafbase/.env` file with this content:

```
LOCAL=true
EDGEDB_DSN=
PUBLIC_HANKO_API_URL=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
INTERNAL_SECRET=secret
```

Fill `EDGEDB_DSN` value with value you get from running `bun db:get-dsn`. It's needed to connect to EdgeDB locally.

#### Generate edgedb-js bindings

```
bun db:migrate
```

This gives you type safe access to EdgeDB and lets you use the query builder nicely.

#### Seed EdgeDB with content

> **Warning**
> Below command is incomplete and needs testing, please reach out on [Discord](https://discord.com/invite/bxtD8x6aNF) and we do it together with you

```
bun db:seed
```

Above command is incomplete but will be soon. It should take the files you got in [data folder](https://github.com/learn-anything/data) (after running `bun dev-setup`) and fill EdgeDB db with content necessary to develop LA very fast.

Reach out on [Discord](https://discord.com/invite/bxtD8x6aNF) to get a semi working version of the command. ♥️

## Run GraphQL server (Grafbase)

Assumes you followed instructions for [Setup EdgeDB](setup-edgedb) and have `grafbase/.env` file with:

```
LOCAL=true
EDGEDB_DSN=edgedb://
PUBLIC_HANKO_API_URL=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
INTERNAL_SECRET=secret
```

Then run:

```
npx grafbase@latest dev
```

This starts Grafbase locally and give you GraphQL access.

Download [Pathfinder](https://pathfinder.dev/) app and open http://localhost:4000 inside. Can also open http://localhost:4000 in browser but Pathfinder is nice app. In there, you can run various queries calling resolvers defined in [grafbase/resolvers](grafbase/resolvers). Grafbase picks up any changes you make to the files in the folder.

[Grafbase config](https://grafbase.com/docs/config) is set in [grafbase/grafbase.config.ts](grafbase/grafbase.config.ts). You specify what [resolvers](https://grafbase.com/docs/edge-gateway/resolvers) are defined, what inputs/outputs they have. Then you create or edit files in [grafbase/resolvers](grafbase/resolvers). Read existing resolvers to make sense of how it works.

When you make changes to grafbase.config.ts as we are using [Mobius](https://github.com/SaltyAom/mobius) as our GraphQL client and it is fully typed. You can run `bun mobius-update`, it will update the schema in [shared/lib/mobius.ts](shared/lib/mobius.ts) with new schema.

## Run website (Solid)

> **Warning**
> If you reach any problems with setup, reach out on [Discord](https://discord.com/invite/bxtD8x6aNF)

If you ran `bun setup` before, you should have `website/.env` file with this content:

```
VITE_HANKO_API=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
VITE_GRAFBASE_API_URL=http://127.0.0.1:4000/graphql
VITE_GRAFBASE_INTERNAL_SECRET=secret
```

[Hanko](https://www.hanko.io/) is used as auth provider. You can swap Hanko API variable content with one from a project you create yourself. Above is project we made for local dev you can use.

Run:

```
bun web
```

Open http://localhost:3000

> **Warning**
> You need to make sure you have data in the database to actually develop. So do section `Seed EdgeDB with content`. Reach out on [Discord](https://discord.com/invite/bxtD8x6aNF) for help as things are unstable still.

## Run desktop app (Tauri/Rust)

> **Warning**
> WIP, massive effort is put here after website is released and is working without issues

Goal of desktop app is to be essentially a clone of [Obsidian](https://obsidian.md/)/[Reflect](https://reflect.app) (working with local markdown files). And with ability to publish the markdown content to LA. All private data and files will be end to end encrypted and synced with [mobile app](mobile).

It will be the best note taking experience you can get. All open source.

```
bun app
```

> **Warning**
> WIP, Above command will give you issues most likely, reach out on [Discord](https://discord.com/invite/bxtD8x6aNF) and we will help resolve them

<!-- TODO: move this to docs/ -->
<!-- TODO: together with other commented out readme parts, clean readme -->
<!-- ### Useful DevTools panel

In the app you get after running `bun app`, you will see DevTools panel in bottom right corner. It contains a list of useful actions you can run to aid you.

One of the actions is `Seed TinyBase`. This will seed your local TinyBase store/sqlite with [one of the wikis](https://github.com/learn-anything/data/tree/main/wiki/nikita) in seed folder.

Read [app/packages/preload/src/index.ts](app/packages/preload/src/index.ts) file for details. `syncWikiFromSeed` is the function. -->

<!-- ## Run mobile app

> WIP -->

<!-- ## Test

> below tests are in TS, only relevant now to help migration to rust

```
bun test
```

Will run tests found in [test](test).

[test/wiki.test.ts](test/wiki.test.ts) file tests markdown file parsing.

Running code via tests is very effective. You can open terminal on your right and edit code on the left and on each `.ts` file save it will rerun the test and check if behavior you are testing is correct. Reading through the test suite is great way to understand the backend part of the app.

You can point the tests at your own wiki/notes folder too. Put the folder with files into seed/test folder you get from running `bun dev-setup` -->

<!-- ## Run mobile app (NativeScript/Solid)

Read instructions in [mobile](mobile) -->

## Contribute

<!-- TODO: add live streams -->
<!-- We want this project to have by far the best DX of any open source project on GitHub. There will be live streams of developing the code, various educational videos and a lot more in coming time. -->

## Commands

### bun app:build

> cd app && bun tauri build --debug

Create debug build with Tauri.

### bun db:load-connections

> cd grafbase/edgedb && tput reset && bun cli/loadConnectionsIntoGrafbase.ts

Load topic connections into Grafbase cache.

### bun db:watch

> cd grafbase/edgedb && edgedb watch

Watch for changes in EdgeDB schema and apply them making migrations.

### bun rust-crate-wiki-test

> cd app/src-tauri/crates/wiki/ && cargo watch -q -- sh -c \"tput reset && cargo test -q --lib\"

Run tests for Rust wiki crate in watch mode.

### bun db:migrate

> cd grafbase/edgedb && edgedb migration create && edgedb migrate && bunx @edgedb/generate edgeql-js --target ts && bunx @edgedb/generate queries --target ts

Create new migration, apply migrations and generate EdgeDB-JS types

### bun db:queries-generate

> cd grafbase/edgedb && bunx @edgedb/generate edgeql-js --target ts && bunx @edgedb/generate queries --target ts

Generate EdgeDB-JS types from custom queries.

### bun db:get-dsn

> cd grafbase/edgedb && edgedb instance credentials --insecure-dsn

Get insecure DSN for EdgeDB instance.

### bun db:dump

> cd private && edgedb dump prod.db

Dump production database.

### bun ts

> bun --watch cmd.ts run

Execute `run()` function in [cmd.ts](cmd.ts) for quick experiments

### bun lint:code

> eslint --ignore-path .gitignore --max-warnings 0 --ext .ts,.tsx,.js,.jsx .

Lint code with ESLint.

### bun lint:types

> tsc --noEmit

Check for TypeScript type errors.

### bun lint

> bun lint:code && bun lint:types

Run both code and type linting.
