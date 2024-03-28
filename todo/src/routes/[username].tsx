import { useParams } from "solid-start"
import UserPage from "~/components/UserPage"
import UserSidebar from "~/components/UserSidebar"

export default function PublicProfile() {
  const params = useParams()
  const image = "https://avatars.githubusercontent.com/u/6391776?v=4"
  const todos = [
    {
      todo: "Build Learn Anything",
      note: "website to learn anything fast with help of AI/community",
    },
    {
      todo: "Build OneLog",
      note: "create chronological log of events across diffent networks",
    },
  ]
  return (
    <div class="w-screen p-5 gap-5 bg-gray-50 flex items-center justify-center h-screen">
      <div class="w-1/2 h-full">
        <UserSidebar></UserSidebar>
      </div>
      <div class="w-full h-full">
        {" "}
        <UserPage img={image}></UserPage>
      </div>
    </div>
  )
}
