import { Setter, Show } from "solid-js"
import Icon from "./Icon"
import { useTodoList } from "~/GlobalContext/todo-list"
import { useUser } from "~/GlobalContext/user"

interface Props {
  setShow: Setter<string>
  breakPoint: boolean
  setShowSidebar: Setter<boolean>
}

export default function AccountPage(props: Props) {
  const todoList = useTodoList()
  const user = useUser()

  return (
    <>
      <div class="w-full h-full">
        <div class="text-2xl p-9 font-bold">Account</div>
        <div class="flex flex-col gap-5 justify-center items-center">
          <div class="w-4/5 flex gap-8  border-b-2 pt-10 border-gray-300 border-opacity-50 pb-24 items-end justify-start">
            <div class="relative h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center">
              Img
              <div class="absolute top-0.5 right-0.5 h-6 w-6 bg-gray-100 border border-gray-300 rounded-full"></div>
            </div>
            <div class="w-1/2 h-full">
              <input
                type="text"
                placeholder="Name"
                class="bg-transparent border-b-2 w-full border-gray-300 py-0.5 px-1 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

{
  /* <Show
            when={
              new Date(user.user.paidSubscriptionValidUntilDate) > new Date()
            }
            fallback={
              <>
                <Show when={props.breakPoint}>
                  <div
                    class="absolute top-5 left-5"
                    onClick={() => {
                      props.setShowSidebar(true)
                    }}
                  >
                    <Icon name="Sidebar"></Icon>
                  </div>
                </Show>
                <div class="font-bold text-4xl">You are on free plan</div>
                <div class="opacity-60 flex flex-col items-center justify-center">
                  <div>
                    {5 - user.user.freeAiTasksAvailable}
                    /5 AI suggestions used
                  </div>
                  <div>{todoList.todos.length}/20 tasks used</div>
                </div>
                <button
                  class="flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 p-2 px-6 hover:opacity-60 rounded-2xl cursor-pointer"
                  onClick={() => props.setShow("Upgrade")}
                >
                  Upgrade
                </button>
              </>
            }
          >
            <div class="font-bold text-4xl">You are on paid plan. Enjoy!</div>
            <div class="opacity-60 flex flex-col items-center justify-center"></div>
          </Show> */
}
