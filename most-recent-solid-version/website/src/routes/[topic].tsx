import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import { EditorContent, createEditor } from "tiptap-solid"
import { Sidebar } from "../../components/Sidebar"

export default function Topic() {
	Placeholder.configure({
		emptyEditorClass: "my-custom-is-empty-class",
		placeholder: "Write what",
	})
	const textEditor = createEditor({
		extensions: [Placeholder, StarterKit],
		editorProps: {
			attributes: {
				class: "focus:outline-none p-4",
			},
		},
	})

	return (
		<div class="ml-[200px] p-3 h-screen">
			<Sidebar personalPages={[]} />
			<div class=" border border-[#191919] rounded-[7px] h-full">
				<EditorContent editor={textEditor()} />
			</div>
		</div>
	)
}
