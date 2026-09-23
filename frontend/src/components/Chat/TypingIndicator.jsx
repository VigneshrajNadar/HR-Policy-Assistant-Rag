import { Bot } from "lucide-react";

function TypingIndicator() {

    return (

        <div className="flex justify-start gap-3">

            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#d8dde5] bg-[#ffffff] text-[#b25b32] shadow-sm">
                <Bot size={17} />
            </div>

            <div className="rounded-2xl rounded-bl-md border border-[#d8dde5] bg-[#ffffff] px-4 py-3 shadow-sm">

                <div className="flex items-center gap-2 text-sm font-medium text-[#667085]">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#b25b32]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#c88a4c] [animation-delay:120ms]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#24211f] [animation-delay:240ms]"></span>
                    <span className="ml-1">Thinking</span>
                </div>

            </div>

        </div>

    );

}

export default TypingIndicator;