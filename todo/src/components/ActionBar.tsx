import { TodoListMode, useTodoList } from "~/GlobalContext/todo-list"
import Icon from "./Icon"
import { Show } from "solid-js"
import LocalSearch from "./LocalSearch"
import { useUser } from "~/GlobalContext/user"

export default function ActionBar() {
  const todoList = useTodoList()
  const user = useUser()

  return (
    <>
      <style>
        {`
        #ActionBar {
          border-top: solid 3px rgb(200, 200, 200, 0.5)
        }
        #box {
          border: solid 2px rgba(200, 200, 200, 0.5)
        }
        #arrow {
           border: solid 2px rgba(200, 200, 200, 0.5)
        }
        #tooltip {
          border: solid 2px rgba(200, 200, 200, 0.5)
        }
        @media (prefers-color-scheme: dark) {
          #ActionBar {
            border-top: solid 3px rgb(43, 43, 43, 0.5)
          }
          #tooltip {
            border: solid 2px rgba(43, 43, 43, 0.5)
          }
          #box {
            border: solid 2px rgba(43, 43, 43, 0.5)
          }
          #arrow {
            border: solid 2px rgba(43, 43, 43, 0.5)
          }
        }
        #Index {
          z-index: 10;
        }
        #Index:hover {

        }
        #noIndex {
          z-index: 0
        }
      `}
      </style>
      <div
        class="relative flex justify-between w-full items-center pl-5 pr-5 p-2 bg-gray-100 dark:bg-neutral-900"
        style={{
          "min-height": "50px",
        }}
        id="ActionBar"
      >
        <Show
          when={!todoList.inMode(TodoListMode.Search)}
          fallback={<LocalSearch />}
        >
          <button
            class="has-tooltip cursor-pointer focus:bg-gray-200 rounded-full p-1"
            onClick={() => todoList.startLocalSearch()}
          >
            <div
              class="tooltip shadow-lg rounded-2xl p-1 bg-gray-100 dark:bg-stone-900 -mt-8 text-gray-500 dark:text-white text-sm flex items-center px-3 gap-1 font-bold"
              style={{
                "transition-delay": "0.5s",
              }}
              id="tooltip"
            >
              <span>Search todos</span>
              <Icon name="F key" />
            </div>
            <Icon name="Search" />
          </button>

          <div
            class="has-tooltip relative pl-24 pt-2 pb-2 pr-24 rounded"
            id={
              todoList.onBoarding() === 1 && user.user.showOnboarding
                ? "Index"
                : "noIndex"
            }
          >
            <div
              class="absolute"
              style={{ top: "-444%", left: "34%", width: "200px" }}
            >
              <Show
                when={user.user.showOnboarding && todoList.onBoarding() === 1}
              >
                <div class="rounded-lg" id="box">
                  <div
                    class="bg-gray-100 flex flex-col gap-3 dark:bg-neutral-900 p-3 px-6 relative rounded-lg"
                    style={{ "z-index": "10" }}
                  >
                    <div>
                      Make a new task by pressing this button or pressing{" "}
                      <span
                        class="font-bold px-2 p-0.5 bg-white text-sm rounded-lg"
                        style={{
                          border: "solid 1px black",
                          "border-bottom": "solid 2px black",
                        }}
                      >
                        n
                      </span>{" "}
                      key
                    </div>
                    <div
                      onClick={() => {
                        todoList.setMode(TodoListMode.NewTodo)
                        todoList.setOnBoarding(2)
                      }}
                      class="w-full text-gray-200 bg-blue-500 px-4 font-bold border-blue-200 hover:opacity-60 transition-all border-2 py-1 rounded-md"
                    >
                      Continue
                    </div>
                  </div>
                  <div
                    class="absolute left-5 p-3 rounded bg-gray-100 dark:bg-neutral-900 rotate-90 "
                    id="arrow"
                    style={{
                      transform: "rotate(45deg)",
                      bottom: "-7%",
                    }}
                  ></div>
                </div>
              </Show>
            </div>
            <Show when={!user.user.showOnboarding}>
              <div
                class="tooltip shadow-lg p-1 bg-gray-100 dark:bg-stone-900 -mt-8 text-gray-500 dark:text-white text-sm flex items-center px-3 gap-1 font-bold"
                style={{
                  "border-radius": "25px",
                  "transition-delay": "0.5s",

                  width: "120px",
                }}
                id="tooltip"
              >
                <span>New Todo</span>
                <Icon name="N key" />
              </div>
            </Show>
            <button
              class="cursor-pointer focus:bg-zinc-200 rounded-full p-1"
              onClick={() => {
                if (
                  new Date(user.user.paidSubscriptionValidUntilDate) <
                  new Date()
                ) {
                  if (todoList.todos.length > 20) {
                    todoList.setMode(TodoListMode.Settings, {
                      settingsState: "Account",
                    })
                    return
                  }
                }
                todoList.setMode(TodoListMode.NewTodo)
                if (user.user.showOnboarding) {
                  todoList.setOnBoarding(2)
                }
              }}
            >
              <Icon name="Plus" />
            </button>
          </div>

          <div
            class="has-tooltip relative"
            id={todoList.onBoarding() === 5 ? "Index" : "noIndex"}
          >
            <div class="absolute " style={{ top: "-645%", left: "-1520%" }}>
              <Show
                when={user.user.showOnboarding && todoList.onBoarding() === 5}
              >
                <div class=" rounded-lg" id="box">
                  <div
                    class="bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center justify-center flex-col p-3 px-6 relative rounded-lg"
                    style={{ "z-index": "10", width: "400px" }}
                  >
                    <div>
                      That's it! Check settings for how to add tags, due dates,
                      subtasks. Also join our Discord server for more help.
                      Enjoy the app.
                    </div>
                    <div
                      onClick={() => {
                        user.setShowOnboarding(false)
                      }}
                      class="bg-blue-400 border-blue-300 border-2 rounded-lg p-0.5 hover:opacity-60 text-white flex items-center justify-center w-3/4"
                    >
                      Continue
                    </div>
                  </div>
                  <div
                    class="absolute left-5 p-3 rounded bg-gray-100 dark:bg-neutral-900 rotate-90 "
                    id="arrow"
                    style={{
                      transform: "rotate(45deg)",
                      bottom: "-9%",
                      left: "90%",
                      width: "20px",
                      height: "20px",
                    }}
                  ></div>
                </div>
              </Show>
            </div>

            <Show when={!user.user.showOnboarding}>
              <div
                class="tooltip shadow-lg p-1 bg-gray-100 dark:bg-stone-900 -mt-8 text-gray-500 dark:text-white text-sm flex items-center px-3 gap-1 font-bold top-3 right-4"
                style={{
                  "border-radius": "25px",
                  "transition-delay": "0.5s",
                }}
                id="tooltip"
              >
                <span>Settings</span>
                {/* TODO: change to cmd+, */}
                {/* TODO: add icon + button bind */}
                <Icon name="N key" />
              </div>
            </Show>
            <button
              class="cursor-pointer focus:bg-zinc-200 rounded-full p-1"
              onClick={() => {
                todoList.setMode(TodoListMode.Settings, {
                  settingsState: "Help",
                })
                if (user.user.showOnboarding) {
                  user.setShowOnboarding(false)
                  todoList.setOnBoarding(null)
                }
              }}
            >
              <Icon name="Settings" />
            </button>
          </div>
        </Show>
      </div>
    </>
  )
}
