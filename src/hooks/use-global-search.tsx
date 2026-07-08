import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { searchItems } from "../constants/search-items";

export function useGlobalSearch() {
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];

    const keyword = query.toLowerCase();

    return searchItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.keywords.some((k) => k.toLowerCase().includes(keyword))
      );
    });
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    inputRef.current?.blur();
  }, []);

  const selectItem = useCallback(
    (item: (typeof searchItems)[number]) => {
      navigate(item.path);
      clearSearch();
    },
    [navigate, clearSearch],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K / Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();

        inputRef.current?.focus();
        inputRef.current?.select();

        return;
      }

      // Esc
      if (e.key === "Escape") {
        clearSearch();
        return;
      }

      if (!isFocused) return;

      if (filteredItems.length === 0) return;

      // Arrow Down
      if (e.key === "ArrowDown") {
        e.preventDefault();

        setSelectedIndex((prev) =>
          prev === filteredItems.length - 1 ? 0 : prev + 1,
        );

        return;
      }

      // Arrow Up
      if (e.key === "ArrowUp") {
        e.preventDefault();

        setSelectedIndex((prev) =>
          prev === 0 ? filteredItems.length - 1 : prev - 1,
        );

        return;
      }

      // Enter
      if (e.key === "Enter") {
        e.preventDefault();

        const item = filteredItems[selectedIndex];

        if (!item) return;

        selectItem(item);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredItems, selectedIndex, isFocused, clearSearch, selectItem]);

  return {
    query,
    setQuery,

    isFocused,
    setIsFocused,

    selectedIndex,
    setSelectedIndex,

    filteredItems,

    inputRef,

    clearSearch,
    selectItem,
  };
}
