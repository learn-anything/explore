import { Motion, Presence } from "@motionone/solid"
import { autofocus } from "@solid-primitives/autofocus"
import { createEventListener } from "@solid-primitives/event-listener"
import { createShortcut } from "@solid-primitives/keyboard"
import Fuse from "fuse.js"
import {
  For,
  Show,
  batch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js"
import { todayDate } from "~/lib/lib"
import {
  ClientSubtask,
  ClientTodo,
  TodoListMode,
  useTodoList,
} from "../GlobalContext/todo-list"
import Icon from "./Icon"

export default function TodoEdit(props: {
  todo: ClientTodo | ClientSubtask
  initialEditNote?: true
}) {
  const todoList = useTodoList()
  const [title, setTitle] = createSignal(props.todo.title)
  const [note, setNote] = createSignal(props.todo.note)
  const [dueDate, setDueDate] = createSignal(props.todo.dueDate)
  const [showCalendar, setShowCalendar] = createSignal(false)
  const [showSelectPriority, setShowSelectPriority] = createSignal(false)
  const [priority, setPriority] = createSignal(props.todo.priority)
  const [starred, setStarred] = createSignal(props.todo.starred)
  const [tags, setTags] = createSignal(props.todo.tags)
  const [searchTags, setSearchTags] = createSignal(false)
  const [showBar, setShowBar] = createSignal(false)
  const [ShowIcon, setShowIcon] = createSignal(false)
  const [tagColor, setTagColor] = createSignal("black")
  const [showColorPicker, setShowColorPicker] = createSignal(false)

  const fuse = createMemo(
    () =>
      new Fuse(Array.from(todoList.currentlyUsedTagsWithCount().keys()), {
        shouldSort: false,
      })
  )
  const [searchTagsQuery, setSearchTagsQuery] = createSignal("")
  const filteredTags = createMemo(() => {
    if (searchTagsQuery() === "") {
      return Array.from(todoList.currentlyUsedTagsWithCount().keys()).filter(
        (r) => !props.todo.tags?.includes(r)
      )
    }
    const results = fuse()
      .search(searchTagsQuery())
      .filter((r) => !props.todo.tags?.includes(r.item))
      .map((r) => {
        return r.item
      })
    return results
  })

  onCleanup(() => {
    // REMOVE
    if (title() === "") {
      todoList.todosState.removeTodo(props.todo.key)
      return
    }

    if ("subtasks" in todoList.flatTasks()[todoList.focusedTodoIndex()]) {
      // UPDATE TASK
      batch(() => {
        todoList.todosState.updateTodo(props.todo.key, (p) => ({
          ...p,
          title: title(),
          note: note(),
          priority: priority(),
          starred: starred(),
          tags: tags(),
          dueDate: showCalendar() && !dueDate() ? todayDate() : dueDate(),
        }))

        todoList.setMode(TodoListMode.Default)
      })
      return
    }
    // UPDATE SUBTASK
    batch(() => {
      todoList.todosState.updateSubtask(
        // TODO: not sure how to avoid ts-ignore..
        // @ts-ignore
        todoList.flatTasks()[todoList.focusedTodoIndex()].parent.key,
        props.todo.key,
        // somehow id, key and parent need to be on the type
        // but they have to be derived, don't know how..
        (p) => ({
          ...p,
          title: title(),
          note: note(),
          priority: priority(),
          starred: starred(),
          dueDate: showCalendar() && !dueDate() ? todayDate() : dueDate(),
          done: false,
        })
      )
      todoList.setMode(TodoListMode.Default)
    })
  })

  createEventListener(window, "keydown", (e) => {
    if (e.code === "Enter" && !todoList.searchTags()) {
      batch(() => {
        if (title() === "") {
          todoList.removeTodo(props.todo.key)
        } else {
          todoList.updateTodo(props.todo.key, {
            title: title(),
            note: note(),
            starred: starred(),
            priority: priority(),
            dueDate: dueDate(),
          })
        }

        todoList.setMode(TodoListMode.Default)
      })
    }
  })
  createEffect(() => {
    if (!showBar()) {
      setShowIcon(false)

      return
    }

    setTimeout(() => {
      setShowIcon(true)
    }, 700)
  })
  let titleRef!: HTMLTextAreaElement,
    noteRef!: HTMLTextAreaElement,
    datePickerRef!: HTMLInputElement,
    tagInputRef!: HTMLInputElement

  const [editNoteInTodo, setEditNoteInTodo] = createSignal(
    !!props.initialEditNote
  )

  createEffect(() => {
    if (editNoteInTodo()) {
      autofocus(noteRef)
      createShortcut(["ArrowUp"], () => setEditNoteInTodo(false))
    } else {
      autofocus(titleRef)
      createShortcut(["ArrowDown"], () => setEditNoteInTodo(true))
    }
  })

  createEffect(() => {
    if (todoList.searchTags()) {
      autofocus(tagInputRef)
      return
    }
    autofocus(titleRef)
  })

  return (
    <>
      <style>
        {`
      #Edit {
        animation: shadowDrop 0.15s forwards linear;

      }
      @keyframes shadowDrop {
        0% {
          max-height: 40px;
          overflow: hidden;
          filter: drop-shadow(0px 5px 0px, rgba(50,50,50,0.5))
        }
        100% {
          max-height: 200px;
          overflow: none;
          filter: drop-shadow(0px 8px 10px rgba(50,50,50,0.3));
        }
      }
    `}
      </style>
      <Motion.div
        initial={{}}
        animate={{}}
        transition={{ duration: 1 }}
        class="flex flex-col cursor-default overflow-hidden relative1 pl-1.5 pr-1.5 dark:bg-neutral-800 bg-zinc-200 py-2 transition-all rounded-lg w-full"
        id="Edit"
        style={{ transition: "height 1s" }}
      >
        <div
          class="w-full h-full flex justify-between"
          style={{ "padding-right": "0.375rem" }}
        >
          <div class="flex grow gap-1 items-start h-full">
            <div style={{ "padding-top": "3.5px" }}>
              <Icon name={"Square"} />
            </div>
            <div class="w-full h-full">
              <textarea
                onfocus={() => {
                  todoList.setSearchTags(false)
                  setShowCalendar(false)
                }}
                value={title()}
                autofocus
                ref={titleRef}
                oninput={(e) => {
                  setTitle(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = e.target.scrollHeight + "px"
                }}
                rows="1"
                style={{
                  outline: "none",
                  "word-break": "break-all",

                  "min-height": "20px",
                }}
                class=" bg-inherit w-full overflow-hidden resize-none"
              ></textarea>
            </div>
          </div>
          <Show when={showSelectPriority()}>
            <div class="cursor-pointer flex items-center justify-center">
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
              class="cursor-pointer flex items-center justify-center"
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
              {priority() === 0 && (
                <Icon name={"Star"} width={"22px"} height={"22px"} />
              )}
            </div>
          </Show>
        </div>
        <div
          style={{ "padding-right": "0.375rem" }}
          class="flex flex-col gap-1 justify- center items-start w-full relative h-full"
        >
          <div class="pl-6 grow h-full w-full">
            <textarea
              autofocus
              ref={noteRef}
              style={{
                outline: "none",
                "word-break": "break-all",

                width: "100%",
                height: "100%",
                "max-width": "100%",
              }}
              rows={note()?.length > 200 ? 2 : 1}
              class="text-sm opacity-60 flex w-full justify-center items-center bg-inherit resize-none"
              type="text"
              oninput={(e) => {
                setNote(e.target.value)
                e.target.style.height = "auto"
                e.target.style.height = e.target.scrollHeight + "px"
              }}
              onfocus={() => {
                todoList.setSearchTags(false)
                setShowCalendar(false)
              }}
              placeholder="Notes"
              value={props.todo.note ? props.todo.note : ""}
            />
          </div>
          {/* TODO: don't duplicate like below.. */}
          <div class="flex items-center justify-end gap-2 w-full h-full">
            <Show when={props.todo.dueDate || showCalendar()}>
              <input
                autofocus
                onfocus={() => {
                  todoList.setSearchTags(false)
                }}
                ref={datePickerRef}
                style={{ "min-width": "6.5rem", width: "6.5rem" }}
                class="bg-transparent text-sm opacity-70 outline-none"
                type="date"
                id="start"
                onchange={(e) => {
                  setDueDate(e.target.value)
                }}
                value={props.todo.dueDate ? props.todo.dueDate : todayDate()}
                min={props.todo.dueDate ? props.todo.dueDate : todayDate()}
              ></input>
            </Show>
            <div class="flex w-fit overflow-auto">
              <div class=" w-fit flex gap-2 overflow-scroll">
                <For each={tags()}>
                  {(tag) => (
                    <div class="min-w-fit bg-zinc-300 dark:bg-neutral-700 flex justify-center items-center pr-2 gap-1 rounded-2xl px-3">
                      <div class="cursor-auto">{tag}</div>
                      <div
                        class="opacity-70 "
                        style={{ "padding-top": "1px" }}
                        onClick={() => {
                          setTags(tags()?.filter((t) => t !== tag))
                        }}
                      >
                        {" "}
                        <Icon name="Close"></Icon>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
            <Show when={todoList.searchTags()}>
              <div>
                <div
                  style={{
                    "min-width": "150px",
                    border: "solid 1px rgba(80,80,80,0.5)",
                  }}
                  class="flex gap-1 p-0.5 bg-gray-100 dark:bg-neutral-800 pl-0.5 px-6 rounded-lg relative"
                >
                  <div class="opacity-60">
                    <Icon name="Search" />
                  </div>

                  <input
                    class="bg-inherit dark:bg-neutral-800 text-sm rounded pl-0.5 outline-none"
                    ref={tagInputRef}
                    value={searchTagsQuery()}
                    autofocus
                    style={{
                      width: "100px",
                    }}
                    type="text"
                    onKeyPress={(e) => {
                      if (searchTagsQuery() === "" && e.key === "Enter") {
                        todoList.setSearchTags(false)
                        return
                      }
                      if (e.key === "Enter") {
                        if (
                          searchTagsQuery() !== "" &&
                          filteredTags().length > 0
                        ) {
                          if (tags() !== null) {
                            if (tags() !== undefined) {
                              setTags([...tags(), filteredTags()[0]])
                            } else {
                              setTags([filteredTags()[0]])
                            }
                          } else {
                            setTags([filteredTags()[0]])
                          }
                          return
                        }
                        if (tags() !== null) {
                          if (tags() !== undefined) {
                            setTags([...tags(), searchTagsQuery()])
                          } else {
                            setTags([searchTagsQuery()])
                          }
                        } else {
                          setTags([searchTagsQuery()])
                        }
                        setSearchTagsQuery("")
                      }
                    }}
                    oninput={(e) => {
                      setSearchTagsQuery(e.target.value)
                    }}
                    placeholder="Search"
                  />
                </div>
                <div
                  id="tagsearch"
                  class="flex w-full bg-zinc-200 dark:bg-neutral-800 z-20 rounded pl-1"
                  style={{}}
                >
                  <div
                    class="absolute z-30 flex gap-1 flex-col mt-7 ml-2"
                    style={{
                      right: "38px",
                      bottom: "-152px",
                      width: "150px",
                    }}
                  >
                    <div
                      class="rounded-lg w-full z-10 bg-gray-100 dark:bg-neutral-800"
                      style={{
                        height: "150px",
                        border: "solid 1px rgba(80,80,80,0.5)",
                      }}
                    >
                      <div class="flex flex-col overflow-scroll py-2 px-2">
                        <Show
                          when={
                            filteredTags().length === 0 &&
                            searchTagsQuery() !== "" &&
                            !tags()?.includes(searchTagsQuery())
                          }
                        >
                          <div
                            class="rounded text-sm bg-zinc-200 dark:bg-neutral-700 pl-2 p-1"
                            onClick={() => {
                              if (tags() !== null) {
                                if (tags() !== undefined) {
                                  setTags([...tags(), searchTagsQuery()])
                                } else {
                                  setTags([searchTagsQuery()])
                                }
                              } else {
                                setTags([searchTagsQuery()])
                              }
                              setSearchTagsQuery("")
                            }}
                          >
                            Create new tag "{searchTagsQuery()}"
                          </div>
                        </Show>
                        <For each={filteredTags()}>
                          {(tag) => (
                            <div class="flex flex-col gap-1">
                              <div
                                class="px-2 flex items-center justify-between text-sm py-0.5 hover:bg-zinc-200 rounded transition-all"
                                onClick={() => {
                                  if (tags() === null) {
                                    setTags([tag])
                                    return
                                  }
                                  setTags([...tags(), tag])
                                  console.log("run")
                                }}
                              >
                                <div>{tag}</div>
                                <div
                                  onClick={() => {
                                    setShowColorPicker(!showColorPicker())
                                  }}
                                >
                                  <Icon
                                    name="Circle"
                                    color={tagColor()}
                                    width="10px"
                                    height="10px"
                                  ></Icon>
                                </div>
                              </div>
                              <Show when={showColorPicker()}>
                                <div
                                  style={{ height: "24px" }}
                                  class="flex items-center justify-between bg-gray-300 rounded-md px-3 py-1"
                                >
                                  <div
                                    onClick={() => {
                                      setTagColor("purple")
                                      setShowColorPicker(false)
                                    }}
                                  >
                                    <Icon
                                      name="Circle"
                                      color="purple"
                                      width="10px"
                                      height="10px"
                                    ></Icon>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setTagColor("blue")
                                      setShowColorPicker(false)
                                    }}
                                  >
                                    <Icon
                                      name="Circle"
                                      color="blue"
                                      width="10px"
                                      height="10px"
                                    ></Icon>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setTagColor("yellow")
                                      setShowColorPicker(false)
                                    }}
                                  >
                                    <Icon
                                      name="Circle"
                                      color="yellow"
                                      width="10px"
                                      height="10px"
                                    ></Icon>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setTagColor("green")
                                      setShowColorPicker(false)
                                    }}
                                  >
                                    <Icon
                                      name="Circle"
                                      color="green"
                                      width="10px"
                                      height="10px"
                                    ></Icon>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setTagColor("orange")
                                      setShowColorPicker(false)
                                    }}
                                  >
                                    <Icon
                                      name="Circle"
                                      color="orange"
                                      width="10px"
                                      height="10px"
                                    ></Icon>
                                  </div>
                                </div>
                              </Show>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Show>

            <Presence>
              <Show when={showBar()}>
                <Motion.div
                  class="text-sm flex items-center justify-center min-w-fit h-full px-4  gap-2 overflow-hidden  bg-gray-100 dark:bg-neutral-700 rounded-xl "
                  style={{
                    "padding-top": "2px",
                    "padding-bottom": "2px",
                  }}
                >
                  <div class=" flex transition-all h-full gap-2 rounded cursor-pointer">
                    <div class="flex h-full gap-2 ">
                      <div
                        class="h-full"
                        onClick={() => {
                          todoList.setSearchTags(!todoList.searchTags())
                          setShowCalendar(false)
                          setShowBar(false)
                        }}
                      >
                        <Motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon name="Tag" width="20px" height="20px" />
                        </Motion.div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="cursor-pointer"
                    onClick={() => {
                      setShowCalendar(true)
                      setShowBar(false)
                      datePickerRef.focus()
                    }}
                  >
                    <Motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon width="20" height="20" name="Calendar"></Icon>
                    </Motion.div>
                  </div>
                </Motion.div>
              </Show>
            </Presence>
            <div
              class="dark:bg-blue-500 bg-blue-400 opacity-80  rounded-3xl"
              style={{ padding: "3px" }}
              onClick={() => {
                todoList.setSearchTags(false)
                setShowBar(!showBar())
              }}
            >
              <Icon name="Plus"></Icon>
            </div>
          </div>
        </div>
      </Motion.div>
    </>
  )
}
