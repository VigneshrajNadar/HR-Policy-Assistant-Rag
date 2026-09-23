import api from "../services/api";

export async function streamChat(question, history = []) {

    return await fetch(
        `${api.defaults.baseURL}/chat/stream`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question,
                history
            })
        }
    );

}
