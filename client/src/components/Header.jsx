export default function Header() {
    return (
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-8 py-5 flex justify-between items-center shrink-0 transition-colors duration-300">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Academic Risk Advisor</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Confidence-aware student risk assessment for informed intervention</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    <iconify-icon icon="solar:bell-linear" width="20" stroke-width="1.5"></iconify-icon>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    <iconify-icon icon="solar:question-circle-linear" width="20" stroke-width="1.5"></iconify-icon>
                </button>
            </div>
        </header>
    );
}
