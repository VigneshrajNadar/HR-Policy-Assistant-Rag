import { Bot, FileText, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessage({

    role,

    message,

    sources

}) {

    const isUser = role === "user";

    return (

        <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>

            {!isUser && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#d8dde5] bg-[#ffffff] text-[#b25b32] shadow-sm">
                    <Bot size={17} />
                </div>
            )}

            <div className={`flex max-w-[86%] flex-col ${isUser ? "items-end" : "items-start"} md:max-w-[74%]`}>

                <div
                    className={`rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-sm ${
                        isUser
                            ? "rounded-br-md bg-[#24211f] text-white"
                            : "rounded-bl-md border border-[#d8dde5] bg-[#ffffff] text-[#24211f]"
                    }`}
                >

                    <div className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : ""}`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ children }) => (
                                    <p className="my-0 whitespace-pre-wrap leading-7">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="my-2 list-disc pl-5">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="my-2 list-decimal pl-5">
                                        {children}
                                    </ol>
                                ),
                                table: ({ children }) => (
                                    <div className="my-3 overflow-x-auto rounded-lg border border-[#d8dde5]">
                                        <table className="min-w-full border-collapse bg-white">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                th: ({ children }) => (
                                    <th className="border-b border-[#d8dde5] bg-[#f1f3f6] px-3 py-2 text-left text-xs font-semibold uppercase tracking-normal">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="border-b border-[#e7ebf0] px-3 py-2 text-sm">
                                        {children}
                                    </td>
                                )
                            }}
                        >
                            {message}
                        </ReactMarkdown>
                    </div>

                </div>

                {!isUser && sources?.length > 0 && (

                    <div className="mt-3 w-full space-y-2">

                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8493]">
                            <FileText size={14} />
                            Sources
                        </div>

                        <div className="grid gap-2">
                            {sources.map((source, index) => (

                                <div
                                    key={index}
                                    className="rounded-lg border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#5f5a53] shadow-sm"
                                >
                                    {source}
                                </div>

                            ))}
                        </div>

                    </div>

                )}

            </div>

            {isUser && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#24211f] text-white shadow-sm">
                    <User size={16} />
                </div>
            )}

        </div>

    );

}

export default ChatMessage;