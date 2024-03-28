import { spawn } from "node:child_process"

const args = Bun.argv
const command = args[2]
switch (command) {
  case "web-with-grafbase":
    await runWebWithGrafbase()
    break
  default:
    console.log("Unknown command")
    break
}

// function runCommandWithPrefix(command: string, args: string[], cwd: string, prefix: string) {
// 	const proc = spawn(command, args, { cwd })
// 	proc.stdout.on("data", (data) => {
// 		console.log(`${prefix}\n${data.toString()}`)
// 	})
// 	proc.stderr.on("data", (data) => {
// 		console.error(`${prefix}\n${data.toString()}`)
// 	})
// 	proc.on("close", (code) => {
// 		console.log(`${prefix} process exited with code ${code}`)
// 	})
// }
// TODO: run web and grafbase together (separated by markers)
// Grafbase - in colored output, then grafbase logs
// Web - in colored output, then web logs
async function runWebWithGrafbase() {
  // const grafbasePromise = $`cd api && grafbase dev > /dev/stdout`
  // const webPromise = $`cd website && bun dev`
  // // This will wait for both promises to resolve or any to reject.
  // // Note: In practice, these commands run indefinitely for development servers.
  // const [grafbaseRes, webRes] = await Promise.all([grafbasePromise, webPromise])
  // console.log(grafbaseRes, webRes)
  // Run grafbase dev with prefix
  // runCommandWithPrefix("grafbase", ["dev"], "./api", "-- Grafbase")
  // Run bun dev with prefix
  // runCommandWithPrefix("bun", ["dev"], "./website", "-- Website")
}

// TODO: todos for setupEnvFiles
// TODO: create .env file with my current content for local dev! for easy DX win
// TODO: update readme telling users they should have the .env file already
// if they ran `dev-setup`
// TODO: do same for website/.env
// and grafbase/edgedb/.env
// update readme so its very good
// as part of setup
// make it accept an argument for `seed-db`
// parse `seed/..` and fill local edgedb with content!
// load limited connections from .json (part of seed)
// + topics so it works and connections work too
// as part of setup add topics etc.
// ask to create a member/admin user automatically (default yes)
// if yes, ask for email to use
// if no provided use `user@email.com` as member with admin ability
// parse args!
// everything as part of seed repo
// make setup fully interactive!
// check if `edgedb` is installed and in path
// if not, find OS, then provide user with installing
// edgedb for them, run curl for them? or some other way
// maybe in future have `setup -with-nix` or provide
// flake with flox or how grafbase repo has it

// TODO: no longer needed with new GQL approach, remove
// TODO: perhaps there is need for new command to do something with schema?
// async function updateMobiusSchema() {
//   const schema = (
//     await $`npx grafbase@latest introspect http://127.0.0.1:4000/graphql`
//   ).trim()
//   const formattedSchema = `export const grafbaseTypeDefs = \`
// ${schema}
// \``
//   const currentFilePath = import.meta.path
//   const mobiusFilePath = `${currentFilePath.replace(
//     "cmd.ts",
//     "shared/lib/mobius.ts"
//   )}`
//   Bun.write(mobiusFilePath, formattedSchema)
// }

// TODO: can replace `generate_graphql_client` in cmd.ts with bun:
// similar to below, it fails to work with bun..
// async function generate_graphql_client() {
// 	const schema = await $`grafbase introspect --dev`
// 	Bun.write("shared/graphql_schema.gql", schema.stdout)
// 	const client = await $`graphstate/graphstate`
// 	Bun.write("shared/graphql_queries.js", graphql_client_header + client.stdout)
// }
