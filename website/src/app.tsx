import { grafbaseTypeDefs } from "@la/shared/lib"
import { Router } from "@solidjs/router"
import Mobius from "graphql-mobius"
import { Suspense, createContext, useContext } from "solid-js"
import Nav from "~/components/Nav"
import "./app.css"
import "./root.css"

export function createMobius(
  options: { hankoCookie: () => string },
  onError: (error: string) => void
) {
  const { hankoCookie } = options

  const mobius = new Mobius<typeof grafbaseTypeDefs>({
    fetch: (query) =>
      fetch(import.meta.env.VITE_GRAFBASE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hankoCookie()}`
        },
        body: JSON.stringify({
          query,
          variables: {}
        })
      }).then(async (res) => {
        const respJson = await res.json()
        const errorMessage = respJson?.errors?.[0]?.message
        if (errorMessage) {
          onError(errorMessage)
        } else {
          return respJson
        }
      })
  })

  return mobius
}
export type MobiusType = ReturnType<typeof createMobius>
const MobiusCtx = createContext({} as ReturnType<typeof createMobius>)
export function useMobius() {
  return useContext(MobiusCtx)
}
const SignInCtx = createContext({} as (cookie: string) => void)
export function useSignIn() {
  return useContext(SignInCtx)
}

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Nav />
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
