interface Props {
  action: string
  keybind: string
}

export default function Keybind(props: Props) {
  return (
    <>
      <style>
        {`
         #action {
          text-align: start;
          display: flex;
            justify-content: start;
        }
        #keybind {
          display: flex;
          justify-content: end;
        }
        #actionWrapper {
           
          display: flex;
          justify-content: start;
        }
         @media (min-width:600px) {
          #action {
            text-align: end;
            display: flex;
            justify-content: start;
          }
          #keybind {
            display: flex;
            justify-content: start;
          }
          #actionWrapper { 
            display: flex;
            justify-content: end;
          }
         }
      `}
      </style>
      <div class="flex justify-start gap-5 p-1 text-lg">
        <div id="actionWrapper" class="flex justify-end  w-full">
          <div id="action" class="flex justify-end items-center text-end">
            {props.action}
          </div>
        </div>
        <div id="keybind" class="w-full flex font-bold ">
          <div
            class="bg-white rounded-lg p-0.5 text-black px-3 flex items-center justify-center"
            style={{
              border: "solid 1px black",
              "border-bottom": "solid 3px black",
              "font-size": "10px",
              height: "28px",
              width: "fit-content",
            }}
          >
            {props.keybind}
          </div>
        </div>
      </div>
    </>
  )
}
