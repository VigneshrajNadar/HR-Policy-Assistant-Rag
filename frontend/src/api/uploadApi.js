import api from "../services/api";

export async function uploadPdf(file) {

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
        "/upload",
        formData
    );

    return response.data;

}

export async function listUploads() {

    const response = await api.get("/uploads");

    return response.data;

}

export async function deleteUpload(filename) {

    const response = await api.delete(
        `/uploads/${encodeURIComponent(filename)}`
    );

    return response.data;

}

export async function rebuildIndex() {

    const response = await api.post(
        "/uploads/rebuild",
        null
    );

    return response.data;

}