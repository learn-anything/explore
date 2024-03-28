import clsx from "clsx"
import { createSignal } from "solid-js"
import { DragOrder } from "../components/DragOrder"

export default function Profile() {
  const [status, setStatus] = createSignal("learning") // this should be replaced with real data
  const [items, setItems] = createSignal([
    "gaming",
    "reading",
    "studying",
    "thinking"
  ])
  return (
    <div class=" ml-[180px] flex">
      <Sidebar />
      <div class="flex-grow">
        <div class="flex justify-between h-[90px] items-center p-5">
          <div class="font-bold text-[30px] opacity-50">My Links</div>
          <div class="flex gap-1 bg-neutral-800 rounded-md [&>*]:px-3 [&>*]:p-2 [&>*]:rounded-md text-white/40 font-bold">
            <div
              onClick={() => {
                setStatus("learning")
              }}
              class={clsx("", status() === "learning" && "bg-neutral-700/50")}
            >
              Learning
            </div>
            <div
              onClick={() => {
                setStatus("tolearn")
              }}
              class={clsx("", status() === "tolearn" && "bg-neutral-700/50")}
            >
              To Learn
            </div>
            <div
              onClick={() => {
                setStatus("learned")
              }}
              class={clsx("", status() === "learned" && "bg-neutral-700/50")}
            >
              Learned
            </div>
          </div>
        </div>
        <div class="p-1">
          <DragOrder Links={items()} />
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div class="border-r p-1 fixed left-0 top-0 w-[180px] h-screen border-[#69696951]">
      <div class="h-[90px]"></div>
      <div class="hover:bg-neutral-800 rounded-md px-4 p-2">sidebar</div>
    </div>
  )
}
