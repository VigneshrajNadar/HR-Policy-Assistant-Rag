import api from "../services/api";

export async function askQuestion(question, history = []) {

    const response = await api.post(
        "/chat",
        {
            question,
            history
        }
    );

    return response.data;

}
