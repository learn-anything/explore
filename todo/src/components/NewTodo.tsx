import { Motion } from "@motionone/solid"
import { autofocus } from "@solid-primitives/autofocus"
import { createEventListener } from "@solid-primitives/event-listener"
import { createShortcut } from "@solid-primitives/keyboard"
import { Show, batch, createEffect, createSignal } from "solid-js"
import { todayDate } from "~/lib/lib"
import { TodoListMode, useTodoList } from "../GlobalContext/todo-list"
import Icon from "./Icon"
import { useUser } from "~/GlobalContext/user"

export default function NewTodo() {
  const todoList = useTodoList()
  const user = useUser()
  const [title, setTitle] = createSignal("")
  const [note, setNote] = createSignal("")
  const [dueDate, setDueDate] = createSignal("")
  const [showCalendar, setShowCalendar] = createSignal(false)
  const [showSelectPriority, setShowSelectPriority] = createSignal(true)
  const [priority, setPriority] = createSignal<0 | 1 | 2 | 3>(0)
  const [starred, setStarred] = createSignal(false)
  const [continueOnboarding, setCountinueOnboarding] = createSignal(false)

  createEffect(() => {
    if (continueOnboarding()) {
      let id
      console.log("run")
      todoList.setOnBoarding(3)
      id = todoList.todosState.addTodo({
        title: "bake a pie",
        note: note(),
        done: false,
        starred: starred(),
        priority: priority(),
        dueDate: dueDate(),
        subtasks: [],
      })
      todoList.setFocusedTodoKey(id)
      return
    }
  })

  createEventListener(window, "keydown", (e) => {
    if (e.code === "Enter") {
      batch(() => {
        if (title() !== "") {
          let id
          switch (todoList.activePage()) {
            case "All":
              id = todoList.todosState.addTodo({
                title: title(),
                note: note(),
                done: false,
                starred: starred(),
                priority: priority(),
                dueDate: dueDate(),
                subtasks: [],
              })
              break
            case "Today":
              id = todoList.todosState.addTodo({
                title: title(),
                note: note(),
                done: false,
                starred: starred(),
                priority: priority(),
                dueDate: todayDate(),
                subtasks: [],
              })
              break
            case "Starred":
              id = todoList.todosState.addTodo({
                title: title(),
                note: note(),
                done: false,
                starred: true,
                priority: priority(),
                dueDate: dueDate(),
                subtasks: [],
              })
              break
          }
          todoList.setFocusedTodoKey(id)
        }
        if (user.user.showOnboarding && title() === "") {
          return
        }
        if (user.user.showOnboarding) {
          todoList.setOnBoarding(3)
        }

        todoList.setMode(TodoListMode.Default)
      })
    }
  })

  let titleRef!: HTMLInputElement,
    noteRef!: HTMLInputElement,
    datePickerRef!: HTMLInputElement

  const [editNoteInTodo, setEditNoteInTodo] = createSignal(false)

  createEffect(() => {
    if (editNoteInTodo()) {
      autofocus(noteRef)
      createShortcut(["ArrowUp"], () => setEditNoteInTodo(false))
    } else {
      autofocus(titleRef)
      createShortcut(["ArrowDown"], () => setEditNoteInTodo(true))
    }
  })

  return (
    <>
      <style>
        {`
        #Index {
          z-index: 10
        }
        #noIndex {
          z-index: 0
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
      `}
      </style>
      <Motion.div
        initial={{
          transform: "translateY(15px)",
          opacity: 0,
          "box-shadow": "0 8px 10px rgba(0, 0, 0, 0.15)",
        }}
        animate={{
          transform: "translateY(0px)",
          opacity: 1,
          "box-shadow": "0 8px 10px rgba(0, 0, 0, 0.15)",
        }}
        transition={{ duration: 0.4 }}
        exit={{ "box-shadow": "0 5px 15px rgba(0,0,0,0.3)" }}
        id={todoList.onBoarding() === 2 ? "Index" : "noIndex"}
        class="flex relative justify-between cursor-default pl-1.5 pr-1.5 dark:bg-neutral-800 bg-zinc-200 py-2 rounded-lg"
      >
        <div class="w-full">
          <div class="flex gap-2 items-center">
            <div class="absolute " style={{ top: "128%", left: "0%" }}>
              <Show
                when={user.user.showOnboarding && todoList.onBoarding() === 2}
              >
                <div class=" rounded-lg" id="box">
                  <div
                    class="bg-gray-100 flex flex-col gap-1 items-center justify-center
                     dark:bg-neutral-900 p-3 px-6 relative rounded-lg"
                    style={{ "z-index": "10" }}
                  >
                    <div>Write a new todo. For example "Bake a pie".</div>
                    <div
                      onClick={() => {
                        setCountinueOnboarding(true)
                      }}
                      class="w-3/4 flex items-center justify-center bg-blue-400 hover:opacity-60 transition-all border-blue-200 border-2 rounded-md px-4 py-1 text-white"
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
            <div>
              <Icon name={"Square"} />
            </div>
            <div class="w-full ">
              <input
                value={title()}
                autofocus
                ref={titleRef}
                oninput={(e) => {
                  setTitle(e.target.value)
                }}
                style={{
                  outline: "none",
                }}
                class=" bg-inherit w-full"
              ></input>
            </div>
          </div>
          <div class="pl-7">
            <input
              autofocus
              ref={noteRef}
              class="bg-transparent text-sm opacity-70 w-full outline-none"
              type="text"
              oninput={(e) => {
                setNote(e.target.value)
              }}
              placeholder="Notes"
            />
          </div>
        </div>
        <div
          style={{ "padding-right": "0.375rem" }}
          class="flex flex-col justify-between items-end"
        >
          {/* TODO: don't duplicate like below.. */}
          <Show when={showSelectPriority()}>
            <div class="cursor-pointer flex">
              <div
                onClick={() => {
                  setPriority(1)
                  setShowSelectPriority(false)
                }}
              >
                <Icon name={"Priority 1"} />
              </div>
              <div
                onClick={() => {
                  setPriority(2)
                  setShowSelectPriority(false)
                }}
              >
                <Icon name={"Priority 2"} />
              </div>
              <div
                onClick={() => {
                  setPriority(3)
                  setShowSelectPriority(false)
                }}
              >
                <Icon name={"Priority 3"} />
              </div>
              <div
                onClick={() => {
                  setStarred(!starred())
                  setShowSelectPriority(false)
                }}
              >
                <Icon name={"Star"} />
              </div>
            </div>
          </Show>
          <Show when={!starred() && !showSelectPriority()}>
            <div
              class="cursor-pointer"
              onClick={() => {
                setShowSelectPriority(true)
              }}
            >
              {priority() === 3 && <Icon name={"Priority 3"} />}
              {priority() === 2 && <Icon name={"Priority 2"} />}
              {priority() === 1 && <Icon name={"Priority 1"} />}
            </div>
          </Show>
          <Show when={starred() && !showSelectPriority()}>
            <div
              class="cursor-pointer"
              onClick={() => {
                setShowSelectPriority(true)
              }}
            >
              {priority() === 3 && <Icon name={"StarWithPriority3"} />}
              {priority() === 2 && <Icon name={"StarWithPriority2"} />}
              {priority() === 1 && <Icon name={"StarWithPriority1"} />}
              {priority() === 0 && <Icon name={"Star"} />}
            </div>
          </Show>
          <div class="opacity-60 text-sm">
            <Show
              when={dueDate() || showCalendar()}
              fallback={
                <div
                  class="cursor-pointer"
                  onClick={() => {
                    setShowCalendar(true)
                    datePickerRef.focus()
                  }}
                >
                  <Icon name="Calendar" width="20px" height="20px"></Icon>
                </div>
              }
            >
              <input
                autofocus
                ref={datePickerRef}
                style={{ width: "6.5rem" }}
                class="bg-transparent text-sm opacity-70 outline-none"
                type="date"
                id="start"
                onchange={(e) => {
                  setDueDate(e.target.value)
                }}
                value={dueDate()}
                min={todayDate()}
              ></input>
            </Show>
          </div>
        </div>
      </Motion.div>
    </>
  )
}
