import { Circle, Library } from "lucide-react";

function Header({ onToggleLibrary, viewLabel = "Home" }) {

    return (

        <header className="shrink-0 border-b border-[#d8dde5] bg-white/95 backdrop-blur">

            <div className="flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-8">

                <div className="flex min-w-0 items-center gap-3">

                    <button
                        type="button"
                        onClick={onToggleLibrary}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#d8dde5] bg-white text-[#24211f] shadow-sm transition hover:border-[#b25b32] hover:text-[#b25b32] sm:hidden"
                        title="Open document library"
                        aria-label="Open document library"
                    >
                        <Library size={18} />
                    </button>

                    <div className="min-w-0">

                        <h1 className="truncate text-base font-semibold tracking-normal text-[#24211f] md:text-lg">
                            HR Policy Assistant
                        </h1>

                        <div className="hidden items-center gap-2 text-xs font-medium text-[#667085] sm:mt-1 sm:flex">
                            <Circle size={8} className="fill-emerald-500 text-emerald-500" />
                            {viewLabel}
                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={onToggleLibrary}
                    className="hidden h-10 items-center gap-2 rounded-lg border border-[#d8dde5] bg-white px-3 text-sm font-medium text-[#24211f] shadow-sm transition hover:border-[#b25b32] hover:text-[#b25b32] sm:inline-flex lg:hidden"
                >
                    <Library size={16} />
                    Library
                </button>

            </div>

        </header>

    );

}

export default Header;

