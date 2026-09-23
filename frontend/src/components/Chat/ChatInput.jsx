import { useState } from "react";
import { Send } from "lucide-react";

function ChatInput({ onSend, disabled = false, disabledMessage = "" }) {

    const [text, setText] = useState("");

    const handleSend = () => {

        if (!text.trim() || disabled) return;

        onSend(text);

        setText("");

    };

    const handleKeyDown = (event) => {

        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }

    };

    return (

        <div className="shrink-0 border-t border-[#d8dde5] bg-[#ffffff] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:px-6 md:py-4">

            <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-[#cfd6df] bg-white p-2 shadow-sm transition focus-within:border-[#b25b32] focus-within:ring-4 focus-within:ring-[#b25b32]/10 md:gap-3">

                <textarea

                    value={text}

                    onChange={(event) =>
                        setText(event.target.value)
                    }

                    onKeyDown={handleKeyDown}

                    placeholder={disabledMessage || "Ask your HR question..."}

                    rows={1}

                    disabled={disabled}

                    className="max-h-28 min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-[16px] leading-6 text-[#24211f] outline-none placeholder:text-[#9a938a] disabled:cursor-not-allowed md:max-h-36 md:min-h-11 md:px-3 md:py-3 md:text-[15px]"

                />

                <button

                    onClick={handleSend}

                    disabled={disabled || !text.trim()}

                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#24211f] text-white shadow-sm transition hover:bg-[#3a352f] disabled:cursor-not-allowed disabled:bg-[#b8c0cc] md:h-11 md:w-11"

                    title="Send"

                >

                    <Send size={19} />

                </button>

            </div>

            {disabledMessage && (
                <div className="mx-auto mt-2 max-w-4xl text-sm text-[#7a8493]">
                    {disabledMessage}
                </div>
            )}

        </div>

    );

}

export default ChatInput;