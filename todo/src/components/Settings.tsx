import clsx from "clsx"
import { Match, Show, Switch, createEffect, createSignal } from "solid-js"
import { TodoListMode, useTodoList } from "~/GlobalContext/todo-list"
import Instruction from "./HelpItem"
import Icon from "./Icon"
import Keybind from "./Keybind"
import { useUser } from "~/GlobalContext/user"
import { StripeDocument } from "~/graphql/schema"
import AccountPage from "./AccountPage"

export default function Settings() {
  const todoList = useTodoList()
  const user = useUser()
  const initial = todoList.getModeData(TodoListMode.Settings)
  const [show, setShow] = createSignal(
    initial?.settingsState ? initial.settingsState : "Account",
  )
  const [showSidebar, setShowSidebar] = createSignal(true)
  const [breakPoint, setBreakPoint] = createSignal(false)
  createEffect(() => {
    showSidebar()
    if (window.innerWidth < 600) {
      setBreakPoint(true)
    } else {
      setBreakPoint(false)
    }
  })
  return (
    <>
      <style>
        {`
        #Plan:hover {
          border: solid 3px rgba(147, 197, 253, 0.5);
          transition: all 1s ease-out;
        }
        #Plan {
          border: solid 3px rgba(200,200,200, 0.5);
          transition: all 1s ease-out;
        }
        #Sidebar {
          border-right: solid 3px rgba(200,200,200, 0.5);
          position: absolute;
          height: 100vh;
          width: 100vw;
          bottom: 0;
          right: 0;
          z-index: 100;

        }
        #helpNav {
          border-bottom: solid 3px rgba(200,200,200, 0.5),
          font-size: 20px;

        }
        #helpWrapper {
          border-bottom: solid 3px rgba(200,200,200, 0.5);
        }
        #helpTitle {
          border-right: solid 3px rgba(200,200,200, 0.5);
          padding-top: 10px;
          padding-bottom: 10px;

        }
        #instructions {
          border-bottom: solid 3px rgba(200,200,200, 0.5)
        }
        #help {
          border: solid 3px rgba(200,200,200, 0.5)
        }
        #tooltip {
          border: solid 2px rgba(200,200,200, 0.5)
        }
        #helpBorder {
          border-right: solid 3px rgba(200,200,200, 0.5)
        }
        @media (prefers-color-scheme: dark) {
          #Plan {
            border: solid 3px rgba(43, 43, 43, 0.5);
          }
          #tooltip {
            border: solid 2px rgba(43, 43, 43, 0.5);
          }
          #Sidebar {
            border-right: solid 3px rgba(43, 43, 43, 0.5);
          }
          #help {

            border: solid 3px rgba(43, 43, 43, 0.5);
          }
          #helpNav {
            border-bottom: solid 3px rgba(43, 43, 43, 0.5)
          }
          #helpTitle {
            border-right: solid 3px rgba(43, 43, 43, 0.5);

          }
          #helpWrapper {
            border-bottom: solid 3px rgba(43, 43, 43, 0.5)
          }
          #instructions {
            border-bottom: solid 3px rgba(43, 43, 43, 0.5)
          }
          #helpBorder {
            border-right: solid 3px rgba(43, 43, 43, 0.5)
          }
        }
        #Plans {
          display: flex;
          flex-direction: column;
        }
        #Plan {
          height: 250px;
        }
        #DisabledPlan {
            border: solid 3px rgba(200,200,200, 0.5);
            transition: all 1s ease-out;
        }

        #DisabledPlan:hover {
          border: solid 3px rgba(200,200,200, 0.5);
          opacity: 0.5;

        }
        @media (min-width:1100px) {
          #Plans {
            display: flex;
            flex-direction: row;
          }
        }
        #keyboardCuts {
          display: flex;
          justify-content: center;
          flex-direction: column;
          padding-left: 40px;
          padding-right: 40px;
        }
        @media (min-width:600px) {
          #keyboardCuts {
            display: flex;
            justify-content: center;
            flex-direction: row
          }
          #Plan {
            height: 100%;
          }
          #helpNav {
            font-size: 20px;

          }
          #helpTitle{
            padding-top: 24px;
            padding-bottom: 24px;
          }
          #Sidebar {
            position: static;
            width: 16%;
          }
        }
        #SwitchOn {
          display: flex;
          justify-content: start;

        }
        #SwitchOff {
          display: flex;
          justify-content: end;
        }
        @media (max-width: 640px) {
          #overflowKeyboard {
            overflow-y: scroll;
            height: 100vh; /* Adjust the height as needed */
          }
        }

      `}
      </style>
      <div class="flex flex-col h-full w-full">
        <div>
          <div
            class="cursor-pointer opacity-60 absolute top-4 right-4"
            onClick={() => todoList.setMode(TodoListMode.Default)}
          >
            <Icon name="Cross" />
          </div>
        </div>
        <div class="flex h-full w-full">
          <Show when={showSidebar()}>
            <div
              class="flex justify-between flex-col dark:bg-stone-900 bg-gray-100 pr-1"
              style={{
                "min-width": "150px",
              }}
              id="Sidebar"
            >
              <div>
                <div>
                  <div
                    class=" p-5  flex items-center justify-between"
                    style={{ height: "104.22px" }}
                  >
                    <div
                      class="font-bold flex items-center "
                      style={{ "font-size": "28px" }}
                    >
                      Settings
                    </div>
                  </div>
                  <div
                    class="p-2 pt-0 pr-0 pl-3 flex flex-col  gap-1"
                    style={{ "font-size": "18px", "margin-right": "-6px" }}
                  >
                    <div
                      class={clsx(
                        "cursor-pointer",
                        show() === "Keyboard" &&
                          "font-bold text-blue-300 border-r-4 border-blue-300",
                      )}
                      onClick={() => {
                        setShow("Keyboard")
                        if (breakPoint()) {
                          setShowSidebar(false)
                        }
                      }}
                    >
                      Keyboard
                    </div>
                    <div
                      class={clsx(
                        "cursor-pointer",
                        show() === "Account" &&
                          "font-bold text-blue-300 border-r-4 border-blue-300",
                      )}
                      onClick={() => {
                        setShow("Account")
                        if (breakPoint()) {
                          setShowSidebar(false)
                        }
                      }}
                    >
                      Account
                    </div>
                    <div
                      class={clsx(
                        "cursor-pointer",
                        show() === "Help" &&
                          "font-bold text-blue-300 border-r-4 border-blue-300",
                      )}
                      onClick={() => {
                        setShow("Help")
                        if (breakPoint()) {
                          setShowSidebar(false)
                        }
                      }}
                    >
                      Help
                    </div>
                    <div
                      class={clsx(
                        "cursor-pointer",
                        show() === "Upgrade" &&
                          "font-bold text-blue-300 border-r-4 border-blue-300",
                      )}
                      onClick={() => {
                        setShow("Upgrade")
                        if (breakPoint()) {
                          setShowSidebar(false)
                        }
                      }}
                    >
                      Upgrade
                    </div>
                    {/* <div
                      class={clsx(
                        "cursor-pointer",
                        show() === "Options" &&
                          "font-bold text-blue-300 border-r-4 border-blue-300"
                      )}
                      onClick={() => {
                        setShow("Options")
                        if (breakPoint()) {
                          setShowSidebar(false)
                        }
                      }}
                    >
                      Options
                    </div> */}
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <div class="flex gap-5 justify-between pl-4 pr-3">
                  <div class="has-tooltip relative">
                    <a
                      class="p-2 h-full flex justify-center items-center text-xl rounded-3xl transition-all hover:opacity-60 cursor-pointer"
                      href={"https://github.com/learn-anything/todo/issues"}
                      target="_blank"
                      id="help"
                    >
                      <Icon name="Bug"></Icon>
                    </a>
                    <div
                      class="tooltip shadow-lg p-1 bg-gray-100 dark:bg-stone-900 top-3 left-4 -mt-12 text-gray-500 dark:white text-sm flex items-center px-3 gap-1 font-bold"
                      style={{
                        "border-radius": "25px",
                        "transition-delay": "0.5s",
                        width: "120px",
                      }}
                      id="tooltip"
                    >
                      Report a Bug
                    </div>
                  </div>
                  {/* TODO: add discord icon */}
                  <div class="has-tooltip relative">
                    <a
                      class="p-2 h-full flex justify-center items-center text-2xl rounded-3xl transition-all hover:opacity-60 cursor-pointer"
                      href={"https://discord.gg/f8YHjyrX3h"}
                      target="_blank"
                      id="help"
                    >
                      <Icon name="Question"></Icon>
                    </a>
                    <div
                      class="tooltip shadow-lg p-1 bg-gray-100 dark:bg-stone-900 top-3 right-4 -mt-12 text-gray-500 dark:text-white text-sm flex items-center px-3 gap-1 font-bold"
                      style={{
                        "border-radius": "25px",
                        "transition-delay": "0.5s",
                        width: "132 px",
                      }}
                      id="tooltip"
                    >
                      Ask on Discord
                    </div>
                  </div>
                </div>
                <div
                  class="flex cursor-pointer self-center pb-4 text-xl text-red-500 font-bold"
                  onClick={() => {
                    // TODO: sign out with hanko, clear cookie?
                  }}
                >
                  Sign out
                </div>
              </div>
            </div>
          </Show>
          <div class=" h-full w-full">
            <Switch>
              <Match when={show() === "Preferences"}>
                {/* <div
          class="cursor-pointer"
          onClick={() => {
            // TODO: add maybe..
          }}
        >
          Hide action bar
        </div> */}
              </Match>
              <Match when={show() === "Keyboard"}>
                <div class=" overflow-auto" id="overflowKeyboard">
                  <div class="flex items-center">
                    <Show when={breakPoint()}>
                      <div
                        class="pl-5"
                        onClick={() => {
                          setShowSidebar(true)
                        }}
                      >
                        <Icon name="Sidebar"></Icon>
                      </div>
                    </Show>
                    <div class="font-bold p-7" style={{ "font-size": "28px" }}>
                      Keyboard Shortcuts
                    </div>
                  </div>
                  <div
                    class="h-full w-full flex  justify-center  overflow-scroll"
                    style={{ gap: "10%" }}
                    id="keyboardCuts"
                  >
                    <div>
                      <h1 class="text-xl font-bold py-4">Essential</h1>
                      <Keybind action="Create new todo" keybind="n" />
                      <Keybind action="Edit todo" keybind="return" />
                      <Keybind
                        action="Search todos for current view (All/Today/Starred)"
                        keybind="f"
                      />
                      <Keybind action="Delete todo" keybind="Backspace" />
                      <Keybind action="Change priority to 1" keybind="1" />
                      <Keybind action="Change priority to 2" keybind="2" />
                      <Keybind action="Change priority to 3" keybind="3" />
                      <Keybind action="Star/Unstar" keybind="4" />
                      <Keybind
                        action="Create subtasks from a task"
                        keybind="a"
                      />
                      <Keybind
                        action="Focus on task below"
                        keybind="Down arrow"
                      />
                      <Keybind action="Change to All" keybind="Control + 1" />
                      <Keybind action="Change to Today" keybind="Control + 2" />
                      <Keybind
                        action="Change to Starred"
                        keybind="Control + 3"
                      />
                      <Keybind action="Change to Done" keybind="Control + 4" />
                    </div>
                    <div>
                      <h1 class="text-xl font-bold py-4 ">
                        Inside suggested tasks view
                      </h1>
                      <Keybind
                        action="Move suggested task to subtask"
                        keybind="Return"
                      />
                    </div>
                  </div>
                </div>
              </Match>
              <Match when={show() === "Account"}>
                <div class="w-full h-full">
                  <AccountPage
                    setShowSidebar={setShowSidebar}
                    setShow={setShow}
                    breakPoint={breakPoint()}
                  />
                </div>
              </Match>
              <Match when={show() === "Help"}>
                <div class="w-full h-full flex flex-col items-center justify-between overflow-auto">
                  <div class="overflow-scroll h-full w-full flex flex-col justify-center">
                    <div
                      id="helpWrapper"
                      class="w-full flex"
                      style={{ height: "10%" }}
                    >
                      <div class="flex" style={{ "min-width": "20%" }}>
                        <div
                          class="flex items-center p-6 pl-4 gap-5"
                          id="helpTitle"
                          style={{ width: "100%", "min-width": "160px" }}
                        >
                          <Show when={breakPoint()}>
                            <div
                              onClick={() => {
                                setShowSidebar(true)
                              }}
                            >
                              <Icon name="Sidebar"></Icon>
                            </div>
                          </Show>
                          <div
                            class="font-bold grow"
                            style={{
                              "font-size": "36px",
                            }}
                          >
                            Help
                          </div>
                        </div>
                      </div>
                      <div
                        class="flex items-center justify-center h-full"
                        style={{ width: "100%" }}
                      >
                        <div class="flex items-center justify-center w-full grow h-full">
                          <Icon name={"Keyboard"} />
                        </div>
                        <div class="flex items-center justify-center w-full grow h-full">
                          <Icon name={"Cursor"} />
                        </div>
                      </div>
                    </div>
                    <div
                      class="flex flex-col h-full w-full overflow-auto"
                      id="instructions"
                    >
                      <Instruction
                        problem="Adding a task"
                        keyboardInstruction="Press n key"
                        mouseInstruction="Press on plus button on bottom with a mouse"
                      />
                      <Instruction
                        problem="Adding a subtask"
                        keyboardInstruction="When a task or subtask is focused, press l key"
                        mouseInstruction="Right click on a task and select 'Add subtask'"
                      />
                      <Instruction
                        problem="Changing focus between tasks"
                        keyboardInstruction="Use up and down arrow keys to move focus between"
                        mouseInstruction="Press on a task with a mouse"
                      />
                      <Instruction
                        problem="Edit a task"
                        keyboardInstruction="If task is focused, pressing `return` key will start
                editing it"
                        mouseInstruction="Press on a focused task again with a mouse
                to start editing it"
                      />
                      <Instruction
                        problem="Search tasks"
                        keyboardInstruction="If not editing any tasks, pressing f key will start
                searching tasks currently in view. Start typing the task
                you want to jump to, potential results will be
                highlighted. Use up and down arrow keys to move focus
                between results. Pressing return will switch focus to
                the task."
                        mouseInstruction="Start start search by pressing the search icon in
                bottom left"
                      />
                      <Instruction
                        problem="Edit note of a task"
                        keyboardInstruction="When editing a title of the task, can press down arrow
                to start editing a note. Can press up arrow to start
                editing title again."
                        mouseInstruction="Press on the note part of the todo and start editing the note"
                      />
                      <Instruction
                        problem="Edit priority of a task"
                        keyboardInstruction="Press 1, 2 or 3 to change priority when task is focused"
                        mouseInstruction="When editing a task, press on the priority icon to change priority"
                      />
                      <Instruction
                        problem="Star a task"
                        keyboardInstruction="Press 4 to change between star/unstarred when task is focused"
                        mouseInstruction="When editing a task, press on the priority icon to change starred/unstarred"
                      />
                      <Instruction
                        problem="Do AI suggestions for task"
                        keyboardInstruction="Press a key when task is focused. You will see a loading indicator and then the suggestions will appear"
                        mouseInstruction=""
                      />
                    </div>
                  </div>
                </div>
              </Match>
              <Match when={show() === "Upgrade"}>
                <div class="overflow-auto w-full h-full">
                  <div class="flex flex-col">
                    <div class="flex items-center gap-5  p-7">
                      <div
                        onClick={() => {
                          setShowSidebar(true)
                        }}
                      >
                        <Icon name="Sidebar"></Icon>
                      </div>
                      <div
                        class="font-semibold"
                        style={{ "font-size": "32px" }}
                      >
                        Upgrade
                      </div>{" "}
                    </div>
                  </div>
                  <div class="w-full h-full px-5 flex flex-col gap-5 overflow-scroll pb-5">
                    <div id="Plans" class="flex gap-5">
                      <div
                        id={false ? "Plan" : "DisabledPlan"}
                        class={clsx(
                          "relative rounded-xl flex flex-col h-full w-full p-6 px-10 gap-2 hover:text-blue-300  hover:opacity-60 cursor-pointer",
                          true && "opacity-50 hover:text-white",
                        )}
                        style={{ height: "200px" }}
                        onClick={async () => {
                          // let disabled = true
                          const res = await todoList.request(StripeDocument, {
                            plan: "normalMonth",
                            userId: user.user.id!,
                          })
                          const stripeCheckout =
                            res.user?.stripe?.stripeCheckoutUrl
                          if (stripeCheckout) {
                            window.location.href = stripeCheckout
                          }
                          // if (!disabled) {
                          // }
                        }}
                      >
                        <div
                          class="font-semibold "
                          style={{ "font-size": "24px" }}
                        >
                          General Plan
                        </div>
                        <Show when={true}>
                          <div class="absolute top-3 right-3 font-bold ">
                            {/* <div class="flex items-center justify-center">
                              In use
                            </div> */}
                          </div>
                        </Show>
                        <div class="opacity-60">
                          <div class="flex items-center gap-1 ">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>Unlimited Todos</div>
                          </div>
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>Unlimited AI</div>
                          </div>
                        </div>
                        <div class="absolute bottom-2 gap-1 right-5 flex items-center">
                          <span
                            style={{ "font-size": "28px" }}
                            class="font-bold"
                          >
                            $10
                          </span>
                          <span class="opacity-60 font-bold">per month</span>
                        </div>
                      </div>

                      <div
                        id="Plan"
                        class="relative rounded-xl flex flex-col h-full w-full p-6 px-10 gap-2 hover:text-blue-500 hover:opacity-60 cursor-pointer"
                        onClick={async () => {
                          const res = await todoList.request(StripeDocument, {
                            plan: "normalYear",
                            userId: user.user.id!,
                          })

                          const stripeCheckout =
                            res.user?.stripe?.stripeCheckoutUrl
                          if (stripeCheckout) {
                            window.location.href = stripeCheckout
                          }
                        }}
                        style={{ height: "200px" }}
                      >
                        <div class="flex items-center gap-2">
                          <div
                            class="font-semibold"
                            style={{ "font-size": "24px" }}
                          >
                            General
                          </div>
                          <div
                            class="absolute top-3 right-3 bg-gray-200 dark:bg-neutral-800 rounded-lg px-2 flex items-center justify-center"
                            style={{ height: "30px" }}
                          >
                            -20%
                          </div>
                        </div>
                        <div class="opacity-60">
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>Unlimited Todos</div>
                          </div>
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>Unlimited AI</div>
                          </div>
                        </div>
                        <div class="absolute bottom-2 gap-1 right-5 flex items-center">
                          <span
                            style={{ "font-size": "28px" }}
                            class="font-bold"
                          >
                            $100
                          </span>
                          <span class="opacity-60 font-bold">per Year</span>
                        </div>
                      </div>
                    </div>
                    <div id="Plans" class="flex gap-5">
                      <div
                        style={{ height: "200px" }}
                        id="Plan"
                        class="relative rounded-xl flex flex-col h-full w-full p-6 px-10 gap-2 hover:text-blue-500 hover:opacity-60 cursor-pointer"
                        onClick={async () => {
                          const res = await todoList.request(StripeDocument, {
                            plan: "proMonth",
                            userId: user.user.id!,
                          })

                          const stripeCheckout =
                            res.user?.stripe?.stripeCheckoutUrl
                          if (stripeCheckout) {
                            window.location.href = stripeCheckout
                          }
                        }}
                      >
                        <div
                          class="font-semibold"
                          style={{ "font-size": "24px" }}
                        >
                          Premium Plan
                        </div>
                        <div class="opacity-60">
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>Unlimited Todos</div>
                          </div>
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>Unlimited AI (GPT-3)</div>
                          </div>
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>1500 state of the art AI tasks (GPT-4)</div>
                          </div>
                        </div>
                        <div class="absolute bottom-2 gap-1 right-5 flex items-center">
                          <span
                            style={{ "font-size": "28px" }}
                            class="font-bold"
                          >
                            $25
                          </span>
                          <span class="opacity-60 font-bold">per month</span>
                        </div>
                      </div>
                      <div
                        style={{ height: "200px" }}
                        id="Plan"
                        class="relative rounded-xl flex flex-col h-full w-full p-6 px-10 gap-2 hover:text-blue-500 hover:opacity-60 cursor-pointer"
                        onClick={async () => {
                          const res = await todoList.request(StripeDocument, {
                            plan: "proYear",
                            userId: user.user.id!,
                          })
                          const stripeCheckout =
                            res.user?.stripe?.stripeCheckoutUrl
                          if (stripeCheckout) {
                            window.location.href = stripeCheckout
                          }
                        }}
                      >
                        <div
                          class="font-semibold"
                          style={{ "font-size": "24px" }}
                        >
                          Premium Yearly Plan
                        </div>
                        <div
                          class="absolute top-3 right-3 bg-gray-200 dark:bg-neutral-800 rounded-lg px-2 flex items-center justify-center"
                          style={{ height: "30px" }}
                        >
                          -20%
                        </div>
                        <div class="opacity-60">
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>Unlimited Todos</div>
                          </div>
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>Unlimited AI (GPT-3)</div>
                          </div>
                          <div class="flex items-center gap-1">
                            <Icon name="Circle" width="8px" height="8px"></Icon>{" "}
                            <div>1500 state of the art AI tasks (GPT-4)</div>
                          </div>
                        </div>
                        <div class="absolute bottom-2 gap-1 right-5 flex items-center">
                          <span
                            style={{ "font-size": "28px" }}
                            class="font-bold"
                          >
                            $250
                          </span>
                          <span class="opacity-60 font-bold">per Year</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Match>
              <Match when={show() === "Options"}>
                <div class="w-full">
                  <div class="font-bold p-5" style={{ "font-size": "32px" }}>
                    Options
                  </div>

                  <div
                    class=" flex flex-col w-full items-center justify-center"
                    style={{
                      "padding-left": "200px",
                      "padding-right": "200px",
                      "padding-top": "50px",
                    }}
                  >
                    <div class="flex justify-between w-full items-center">
                      <div>title</div>
                      <div
                        id={false ? "SwitchOn" : "SwitchOff"}
                        class={clsx(
                          "rounded-xl p-1 border flex items-center border-white bg-blue-500 opacity-90",
                          true && "",
                        )}
                        style={{ width: "36px" }}
                      >
                        <div class="rounded-xl bg-white p-1.5 flex justify-center items-center"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </>
  )
}
