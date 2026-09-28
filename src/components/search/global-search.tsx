import { Search } from "lucide-react";

import { useGlobalSearch } from "../../hooks/use-global-search";

export default function GlobalSearch() {
  const {
    query,
    setQuery,
    isFocused,
    setIsFocused,
    selectedIndex,
    setSelectedIndex,
    filteredItems,
    inputRef,
    selectItem,
  } = useGlobalSearch();

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex h-10 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition-all focus-within:border-accent focus-within:bg-white">
        <Search size={18} className="text-slate-400" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder="Search tools, datasets..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />

        {!isFocused && (
          <kbd className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">
            Ctrl K
          </kbd>
        )}
      </div>

      {isFocused && filteredItems.length > 0 && (
        <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {filteredItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => selectItem(item)}
                className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-accent-soft"
                    : "hover:bg-slate-50"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    index === selectedIndex ? "text-accent" : "text-slate-500"
                  }
                />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {item.title}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
