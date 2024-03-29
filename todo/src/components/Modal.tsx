import { createEventListener } from "@solid-primitives/event-listener"
import type { JSX } from "solid-js"
import { useTodoList } from "~/GlobalContext/todo-list"

// TODO: should contain JSX passed in
// find a type for JSX.element..
interface Props {
  children: JSX.Element
  title: string
  onClose: () => void
}

export default function Modal(props: Props) {
  const global = useTodoList()

  let ref!: HTMLDivElement
  createEventListener(
    () => ref,
    "click",
    (e) => {
      if (e.target === ref) {
        // global.setShowHelp(false)
        // global.setShowSettings(false)
        // global.setNewTodo(false)
      }
    },
    { passive: true }
  )

  return (
    <div
      style={{
        "background-color": "#00000080",
        "backdrop-filter": "blur(2px)",
      }}
      class="fixed bottom-0 right-0 h-screen w-screen"
    >
      <div class="items-center w-full flex justify-center h-screen" ref={ref}>
        <div class="h-full w-full bg-gray-100 dark:bg-stone-900">
          <div class="w-full h-full flex flex-col">
            <div class="h-full w-full overflow-hidden">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
