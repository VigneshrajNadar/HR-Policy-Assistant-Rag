import { useRef, useState } from "react";
import { FileUp, Loader2, Upload } from "lucide-react";

import { uploadPdf } from "../../api/uploadApi";

function isPdfFile(file) {

    if (!file) return false;

    const fileName = file.name.toLowerCase();

    return file.type === "application/pdf" || fileName.endsWith(".pdf");

}

function UploadPdf({ onProcessingChange, onUploaded, disabled = false }) {

    const inputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("Choose a PDF to add to the library.");
    const [uploading, setUploading] = useState(false);

    const setProcessingState = (value) => {

        onProcessingChange?.(value);

    };

    const handleBrowseClick = () => {

        inputRef.current?.click();

    };

    const handleFileChange = (event) => {

        const file = event.target.files?.[0] ?? null;

        if (!file) {
            setSelectedFile(null);
            setMessage("Choose a PDF to add to the library.");
            return;
        }

        if (!isPdfFile(file)) {
            setSelectedFile(null);
            setMessage("Only PDF files are supported.");
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
        setMessage(`Ready: ${file.name}`);

    };

    const handleUpload = async () => {

        if (!selectedFile || uploading || disabled) return;

        setUploading(true);
        setProcessingState(true);
        setMessage("Indexing PDF...");

        try {

            const response = await uploadPdf(selectedFile);

            setMessage(`${response.filename} indexed. ${response.chunks} chunks ready.`);
            setSelectedFile(null);

            if (inputRef.current) {
                inputRef.current.value = "";
            }

            await onUploaded?.();

        } catch (error) {

            const apiMessage = error?.response?.data?.detail;

            setMessage(apiMessage || "Upload failed. Please try again.");

        } finally {

            setUploading(false);
            setProcessingState(false);

        }

    };

    return (

        <section className="rounded-lg border border-[#d8dde5] bg-white p-4 shadow-sm">

            <div className="flex items-center gap-2 text-sm font-semibold text-[#24211f]">
                <Upload size={16} className="text-[#b25b32]" />
                Upload PDF
            </div>

            <p className="mt-1 text-sm leading-6 text-[#667085]">
                Add a policy document for indexing.
            </p>

            <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="mt-4 grid grid-cols-2 gap-2">

                <button
                    type="button"
                    onClick={handleBrowseClick}
                    disabled={disabled}
                    className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-[#cfd6df] bg-white px-3 text-sm font-medium text-[#24211f] shadow-sm transition hover:border-[#b25b32] hover:text-[#b25b32] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FileUp size={16} className="shrink-0" />
                    <span className="truncate">Choose</span>
                </button>

                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading || disabled}
                    className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg bg-[#24211f] px-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#3a352f] disabled:cursor-not-allowed disabled:bg-[#b8c0cc]"
                >
                    {uploading ? <Loader2 size={16} className="shrink-0 animate-spin" /> : null}
                    <span className="truncate">Upload</span>
                </button>

            </div>

            <div className="mt-3 rounded-lg border border-[#e3e7ee] bg-[#fbfcfd] px-3 py-2 text-sm leading-6 text-[#667085]">
                {message}
            </div>

            {selectedFile && (

                <div className="mt-2 truncate text-xs font-medium text-[#7a8493]">
                    {selectedFile.name}
                </div>

            )}

        </section>

    );

}

export default UploadPdf;
