interface Props {
  img: string
}
import { useParams } from "solid-start"

export default function UserPage(props: Props) {
  const params = useParams()
  return (
    <div class="w-full h-full flex gap-6 items-center flex-col bg-gray-50 rounded-xl">
      <div class="flex flex-col gap-5 items-center bg-gray-100 w-full rounded-xl p-10 border-2 border-gray-200 justify-center">
        <div class="h-24 w-24 flex items-center justify-center border-gray-200 border-2 rounded-full">
          <img src={props.img} alt="" class="rounded-full" />
        </div>
        <div class="font-bold text-lg">{params.username}</div>
      </div>
      <div class="border-2 border-gray-200 gap-2 p-4 flex flex-col bg-gray-100 rounded-xl h-full w-full">
        <div class="w-full bg-gray-200 p-1 px-4 rounded-lg">bake a pie</div>
        <div class="w-full bg-gray-200 p-1 px-4 rounded-lg">learn react</div>
      </div>
    </div>
  )
}
