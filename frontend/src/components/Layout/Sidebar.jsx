import {
    BotMessageSquare,
    ChevronsLeft,
    ChevronsRight,
    FileText,
    Home,
    Settings2,
    ShieldCheck,
    Sparkles,
    X
} from "lucide-react";

import KnowledgeBasePanel from "../KnowledgeBase/KnowledgeBasePanel";
import UploadPdf from "../Upload/UploadPdf";

const NAV_ITEMS = [
    { label: "Home", value: "home", icon: Home },
    { label: "Knowledge Base", value: "knowledge", icon: FileText },
    { label: "Settings", value: "settings", icon: Settings2 }
];

function Sidebar({

    activeView = "home",

    open = false,

    collapsed = false,

    uploads = [],

    uploadsLoading = false,

    uploadsError = "",

    uploadProcessing = false,

    onClose,

    onToggleCollapse,

    onNavigate,

    onProcessingChange,

    onRefresh,

    onRebuild

}) {

    const desktopWidth = collapsed ? "lg:w-20" : "lg:w-[360px]";
    const mobilePosition = open ? "translate-x-0" : "-translate-x-full lg:translate-x-0";
    const showKnowledgeControls = activeView === "knowledge";

    return (

        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[min(92vw,360px)] shrink-0 flex-col border-r border-[#d8dde5] bg-[#e9edf2] shadow-xl transition-[transform,width] duration-200 lg:relative lg:z-auto lg:shadow-none ${desktopWidth} ${mobilePosition}`}>

            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#d8dde5] bg-white px-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#24211f] text-white shadow-sm">
                    <BotMessageSquare size={21} />
                </div>

                <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
                    <div className="truncate text-sm font-semibold text-[#24211f]">HR Assistant</div>
                    <div className="text-xs text-[#667085]">Company Policy Agent</div>
                </div>

                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d8dde5] bg-white text-[#5f6672] shadow-sm transition hover:border-[#b25b32] hover:text-[#b25b32] lg:inline-flex"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d8dde5] bg-white text-[#5f6672] shadow-sm transition hover:border-[#b25b32] hover:text-[#b25b32] lg:hidden"
                    title="Close sidebar"
                    aria-label="Close sidebar"
                >
                    <X size={17} />
                </button>

            </div>

            <div className={`hidden flex-1 flex-col items-center gap-3 px-3 py-4 ${collapsed ? "lg:flex" : ""}`}>

                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#d8dde5] bg-white text-[#b25b32] shadow-sm transition hover:border-[#b25b32]"
                    title="Open sidebar"
                    aria-label="Open sidebar"
                >
                    <Sparkles size={19} />
                </button>

                <div className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#667085] shadow-sm ring-1 ring-[#d8dde5]">
                    {NAV_ITEMS.length}
                </div>

            </div>

            <div className={`min-h-0 flex-1 overflow-y-auto p-4 ${collapsed ? "lg:hidden" : ""}`}>

                <div className="mb-4 min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8493]">
                        Navigation
                    </div>
                    <div className="mt-1 text-sm text-[#667085]">
                        Switch between chat, document management, and settings.
                    </div>
                </div>

                <div className="space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.value;

                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => onNavigate?.(item.value)}
                                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left shadow-sm transition ${isActive ? "border-[#b25b32] bg-white text-[#24211f]" : "border-[#d8dde5] bg-white/80 text-[#667085] hover:border-[#b25b32] hover:text-[#24211f]"}`}
                            >
                                <Icon size={17} className={isActive ? "text-[#b25b32]" : ""} />
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold">{item.label}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {showKnowledgeControls && (
                    <div className="mt-4 space-y-4">

                        <UploadPdf
                            disabled={uploadProcessing}
                            onProcessingChange={onProcessingChange}
                            onUploaded={onRefresh}
                        />

                        <KnowledgeBasePanel
                            uploads={uploads}
                            loadingUploads={uploadsLoading}
                            errorMessage={uploadsError}
                            disabled={uploadProcessing}
                            onRefresh={onRefresh}
                            onChanged={onRefresh}
                            onRebuild={onRebuild}
                        />

                    </div>
                )}

                {!showKnowledgeControls && (
                    <div className="mt-4 rounded-2xl border border-[#d8dde5] bg-white p-4 shadow-sm">

                        <div className="flex items-center gap-2 text-sm font-semibold text-[#24211f]">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            Grounded answers
                        </div>

                        <div className="mt-1 text-xs leading-5 text-[#667085]">
                            Your uploaded HR documents stay indexed in Chroma and the selected model only answers from retrieved policy context.
                        </div>

                    </div>
                )}

            </div>

            <div className={`shrink-0 border-t border-[#d8dde5] bg-[#e9edf2] p-4 ${collapsed ? "lg:hidden" : ""}`}>

                <div className="rounded-lg border border-[#d8dde5] bg-white p-3 shadow-sm">

                    <div className="flex items-center gap-2 text-sm font-semibold text-[#24211f]">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        Fixed embedding model
                    </div>

                    <div className="mt-1 text-xs leading-5 text-[#667085]">
                        MiniLM L6 v2 embeddings are used for local document vectorization.
                    </div>

                </div>

            </div>

        </aside>

    );

}

export default Sidebar;