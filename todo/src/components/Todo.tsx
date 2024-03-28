import { Motion } from "@motionone/solid"
import clsx from "clsx"
import { For, Show, createEffect, createSignal } from "solid-js"
import { isToday } from "~/lib/lib"
import {
  ClientSubtask,
  ClientTodo,
  TodoListMode,
  useTodoList,
} from "../GlobalContext/todo-list"
import Icon from "./Icon"
import Loader from "./Loader"
import ContextMenu from "./ContextMenu"
import { useUser } from "~/GlobalContext/user"

export default function Todo(props: {
  todo: ClientTodo | ClientSubtask
  subtask: boolean
  loadingSuggestions: boolean
}) {
  const todoList = useTodoList()
  const user = useUser()
  const [triggerAnimation, setTriggerAnimation] = createSignal(false)
  const [points, setPoints] = createSignal({
    x: 0,
    y: 0,
  })
  const [showContextMenu, setShowContextMenu] = createSignal(false)
  // const [daysLeft, setDaysLeft] = createSignal("")

  createEffect(() => {
    const handleClick = () => setShowContextMenu(false)
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  })

  return (
    <>
      <style>
        {`
        .animated {
          animation: pulse 0.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;

        }
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: translateY(0px);
          }
          100% {
            transform: translateY(10px);
            opacity: 0;
          }
        }
        #Index {
          z-index: 10
        }
        #noIndex {
          z-index: 1
        }
        #box {
          border: solid 2px rgba(200, 200, 200, 0.5)
        }
        #arrow {
          border: solid 2px rgba(200, 200, 200, 0.5)
        }
        @media (prefers-color-scheme: dark) {
          #box {
            border: solid 2px rgba(43, 43, 43, 0.5)
          }
          #arrow {
            border: solid 2px rgba(43, 43, 43, 0.5)
          }
        }
        #zIndex {
          z-index: 100
        }




        .TodoAnimation {
          animation: shadowReverse 0.15s forwards linear
        }
        @keyframes shadowReverse {
          0% {

            filter: drop-shadow(0px 5px 10px rgba(50,50,50,0.3));
          }
          100% {

            filter: drop-shadow(0px 0px 0px rgba(50,50,50,0.5));
          }
        }
      `}
      </style>
      <Motion.div class={triggerAnimation() ? "animated " : "transition-all"}>
        {showContextMenu() && todoList.isTodoFocused(props.todo.key) && (
          <ContextMenu top={points().y} left={points().x} />
        )}

        <div
          oncontextmenu={(e) => {
            e.preventDefault()
            setShowContextMenu(true)
            todoList.setFocusedTodoKey(props.todo.key)
            setPoints({
              x: e.pageX - 220,
              y: e.pageY - 70,
            })
          }}
          class={clsx(
            "TodoAnimation flex relative cursor-default pl-1.5 justify-between p-2 h-fit dark:border-neutral-700 mb-1 rounded-lg items-center",
            props.todo.note && "min-h-min",
            props.subtask && "ml-4",
            todoList.isTodoFocused(props.todo.key) &&
              "BackgroundAnimation dark:bg-neutral-800 bg-zinc-200",
            todoList.localSearchData()?.isResult(props.todo.key) &&
              "border rounded border-blue-500",
            todoList.localSearchData()?.isSelected(props.todo.key) &&
              "bg-blue-300 dark:bg-blue-500"
          )}
          style={{
            "-webkit-user-select": "none",
            "user-select": "none",
          }}
          onClick={(e) => {
            if (showContextMenu()) {
              return
            }
            todoList.setFocusedTodoKey(props.todo.key)
            todoList.setMode(TodoListMode.Default)
            // if (todoList.isTodoFocused(props.todo.key)) {
            //   todoList.setMode(TodoListMode.Edit, {})
            // } else {
            // }
          }}
          id={todoList.onBoarding() === 3 ? "Index" : "noIndex"}
        >
          <div class="absolute " style={{ top: "140%", left: "0%" }}>
            <Show
              when={
                user.user.showOnboarding &&
                todoList.onBoarding() === 3 &&
                props.todo.key === todoList.focusedTodoKey()
              }
            >
              <div class=" rounded-lg" id="box">
                <div
                  class="bg-gray-100 dark:bg-neutral-900 p-3 px-6 relative rounded-lg flex flex-col gap-2 items-center justify-center"
                  style={{ "z-index": "10" }}
                >
                  <div>
                    Ask AI for suggestions by pressing{" "}
                    <span
                      class="bg-white rounded-lg text-sm px-2 font-bold p-0.5"
                      style={{
                        border: "solid 1px black",
                        "border-bottom": "solid 3px black",
                      }}
                    >
                      a
                    </span>{" "}
                    key
                  </div>
                  <div
                    onClick={() => {
                      if (user.user.showOnboarding) {
                        todoList.setOnBoarding(4)
                      }

                      todoList.setMode(TodoListMode.Suggest)
                    }}
                    class="bg-blue-400 rounded-md hover:opacity-60 text-white py-1 border-blue-200 border-2 transition-all w-3/4 flex items-center justify-center"
                  >
                    Continue
                  </div>
                </div>
                <div
                  class="absolute left-5 p-3 rounded bg-gray-100 dark:bg-neutral-900 rotate-90 "
                  id="arrow"
                  style={{
                    transform: "rotate(45deg)",
                    top: "-13%",
                  }}
                ></div>
              </div>
            </Show>
          </div>

          <div style={{ display: "flex" }} class="flex-col justify-center">
            <div class="flex items-center gap-1">
              <div
                onClick={() => {
                  setTriggerAnimation(true)
                  setTimeout(() => {
                    todoList.todosState.toggleTodo(props.todo.key)
                    setTriggerAnimation(false)
                  }, 300)
                }}
                style={{ "padding-top": "1px" }}
              >
                <Icon name={props.todo.done ? "SquareCheck" : "Square"} />
              </div>
              <div>{props.todo.title}</div>
            </div>
            <div class="opacity-60 text-sm pl-5">{props.todo.note}</div>
          </div>
          <div
            style={{ "padding-right": "0.375rem" }}
            class="flex gap-3 items-center overflow-auto rounded-lg"
          >
            {props.loadingSuggestions && <Loader />}
            <div class="opacity-50 " style={{ "font-size": "14.8px" }}>
              {props.todo?.dueDate && isToday(props.todo.dueDate)
                ? "Today"
                : props.todo.dueDate}
            </div>
            <div class="w-fit">
              <div class="flex w-fit items-center gap-2 justify-center overflow-auto">
                <For each={props.todo.tags}>
                  {(tag) => (
                    <div class="bg-zinc-300 opacity-80 min-w-fit dark:bg-neutral-700 flex justify-start px-3 rounded-2xl overflow-hidden">
                      <div class="whitespace-nowrap w-full">{tag}</div>
                    </div>
                  )}
                </For>
                {/* {props.todo.tags && props.todo.tags.map()} */}
              </div>
            </div>
            <Show when={!props.todo.starred}>
              <div>
                {props.todo.priority !== 0 && (
                  <Icon name={`Priority ${props.todo.priority}`} />
                )}
              </div>
            </Show>
            <Show when={props.todo.starred}>
              <div>
                <Icon
                  name={
                    props.todo.priority
                      ? `StarWithPriority${props.todo.priority}`
                      : `Star`
                  }
                  width={"22px"}
                  height={"22px"}
                />
              </div>
            </Show>
          </div>
        </div>
      </Motion.div>
    </>
  )
}
