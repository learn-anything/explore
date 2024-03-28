import { Show, createSignal } from "solid-js"
import { Motion, Presence } from "solid-motionone"

interface Props {
  name: string
  link?: string
}

export default function ProfileLink(props: Props) {
  const [hoveredLink, setHoveredLink] = createSignal(false)
  const [expandLink, setExpandLink] = createSignal(false)
  return (
    <div class="w-full bg-white/[0.01] rounded-md p-2 pl-4">
      <div
        onClick={() => {
          setExpandLink(true)
        }}
        onmouseenter={() => {
          setHoveredLink(true)
        }}
        onmouseleave={() => {
          setHoveredLink(false)
        }}
        class=" flex-between"
      >
        <div class="flex gap-2 items-center">
          <div class="font-bold">{props.name}</div>
          <div class="opacity-40 text-[14px]">{props.link}</div>
        </div>
        <div class=" flex gap-2">
          <Show when={hoveredLink()}>
            <Motion.div
              animate={{
                transform: ["translate(10px)", "translate(0px)"]
              }}
              class="bg-[#708F51] bg-opacity-[0.08] text-[#708F51] rounded-md flex-center p-2 px-3"
            >
              Complete
            </Motion.div>
          </Show>
          <div class="bg-neutral-800/40 px-3 p-2 rounded-md text-white/60">
            Javascript
          </div>
        </div>
      </div>
      <Show when={expandLink()}>
        <div class="pt-2">
          <textarea
            placeholder="Take a note..."
            rows="3"
            class="w-full bg-transparent outline-none font-bold text-[14px]"
          ></textarea>
          <div class="opacity-40 font-light text-[14px] p-1">
            Connected topics
          </div>
          <div class="flex-between">
            <div class="flex gap-1">
              <div class="bg-neutral-800 rounded-md p-2 px-3 w-fit text-white/50">
                NixOS
              </div>
              <div class="bg-neutral-800 rounded-md p-2 px-3 w-fit text-white/50">
                Nix on MacOS
              </div>
            </div>
            <div class="bg-neutral-800 rounded-md p-2 px-3 w-fit text-white/50">
              Done
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
