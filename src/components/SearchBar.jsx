import React from "react";

const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="🔍 Search meals..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-80 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  );
};

export default SearchBar;