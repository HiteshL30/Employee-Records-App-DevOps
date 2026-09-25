export default function SearchBar({
  search,
  setSearch,
  levelFilter,
  setLevelFilter,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1 16 0"
          />
        </svg>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or position..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>

      <select
        value={levelFilter}
        onChange={(e) => setLevelFilter(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      >
        <option value="All">All levels</option>
        <option value="Intern">Intern</option>
        <option value="Junior">Junior</option>
        <option value="Senior">Senior</option>
      </select>
    </div>
  );
}