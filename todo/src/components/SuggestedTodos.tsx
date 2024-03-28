import { Motion } from "@motionone/solid"
import { createShortcut } from "@solid-primitives/keyboard"
import clsx from "clsx"
import { Show, createEffect, createSignal } from "solid-js"
import {
  ClientTodo,
  TodoListMode,
  useTodoList,
} from "~/GlobalContext/todo-list"
import { useUser } from "~/GlobalContext/user"

type SuggestedTodo = {
  task: string
  note: string
}

function SuggestedTodo(props: {
  task: string
  note?: string
  isFocused: boolean
  onClick: () => void
  accepted: boolean
}) {
  return (
    <div
      class={clsx(
        "p-2 m-2 mb-2 grid-cols-5 col-span-5 min-w-0",
        props.isFocused && "bg-zinc-200 dark:bg-neutral-700 rounded-lg",
        props.accepted && "opacity-50"
      )}
      onClick={props.onClick}
    >
      <div>{props.task.split(":")[0]}</div>
      <div class="opacity-60 text-sm pl-5 text-start text-ellipsis">
        {props.task.split(":")[1]}
      </div>
      <div class="text-sm opacity-60">{props.note}</div>
    </div>
  )
}

export default function SuggestedTodos(props: {
  suggestions: SuggestedTodo[]
}) {
  const todoList = useTodoList()
  const user = useUser()
  const [continueOnboarding, setCountinueOnboarding] = createSignal(false)
  const [focusedSuggestion, setFocusedSuggestion] = createSignal(0)
  const [filteredSuggestions, setFilteredSuggestions] = createSignal(
    props.suggestions.map((s) => {
      return { ...s, accepted: false }
    })
  )
  createEffect(() => {
    if (continueOnboarding()) {
      const suggestion = props.suggestions[focusedSuggestion()]

      todoList.todosState.addSubtask(todoList.focusedTodoKey()!, {
        type: "subtask",
        title: suggestion.task,
        note: suggestion.note,
        done: false,
        starred: false,
        priority: 0,
        dueDate: "",
        parent: todoList.focusedTodo() as ClientTodo,
      })
    }
  })
  createShortcut(["Enter"], () => {
    const suggestion = props.suggestions[focusedSuggestion()]

    let newFilteredSuggestions = filteredSuggestions()
    newFilteredSuggestions[focusedSuggestion()].accepted = true
    setFilteredSuggestions(newFilteredSuggestions)

    setFocusedSuggestion((p) => {
      let n = p + 1
      let counter = 0 // Counter to track number of iterations
      if (n >= filteredSuggestions().length) {
        n = 0 // Reset to start if we're at the end of the array
      }
      while (
        filteredSuggestions()[n]?.accepted === true &&
        counter < filteredSuggestions().length
      ) {
        n++
        counter++
        if (n >= filteredSuggestions().length) {
          n = 0 // Reset to start of array if we reach the end
        }
      }
      return n
    })

    // TODO: fix..
    todoList.todosState.addSubtask(todoList.focusedTodoKey()!, {
      type: "subtask",
      title: suggestion.task,
      note: suggestion.note,
      done: false,
      starred: false,
      priority: 0,
      dueDate: "",
      parent: todoList.focusedTodo() as ClientTodo,
    })
    if (filteredSuggestions().every((s) => s.accepted === true)) {
      todoList.setMode(TodoListMode.Default)
    }

    if (user.user.showOnboarding) {
      todoList.setOnBoarding(5)
      todoList.setMode(TodoListMode.Default)
    }
  })

  createShortcut(["ArrowDown"], () => {
    setFocusedSuggestion((p) => {
      let n = p + 1
      let loopedOnce = false

      while (true) {
        if (n >= filteredSuggestions().length) {
          if (loopedOnce) break // If we have looped once and all are accepted, break the loop.
          n = 0
          loopedOnce = true
        }
        if (filteredSuggestions()[n].accepted !== true) {
          break
        }
        n++
      }

      if (n >= filteredSuggestions().length) {
        n = filteredSuggestions().length - 1 // If we have exceeded the array length, set n to the last index.
      }

      return n
    })
  })

  createShortcut(["ArrowUp"], () => {
    setFocusedSuggestion((p) => {
      let n = p - 1
      if (n < 0) {
        n = filteredSuggestions().length - 1
      }
      const originalN = n // Remember the starting point
      while (filteredSuggestions()[n].accepted === true) {
        n--
        if (n < 0) {
          n = filteredSuggestions().length - 1
        }
        if (n === originalN) {
          // We've gone full circle, every suggestion is accepted
          break
        }
      }
      return n
    })
  })
  return (
    <>
      <style>
        {`
        #index {
          z-index: 10;
          min-width: 360px;
        }
        #ofIndex {
          z-index: 0;
        }
        `}
      </style>
      <Motion.div
        initial={{ transform: "translateX(20px)", opacity: 0 }}
        animate={{ transform: "translateX(0px)", opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{ width: "0px" }}
        class="flex flex-col items-center h-full w-full relative"
        id={todoList.onBoarding() === 4 ? "index" : "ofIndex"}
      >
        <div
          class="absolute "
          style={{ top: "4%", left: "-115%", width: "400px" }}
        >
          <Show when={user.user.showOnboarding && todoList.onBoarding() === 4}>
            <div class="rounded-lg" id="box">
              <div
                class="bg-gray-100 flex flex-col items-center justify-center gap-1 dark:bg-neutral-900 p-3 px-6 relative rounded-lg"
                style={{ "z-index": "10" }}
              >
                <div>
                  Choose suggestion you like from the list by pressing{" "}
                  <span
                    class="font-bold bg-white px-2 p-0.5 text-sm rounded-lg"
                    style={{
                      border: "solid 1px black",
                      "border-bottom": "solid 2px black",
                    }}
                  >
                    Enter
                  </span>{" "}
                  key. Use arrow keys to move between suggestions.
                </div>
                <div
                  onClick={() => {
                    setCountinueOnboarding(true)
                    todoList.setOnBoarding(5)
                    todoList.setMode(TodoListMode.Default)
                  }}
                  class="bg-blue-400 w-3/4 rounded-md hover:opacity-60 transition-all border-blue-200 border-2 flex items-center justify-center text-white py-1"
                >
                  Continue
                </div>
              </div>
              <div
                class="absolute left-5 p-3 rounded bg-gray-100 dark:bg-neutral-900 rotate-90 "
                id="arrow"
                style={{
                  transform: "rotate(45deg)",

                  left: "96%",
                  top: "32%",
                  width: "25px",
                  height: "25px",
                }}
              ></div>
            </div>
          </Show>
        </div>
        <Motion.div
          initial={{ "font-size": "0px" }}
          animate={{ "font-size": "18px" }}
          transition={{ duration: 0 }}
          // TODO: improve the animation on showing the text, text appears squished..
          exit={{ display: "none" }}
          class="bg-gray-100 dark:bg-neutral-900 w-full p-3 text-lg text-center"
        >
          {/* TODO: fix this ts-ignore as well as all others.. */}
          Suggested tasks for {/* @ts-ignore */}
          {todoList.focusedTodo()?.title}
        </Motion.div>
        <div class="h-full bg-gray-100 dark:bg-neutral-900 overflow-scroll w-full">
          <div
            class="flex flex-col h-full overflow-scroll"
            style={{ "border-radius": "10px" }}
          >
            {filteredSuggestions().map((todo, index) => (
              <SuggestedTodo
                task={todo.task}
                note={todo.note}
                isFocused={index === focusedSuggestion()}
                onClick={() => setFocusedSuggestion(index)}
                accepted={filteredSuggestions()[index].accepted}
              />
            ))}
          </div>
        </div>
      </Motion.div>
    </>
  )
}
