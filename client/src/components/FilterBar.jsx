export default function FilterBar({ sortBy, onSortChange, searchTerm, onSearchChange }) {
    return (
        <div className="bg-slate-100/50 dark:bg-slate-900/50 p-2 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-200/60 dark:border-slate-800">
            <div className="bg-gray-200/50 dark:bg-slate-800 p-1 rounded-lg flex text-sm font-medium">
                <button
                    onClick={() => onSortChange('risk')}
                    className={`px-4 py-1.5 rounded-md transition-all ${sortBy === 'risk'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-gray-200 dark:border-slate-600'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Sort by Risk Score
                </button>
                <button
                    onClick={() => onSortChange('confidence')}
                    className={`px-4 py-1.5 rounded-md transition-all ${sortBy === 'confidence'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-gray-200 dark:border-slate-600'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Sort by Confidence
                </button>
            </div>
            <div className="relative w-full md:w-72">
                <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></iconify-icon>
                <input
                    type="text"
                    placeholder="Search student ID or name..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-700 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
            </div>
        </div>
    );
}
