import { GraphQLClient } from "graphql-request"
import { Show } from "solid-js"
import { useNavigate } from "solid-start"
import {
  PageType,
  TodoListMode,
  TodoListProvider,
  createTodoListState,
} from "~/GlobalContext/todo-list"
import { UserProvider, createUserState } from "~/GlobalContext/user"
import CollapsedSidebar from "~/components/CollapsedSidebar"
import Icon from "~/components/Icon"
import Modal from "~/components/Modal"
import Settings from "~/components/Settings"
import Sidebar from "~/components/Sidebar"
import TodoList from "~/components/TodoList"
import { createShortcuts } from "~/lib/primitives"
import { logError } from "~/lib/tinybird"

export type GrafbaseRequest = GraphQLClient["request"]

export default function App(props: { hankoCookie: string }) {
  const navigate = useNavigate()

  const grafbase = new GraphQLClient(import.meta.env.VITE_GRAFBASE_API_URL, {
    headers: { authorization: `Bearer ${props.hankoCookie}` },
  })

  const request: GrafbaseRequest = async (...args) => {
    try {
      return await grafbase.request(...(args as [any]))
    } catch (error) {
      // TODO: gets into infinite loops sometimes
      if (error.response.error.includes("Unauthorized")) {
        navigate("/auth")
      }
      logError({
        error: "grafbase client error",
        metadata: `error: ${JSON.stringify(error)}`,
      })
    }
  }

  const todoList = createTodoListState({ request })
  const userState = createUserState({ request })

  createShortcuts({
    "Control+1"() {
      todoList.updateActivePage(PageType.All)
    },
    "Control+2"() {
      todoList.updateActivePage(PageType.Today)
    },
    "Control+3"() {
      todoList.updateActivePage(PageType.Starred)
    },

    "Control+4"() {
      todoList.updateActivePage(PageType.Done)
    },
  })

  return (
    <>
      <style>
        {`
        #blur {
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          z-index: 9;
        }
    `}
      </style>
      <div class=" bg-white dark:bg-black">
        <UserProvider value={userState}>
          <TodoListProvider value={todoList}>
            <div class="flex flex-col h-screen">
              <div class="flex grow h-full overflow-hidden">
                <Show
                  when={userState.user.collapsedSidebar}
                  // when={true}
                  fallback={<Sidebar />}
                >
                  <CollapsedSidebar />
                </Show>
                <TodoList />
              </div>
            </div>
            <Show when={todoList.inMode(TodoListMode.Settings)}>
              <Modal
                title="Settings"
                onClose={() => todoList.setMode(TodoListMode.Default)}
                children={<Settings />}
              />
            </Show>
            <Show
              when={
                userState.user.showOnboarding &&
                (todoList.onBoarding() === 1 || 2 || 3 || 4 || 5)
              }
            >
              <div id="blur" class="h-screen w-screen absolute top-0 left-0">
                <div
                  onClick={() => {
                    userState.setShowOnboarding(false)
                  }}
                  class="absolute top-4 right-4 hover:opacity-60 border-gray-200 rounded-full border-4 p-1"
                >
                  <Icon name="Cross"></Icon>
                </div>
              </div>
            </Show>
          </TodoListProvider>
        </UserProvider>
      </div>
    </>
  )
}
