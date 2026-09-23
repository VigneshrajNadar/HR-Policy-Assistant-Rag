import { ShieldCheck } from "lucide-react";

function SettingsPanel() {
    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f5f6f8] px-3 py-4 md:px-8 md:py-6">
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4">
                <section className="rounded-3xl border border-[#d8dde5] bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#24211f]">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        System Information
                    </div>
                    
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#24211f]">
                        HR Policy Assistant
                    </h2>
                    <p className="mt-2 mb-6 max-w-2xl text-sm leading-6 text-[#667085]">
                        The AI provider and credentials are securely managed by the application backend.
                    </p>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                            <dt className="text-sm font-medium text-[#7a8493]">AI Provider</dt>
                            <dd className="mt-1 text-sm text-[#24211f]">Groq</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-[#7a8493]">Embedding Model</dt>
                            <dd className="mt-1 text-sm text-[#24211f]">sentence-transformers/all-MiniLM-L6-v2</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-[#7a8493]">Vector Database</dt>
                            <dd className="mt-1 text-sm text-[#24211f]">ChromaDB</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-[#7a8493]">Architecture</dt>
                            <dd className="mt-1 text-sm text-[#24211f]">Retrieval-Augmented Generation (RAG)</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-[#7a8493]">Frontend</dt>
                            <dd className="mt-1 text-sm text-[#24211f]">React + Vite</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-[#7a8493]">Backend</dt>
                            <dd className="mt-1 text-sm text-[#24211f]">FastAPI</dd>
                        </div>
                    </dl>
                </section>
            </div>
        </main>
    );
}

export default SettingsPanel;