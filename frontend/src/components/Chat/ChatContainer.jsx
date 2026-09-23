import { useEffect, useRef, useState } from "react";

import { streamChat } from "../../api/chatStream";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

const STREAM_RENDER_DELAY_MS = 12;
const SOURCE_MARKER = "__CHAT_SOURCES__:";

function wait(ms) {

    return new Promise((resolve) => setTimeout(resolve, ms));

}

function createChatHistory(messages) {

    return messages
        .filter((message) => (
            (message.role === "user" || message.role === "assistant")
            && message.message?.trim()
        ))
        .slice(-8)
        .map((message) => ({
            role: message.role,
            message: message.message
        }));

}
function createMessageId() {

    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()}`;

}

function ChatContainer({

    inputDisabled = false

}) {

    const [messages, setMessages] = useState([
        {
            id: createMessageId(),
            role: "assistant",
            message:
                "Hello!\n\nI'm your HR Assistant.\nAsk me anything about company policies."
        }
    ]);

    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    }, [messages]);

    const sendMessage = async (text) => {

        if (!text.trim()) return;

        const requestHistory = createChatHistory(messages);

        const userMessage = {

            id: createMessageId(),
            role: "user",
            message: text

        };

        const assistantId = createMessageId();

        let aiMessage = {

            id: assistantId,
            role: "assistant",
            message: "",
            sources: []

        };

        let aiMessageAdded = false;
        let receivedFirstText = false;
        let fullStreamText = "";
        let renderedLength = 0;
        let sources = [];

        const updateAssistantMessage = () => {

            if (!aiMessageAdded) {
                aiMessageAdded = true;

                setMessages((previous) => [

                    ...previous,

                    {
                        ...aiMessage
                    }

                ]);

                return;
            }

            setMessages((previous) => previous.map((message) => (
                message.id === assistantId
                    ? {
                        ...aiMessage
                    }
                    : message
            )));

        };

        const renderText = async (textToRender) => {

            if (!textToRender) return;

            if (!receivedFirstText) {
                setLoading(false);
                receivedFirstText = true;
            }

            for (const character of textToRender) {

                aiMessage.message += character;

                updateAssistantMessage();

                await wait(STREAM_RENDER_DELAY_MS);

            }

        };

        setMessages((previous) => [

            ...previous,

            userMessage

        ]);

        setLoading(true);

        try {

            const response = await streamChat(
                text,
                requestHistory
            );

            if (!response.ok || !response.body) {
                throw new Error("Streaming request failed");
            }

            const reader = response.body.getReader();

            const decoder = new TextDecoder();

            while (true) {

                const {
                    done,
                    value
                } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(

                    value,

                    {
                        stream: true
                    }

                );

                if (!chunk) continue;

                fullStreamText += chunk;

                const markerIndex = fullStreamText.indexOf(SOURCE_MARKER);

                const displayLimit = markerIndex === -1
                    ? Math.max(0, fullStreamText.length - SOURCE_MARKER.length)
                    : markerIndex;

                if (displayLimit > renderedLength) {

                    await renderText(
                        fullStreamText.slice(
                            renderedLength,
                            displayLimit
                        )
                    );

                    renderedLength = displayLimit;

                }

            }

            const markerIndex = fullStreamText.indexOf(SOURCE_MARKER);

            if (markerIndex === -1) {

                await renderText(
                    fullStreamText.slice(renderedLength)
                );

            } else {

                aiMessage.message = fullStreamText
                    .slice(0, markerIndex)
                    .trimEnd();

                const sourcesText = fullStreamText
                    .slice(markerIndex + SOURCE_MARKER.length)
                    .trim();

                if (sourcesText) {
                    sources = JSON.parse(sourcesText);
                }

                aiMessage.sources = sources;
                updateAssistantMessage();

            }

            if (!aiMessageAdded) {
                aiMessage.message = "I could not find a response.";
                updateAssistantMessage();
            }

        } catch (error) {

            if (aiMessageAdded) {
                aiMessage.message = "Something went wrong.";
                aiMessage.sources = [];
                updateAssistantMessage();
            } else {
                setMessages((previous) => [

                    ...previous,

                    {
                        id: assistantId,
                        role: "assistant",
                        message: "Something went wrong.",
                        sources: []
                    }

                ]);
            }

        }

        setLoading(false);

    };

    return (

        <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f5f6f8]">

            <div className="flex min-h-0 flex-1 flex-col">

                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-8 md:py-6">

                    <div className="mx-auto flex max-w-4xl flex-col gap-4 pb-2 md:gap-5">

                        {messages.map((message, index) => (

                            <ChatMessage
                                key={message.id ?? index}
                                role={message.role}
                                message={message.message}
                                sources={message.sources}
                            />

                        ))}

                        {loading && <TypingIndicator />}

                        <div ref={bottomRef}></div>

                    </div>

                </div>

                <ChatInput
                    onSend={sendMessage}
                    disabled={loading || inputDisabled}
                    disabledMessage={""}
                />

            </div>

        </main>

    );

}

export default ChatContainer;
