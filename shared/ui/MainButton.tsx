interface Props {
  label: string
}

export function MainButton(props: Props) {
  return (
    <>
      <div
        class=" rounded-[10px] border border-white text-black"
        style="background: linear-gradient(rgb(255, 255, 255), rgb(210, 210, 210)); filter: drop-shadow(rgb(0, 0, 0) 0px 4px 6px);"
      >
        <div
          class="w-full h-full p-[8px] px-[14px] flex-center"
          style="background: linear-gradient(rgba(255, 255, 255, 0), rgba(35, 88, 224, 0.125));"
        >
          {props.label}
        </div>
      </div>
    </>
  )
}
