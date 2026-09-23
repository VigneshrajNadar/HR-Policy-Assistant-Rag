import { useState } from "react";
import { FileText, Loader2, RefreshCw, Trash2 } from "lucide-react";

import { deleteUpload, rebuildIndex } from "../../api/uploadApi";

function KnowledgeBasePanel({

    uploads = [],

    loadingUploads = false,

    errorMessage = "",

    disabled = false,

    onRefresh,

    onChanged,

    onRebuild

}) {

    const [deletingFile, setDeletingFile] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [rebuilding, setRebuilding] = useState(false);

    const handleDelete = async (filename) => {

        if (disabled || deletingFile) return;

        setDeletingFile(filename);
        setDeleteError("");

        try {

            await deleteUpload(filename);

            await onChanged?.();

        } catch (error) {

            setDeleteError("Delete failed. Please try again.");

        } finally {

            setDeletingFile("");

        }

    };

    const handleRebuild = async () => {

        if (disabled || rebuilding) return;

        setRebuilding(true);
        setDeleteError("");

        try {

            await rebuildIndex();

            await onRebuild?.();

            await onRefresh?.();

        } catch (error) {

            setDeleteError("Rebuild failed. Please try again.");

        } finally {

            setRebuilding(false);

        }

    };

    return (

        <section className="rounded-lg border border-[#d8dde5] bg-white p-4 shadow-sm">

            <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                    <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8493]">
                        Knowledge Base
                    </div>

                    <div className="mt-1 text-sm text-[#667085]">
                        {loadingUploads ? "Refreshing PDFs..." : `${uploads.length} PDF${uploads.length === 1 ? "" : "s"} available`}
                    </div>

                </div>

                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={handleRebuild}
                        disabled={loadingUploads || rebuilding || disabled}
                        className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#cfd6df] bg-white px-3 text-xs font-semibold text-[#24211f] shadow-sm transition hover:border-[#b25b32] hover:text-[#b25b32] disabled:cursor-not-allowed disabled:opacity-60"
                        title="Rebuild index"
                        aria-label="Rebuild index"
                    >
                        {rebuilding ? <Loader2 size={15} className="animate-spin" /> : "Rebuild"}
                    </button>

                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={loadingUploads}
                        className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#cfd6df] bg-white px-2.5 text-[#24211f] shadow-sm transition hover:border-[#b25b32] hover:text-[#b25b32] disabled:cursor-not-allowed disabled:opacity-60"
                        title="Refresh PDFs"
                        aria-label="Refresh PDFs"
                    >
                        <RefreshCw size={15} className={loadingUploads ? "animate-spin" : ""} />
                    </button>

                </div>

            </div>

            {(errorMessage || deleteError) && (

                <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {deleteError || errorMessage}
                </div>

            )}

            <div className="mt-3 grid max-h-[42dvh] gap-2 overflow-y-auto pr-1">

                {uploads.length === 0 && !loadingUploads && (

                    <div className="rounded-lg border border-dashed border-[#d8dde5] bg-[#fbfcfd] px-3 py-4 text-sm text-[#7a8493]">
                        No PDFs uploaded yet.
                    </div>

                )}

                {uploads.map((item) => (

                    <div
                        key={item.filename}
                        className="grid gap-2 rounded-lg border border-[#d8dde5] bg-white p-3 shadow-sm"
                    >

                        <div className="flex min-w-0 items-center gap-2">
                            <FileText size={15} className="shrink-0 text-[#b25b32]" />
                            <span className="truncate text-sm font-semibold text-[#24211f]">
                                {item.filename}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleDelete(item.filename)}
                            disabled={disabled || deletingFile === item.filename}
                            className="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-[#efd3d3] bg-[#fff7f7] px-2.5 text-xs font-medium text-[#b42318] transition hover:border-[#e6a9a9] hover:bg-[#ffecec] disabled:cursor-not-allowed disabled:opacity-60"
                            title={`Delete ${item.filename}`}
                        >
                            {deletingFile === item.filename ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                            Delete
                        </button>

                    </div>

                ))}

            </div>

        </section>

    );

}

export default KnowledgeBasePanel;
