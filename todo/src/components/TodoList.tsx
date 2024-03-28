import { Presence } from "@motionone/solid"
import { createEventListener } from "@solid-primitives/event-listener"
import { createShortcut } from "@solid-primitives/keyboard"
import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  batch,
  createEffect,
  createResource,
} from "solid-js"
import { isDev } from "solid-js/web"
import { PageType, TodoListMode, useTodoList } from "~/GlobalContext/todo-list"
import { Priority } from "~/GlobalContext/todos"
import NewSubtask from "~/components/NewSubtask"
import NewTodo from "~/components/NewTodo"
import Todo from "~/components/Todo"
import TodoEdit from "~/components/TodoEdit"
import TopBar from "~/components/TopBar"
import { SuggestedTasksDocument } from "~/graphql/schema"
import { wrapIndex } from "~/lib/lib"
import { createTodosForDev } from "~/lib/local"
import { createShortcuts } from "~/lib/primitives"
import ActionBar from "./ActionBar"
import SuggestedTodos from "./SuggestedTodos"
import { useUser } from "~/GlobalContext/user"

export default function TodoList() {
  const todoList = useTodoList()
  const user = useUser()

  function setPrority(i: Priority) {
    const focusedTodoValue = todoList.focusedTodoKey()
    if (!focusedTodoValue) return

    // update subtask
    // TODO: does not work
    if ("parent" in todoList.flatTasks()[todoList.focusedTodoIndex()!]) {
      // global.todosState.updateSubtask(
      //   focusedTodoValue,
      //   (s: ClientSubtask) => ({
      //     ...s,
      //     priority: i,
      //   })
      // )
    } else {
      // update task
      todoList.todosState.updateTodo(focusedTodoValue, (todo) => ({
        ...todo,
        priority: i,
      }))
    }
  }

  createEffect(() => {
    createShortcuts(
      todoList.inMode(TodoListMode.Default) && !todoList.newTag()
        ? {
            // Edit focused todo
            Enter() {
              if (todoList.focusedTodo()) {
                todoList.setMode(TodoListMode.Edit, {})
              }
            },
            // Edit focused todo note
            T() {
              if (todoList.focusedTodo()) {
                todoList.setMode(TodoListMode.Edit, {
                  initEditingNote: true,
                })
              }
            },
            // Focus todo up
            ArrowUp() {
              todoList.setFocusedTodoIndex((p) => {
                return wrapIndex(p - 1, todoList.flatTasks().length)
              })
            },
            // Focus todo up
            K() {
              todoList.setFocusedTodoIndex((p) => {
                return wrapIndex(p - 1, todoList.flatTasks().length)
              })
            },
            // Focus todo down
            ArrowDown() {
              todoList.setFocusedTodoIndex((p) => {
                return wrapIndex(p + 1, todoList.flatTasks().length)
              })
            },
            // Focus todo down
            J() {
              todoList.setFocusedTodoIndex((p) => {
                return wrapIndex(p + 1, todoList.flatTasks().length)
              })
            },
            // Activate filter search
            // TODO:
            // ["Meta"]() {
            //   console.log("trigger")
            // },
            // Complete task
            [" "]() {
              const focused = todoList.focusedTodo()
              if (!focused) return
              if (focused.type === "subtask") {
                // TODO: complete
                // todoList.todosState.updateSubtask(focused.key, (todo) => ({
                //   done: !todo.done,
                // }))
                return
              }
              todoList.todosState.updateTodo(focused.key, (todo) => ({
                done: !todo.done,
              }))
            },
            // Remove focused todo
            Backspace() {
              const focused = todoList.focusedTodo(),
                index = todoList.focusedTodoIndex()
              if (!focused) return
              batch(() => {
                if (focused.type === "subtask") {
                  todoList.todosState.removeSubtask(
                    focused.parent.key,
                    focused.key
                  )
                } else {
                  todoList.todosState.removeTodo(focused.key)
                }
                // keep focus on the same index
                todoList.setFocusedTodoIndex(
                  Math.min(todoList.flatTasks().length - 1, index)
                )
              })
            },
            0() {
              setPrority(0)
            },
            1() {
              setPrority(1)
            },
            2() {
              setPrority(2)
            },
            3() {
              setPrority(3)
            },
            4() {
              const focused = todoList.focusedTodoKey()
              if (focused) {
                todoList.todosState.updateTodo(focused, (todo) => ({
                  starred: !todo.starred,
                }))
              }
            },
            // Add a new todo
            N() {
              if (user.user.showOnboarding) {
                todoList.setOnBoarding(2)
              }
              if (
                new Date(user.user.paidSubscriptionValidUntilDate) < new Date()
              ) {
                if (todoList.todos.length > 20) {
                  todoList.setMode(TodoListMode.Settings, {
                    settingsState: "Account",
                  })
                  return
                }
              }
              todoList.addNewTask()
            },
            // Go to settings help
            "/"() {
              todoList.setMode(TodoListMode.Settings, { settingsState: "Help" })
            },
            // Create new subtask
            L() {
              todoList.addNewSubtask()
            },
            // local search
            F() {
              todoList.startLocalSearch()
            },
            // Suggestions
            A() {
              const focused = todoList.focusedTodo()

              if (user.user.showOnboarding) {
                todoList.setOnBoarding(4)
              }

              if (focused && focused.type === "todo") {
                todoList.setMode(TodoListMode.Suggest)
              }
            },
          }
        : {
            Escape() {
              if (user.user.showOnboarding) {
                return
              }
              if (todoList.searchTags()) {
                todoList.setSearchTags(false)
                return
              }
              todoList.setMode(TodoListMode.Default)
            },
          }
    )
  })

  if (isDev) {
    createShortcut(
      ["Control", "I"],
      () => {
        // seed the database with todos/subtasks
        // only works in dev mode
        createTodosForDev(todoList.request)
      },
      { preventDefault: false }
    )
  }

  const [suggestions] = createResource(
    () => {
      if (!todoList.inMode(TodoListMode.Suggest)) return
      const focused = todoList.focusedTodo()
      return focused && focused.type === "todo" && focused
    },
    async (todo) => {
      const res = await todoList.request(SuggestedTasksDocument, {
        task: todo.title,
        userId: user.user.id!,
      })
      if (res.user?.suggestions.freeAiTaskUsed) {
        user.decrementAiTask()
      }
      if (res.user?.suggestions.needPayment) {
        todoList.setMode(TodoListMode.Settings, { settingsState: "Upgrade" })
        return
      }
      // @ts-ignore
      const suggestions = res.user.suggestions.suggestedTasks.tasks
      return suggestions && suggestions.length ? suggestions : undefined
    }
  )

  return (
    <>
      <style>
        {`
        #TagsBar {
          display: none
        }
        @media (min-width: 1200px){
          #TagsBar {
            display: inline
          }

        }
        #suggested {
          border-left: solid 3px rgba(200,200,200, 0.5);
        }
        @media (prefers-color-scheme: dark) {
         #suggested {border-left: solid 3px rgba(43, 43, 43, 0.5);
         }
        }
      `}
      </style>
      <div
        id="page"
        class="flex w-full h-full grow overflow-auto justify-between"
      >
        <div
          class="flex flex-col justify-between w-full  drop"
          ref={(el) => {
            createEventListener(
              el,
              "click",
              (e) => {
                if (e.target === el) {
                  todoList.setFocusedTodoKey(null)
                }
              },
              { passive: true }
            )
          }}
        >
          <TopBar
            title={
              isDev
                ? `${PageType[todoList.activePage()]} mode:${
                    TodoListMode[todoList.mode()]
                  } (dev)`
                : PageType[todoList.activePage()]
            }
          />

          <div class="grow flex  w-full overflow-hidden">
            {/* <TagSidebar /> */}
            <div class="flex flex-col relative w-full">
              <div
                class="grow bg-gray-100 dark:bg-neutral-900 overflow-scroll"
                ref={(el) => {
                  createEventListener(
                    el,
                    "click",

                    (e) => {
                      if (e.target === el) {
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
                      }
                    },
                    { passive: true }
                  )
                }}
              >
                <div
                  class="p-2 overflow-scroll w-full"
                  style={{ "padding-bottom": "200px" }}
                  ref={(el) => {
                    createEventListener(
                      el,
                      "click",

                      (e) => {
                        if (e.target === el) {
                          if (todoList.mode() === TodoListMode.NewTodo) {
                            todoList.setMode(TodoListMode.Default)
                            return
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
                        }
                      },
                      { passive: true }
                    )
                  }}
                >
                  <For each={todoList.flatTasks()}>
                    {(todo) => {
                      if (todo.type === "new-subtask") {
                        return <NewSubtask subtask={todo} />
                      }
                      return (
                        <Switch>
                          <Match
                            when={
                              todoList.inMode(TodoListMode.Edit) &&
                              todoList.isTodoFocused(todo.key)
                            }
                          >
                            <TodoEdit
                              todo={todo}
                              initialEditNote={
                                todoList.getModeData(TodoListMode.Edit)!
                                  .initEditingNote
                              }
                            />
                          </Match>
                          <Match when={true}>
                            <Todo
                              todo={todo}
                              subtask={todo.type === "subtask"}
                              loadingSuggestions={
                                suggestions.loading &&
                                todoList.isTodoFocused(todo.key)
                              }
                            />
                          </Match>
                        </Switch>
                      )
                    }}
                  </For>

                  <Show when={todoList.inMode(TodoListMode.NewTodo)}>
                    <NewTodo />
                  </Show>
                </div>
              </div>
              <ActionBar />
            </div>
            <Presence>
              <Suspense>
                <Show
                  when={
                    todoList.inMode(TodoListMode.Suggest) &&
                    suggestions.state === "ready" &&
                    suggestions()
                  }
                >
                  {(suggestions) => (
                    <div
                      id="suggested"
                      class="h-full"
                      style={{
                        width: "40%",
                      }}
                    >
                      <SuggestedTodos suggestions={suggestions()} />
                    </div>
                  )}
                </Show>
              </Suspense>
            </Presence>
          </div>
        </div>
      </div>
    </>
  )
}
