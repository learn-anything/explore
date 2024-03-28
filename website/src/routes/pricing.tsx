import { ui } from "@la/shared"

import { createSignal } from "solid-js"
import clsx from "clsx"
import Nav from "../components/Nav"

export default function Pricing() {
  return (
    <div
      class="w-screen"
      style={{
        background:
          "radial-gradient(ellipse 190% 90% at top, rgba(25, 53, 92, 1) 0%, rgba(23, 23, 23, 0.8) 32%)",
        color: "white",
        height: "100vh",
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center"
      }}
    >
      <Nav />
      <div class="w-full h-full flex flex-col items-center md:p-[90px] p-[14px] py-[40px] mt-[90px]">
        <div class="flex flex-col gap-2 items-center justify-center">
          <div>{/* <ui.Icon name="Heart" border="white" /> */}</div>
          <div
            class="md:text-[40px] text-[20px] font-bold text-opacity-[0.32] text-white"
            style={{
              background: "linear-gradient(#ffffff, #2358E0)",

              "background-clip": "text"
            }}
          >
            Become a member
          </div>
          <div class="opacity-40 mb-10 md:text-[16px] text-[14px] text-center px-[26px]">
            Unlock premium features and help us build the future of education
            together
          </div>
        </div>
        <Card />
      </div>
    </div>
  )
}

function Card() {
  const [shownPlan, setShownPlan] = createSignal("Monthly")
  return (
    <div
      class="md:w-[500px] w-full p-[2px] rounded-[20px]"
      style={{
        background:
          "linear-gradient(rgba(35, 88, 224, 0.32), rgba(255, 255, 255, 0.32))"
      }}
    >
      <div class="bg-[#171717] p-[20px] col-gap-[28px] rounded-[20px]">
        <div class="w-full  flex-center flex-col gap-[16px]">
          <div class="text-[14px] font-bold">Membership</div>
          <div class="text-[60px] font-bold">
            $8<span class="text-[14px] font-light opacity-40">/mo</span>
          </div>
          <div class="bg-[#252525] rounded-[10px] p-0.5 flex gap-1">
            <div
              class={clsx(
                "p-1 px-2 rounded-[10px]",
                shownPlan() === "Yearly" && "bg-[#171717]"
              )}
              onClick={() => {
                setShownPlan("Yearly")
              }}
            >
              Yearly
            </div>
            <div
              class={clsx(
                "p-1 px-2 rounded-[10px]",
                shownPlan() === "Monthly" && "bg-[#171717]"
              )}
              onClick={() => {
                setShownPlan("Monthly")
              }}
            >
              Monthly
            </div>
          </div>
        </div>
        <div class="col-gap-[8px] text-[14px] opacity-40">
          <div class="flex">
            <ui.Icon name="Checkmark" />
            See in full 1,100+ hight quality guides on various topics.
          </div>
          <div class="flex">
            <ui.Icon name="Checkmark" />
            Mark any topic as learned / to learn / learning.
          </div>
          <div class="flex">
            <ui.Icon name="Checkmark" />
            Mark any link you find in LA as completed or to complete later.
          </div>
          <div class="flex">
            <ui.Icon name="Checkmark" />
            Add your own links and track progress on them.
          </div>
          <div class="flex">
            <ui.Icon name="Checkmark" />
            Publish your notes to your own personal wiki page.
          </div>
          <div class="flex">
            <ui.Icon name="Checkmark" />
            Sync all your notes with a mobile app (beta).
          </div>
          <div class="flex">
            <ui.Icon name="Checkmark" />
            Ai interface to all your notes (beta).
          </div>
        </div>
        <div class="font-bold text-[14px] col-gap-[16px]">
          <ui.MainButton label="Join for $96/year" />
          <div class="text-[14px] opacity-40 font-light w-full flex-center">
            Refund Policy
          </div>
        </div>
      </div>
    </div>
  )
}
