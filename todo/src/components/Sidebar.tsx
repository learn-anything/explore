import clsx from "clsx"
import { For, Show, createEffect, createSignal } from "solid-js"
import { PageType, TodoListMode, useTodoList } from "~/GlobalContext/todo-list"
import { todayDate } from "~/lib/lib"
import Icon from "./Icon"
import { useUser } from "~/GlobalContext/user"

export default function Sidebar() {
  const todoList = useTodoList()
  const user = useUser()

  return (
    <>
      <style>
        {`
          #sidebar {
            // position: absolute;
            // top: 0;
            // left: 0;
            // width: 100vw;
            // height: 100vh;
            display:none;
          }
          #Title {
            display: none
          }
          #tags {
            display: inline;
            transition: all 2s;
          }
          #TitleWrapper {
            display: flex;
            justify-content: space-between;
          }
          #Number {
            width: auto;
          }
          @media (min-width: 768px){
            #Title {
              display: inline;
            }
            #TitleWrapper {
              display: flex;
              flex-direction: row;
            }
            #Number {
              margin-left: auto;
            }
            #sidebar {
              display: inline
            }
          }
          #sidebar {
            border-right: solid 3px rgb(200,200,200, 0.5)
          }
          #help {
            border: solid 3px rgb(200,200,200, 0.5);
            z-index: 20
          }

          #helpOff {
            border: solid 3px rgb(200,200,200, 0.5);
            z-index: 0;
          }
          @media (prefers-color-scheme: dark) {
            #sidebar {
              border-right: solid 3px rgb(43, 43, 43, 0.5);

            }
            #help {
              border: solid 3px rgb(43, 43, 43, 0.5);
            }
            #helpOff {
              border: solid 3px rgb(43, 43, 43, 0.5);

            }
          }
        `}
      </style>
      <Show when={true}>
        <div
          class={clsx(
            "h-screen font-medium bg-gray-100 dark:bg-neutral-900 text-base",
            todoList.inTauri() && "pt-6"
          )}
          style={{
            width: "18%",
          }}
          id="sidebar"
          onClick={() => {
            if (todoList.mode() === TodoListMode.NewTodo) {
              todoList.setMode(TodoListMode.Default)
            }
            if (todoList.searchTags()) {
              todoList.setSearchTags(false)
              return
            }
            if (todoList.mode() === TodoListMode.Edit) {
              todoList.setMode(TodoListMode.Default)
              return
            }
            todoList.setFocusedTodoKey(null)
          }}
        >
          <div class="flex flex-col items-between h-full">
            <div class="flex flex-col px-2 py-2 h-full">
              <div class="flex flex-col gap-1 bg-gray-100 dark:bg-neutral-900 p-2">
                <div
                  id="TitleWrapper"
                  class={clsx(
                    "flex px-2 cursor-pointer items-center hover:bg-gray-200 transition-all rounded",
                    todoList.activePage() === PageType.All &&
                      "rounded dark:bg-neutral-800 bg-zinc-200"
                  )}
                  onClick={() => {
                    todoList.setMode(TodoListMode.Default)
                    todoList.updateActivePage(PageType.All)
                  }}
                >
                  <Icon name="Inbox" />
                  <span id="Title" class="pl-1 overflow-hidden">
                    All
                  </span>
                  <div id="Number" class="opacity-40 text-xs">
                    {todoList.todos.filter((t) => !t.done).length > 0 &&
                      todoList.todos.filter((t) => !t.done).length}
                  </div>
                </div>
                <div
                  id="TitleWrapper"
                  class={clsx(
                    "flex px-2 cursor-pointer items-center hover:bg-gray-200 transition-all rounded",
                    todoList.activePage() === PageType.Today &&
                      "rounded dark:bg-neutral-800 bg-zinc-200"
                  )}
                  onClick={() => {
                    todoList.setMode(TodoListMode.Default)
                    todoList.updateActivePage(PageType.Today)
                  }}
                >
                  <div>
                    <Icon name="Calendar" />
                  </div>

                  <span id="Title" class="pl-1 overflow-hidden ">
                    Today
                  </span>
                  <div id="Number" class="opacity-40 text-xs">
                    {/* TODO: fix this. should not run filter twice */}
                    {/* maybe make it a runnable function inside the JSX */}
                    {/* save first filter computation, then check if it's > 0 */}
                    {/* have same issue for other places in this component */}
                    {todoList.todosState.todos.filter(
                      (t) => !t.done && t.dueDate === todayDate()
                    ).length > 0 &&
                      todoList.todosState.todos.filter(
                        (t) => !t.done && t.dueDate === todayDate()
                      ).length}
                  </div>
                </div>
                <div
                  id="TitleWrapper"
                  class={clsx(
                    "flex px-2 cursor-pointer items-center hover:bg-gray-200 transition-all rounded",
                    todoList.activePage() === PageType.Starred &&
                      "rounded dark:bg-neutral-800 bg-zinc-200"
                  )}
                  onClick={() => {
                    todoList.setMode(TodoListMode.Default)
                    todoList.updateActivePage(PageType.Starred)
                  }}
                >
                  <div>
                    <Icon name="Star" width={"26px"} height={"26px"} />
                  </div>
                  <span id="Title" class="pl-1 overflow-hidden">
                    Starred
                  </span>
                  <div class="opacity-40 text-xs ml-auto">
                    {/* TODO: not good, should not run filter twice */}
                    {todoList.todos.filter((t) => {
                      if (!t.done && t.starred) {
                        return true
                      }
                    }).length > 0 &&
                      todoList.todos.filter((t) => t.starred).length}
                  </div>
                </div>
                <div
                  id=""
                  class={clsx(
                    "flex px-2 cursor-pointer items-center justify-start hover:bg-gray-200 transition-all rounded ",
                    todoList.activePage() === PageType.Done &&
                      "rounded dark:bg-neutral-800 bg-zinc-200"
                  )}
                  onClick={() => {
                    todoList.setMode(TodoListMode.Default)
                    todoList.updateActivePage(PageType.Done)
                  }}
                >
                  <Icon name="Done" />
                  <span id="Title" class="pl-1 overflow-hidden">
                    Done
                  </span>
                </div>
              </div>
              <div
                id="tags"
                class="flex flex-col  rounded-xl dark:bg-neutral-900 gap-1 p-2 grow"
              >
                <For
                  each={Array.from(
                    todoList.currentlyUsedTagsWithCount().keys()
                  )}
                >
                  {(tag) => (
                    <div
                      class={clsx(
                        "flex flex-row-reverse hover:bg-gray-200 rounded transition-all pl-2 text-md align-center px-2 justify-between items-center cursor-pointer",
                        todoList.activePage() === PageType.Filtered &&
                          todoList.selectedTagInSidebar() === tag &&
                          "bg-zinc-200 dark:bg-neutral-800 rounded"
                      )}
                      style={{ "padding-top": "2px", "padding-bottom": "2px" }}
                      onClick={() => {
                        todoList.updateActivePage(PageType.Filtered)
                        todoList.setSelectedTagInSidebar(tag)
                      }}
                    >
                      <div class="opacity-60 text-xs">
                        {todoList.currentlyUsedTagsWithCount().get(tag)}
                      </div>
                      <div class="flex items-center gap-1">
                        <div style={{ "padding-top": "1px" }}>
                          <Icon name="Tag" width="26" height="26"></Icon>
                        </div>
                        <div class="flex items-center justify-center">
                          {tag}
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="p-2">
              <button
                class="p-2 rounded-3xl hover:opacity-60 transition-all"
                id={user.user.showOnboarding ? "help" : "helpOff"}
                onClick={() => {
                  todoList.setOnBoarding(1)
                  user.setShowOnboarding(!user.user.showOnboarding)
                }}
              >
                <Icon name="Question"></Icon>
              </button>
            </div>
          </div>
        </div>
      </Show>
    </>
  )
}
