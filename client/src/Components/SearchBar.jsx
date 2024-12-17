import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const SearchBar = ({ onSearch, width }) => {
  const [query, setQuery] = useState(""); // User input
  const [suggestions, setSuggestions] = useState([]);
  const products = useSelector((state) => state.product.product); // Assuming products are stored in state.product.products

  useEffect(() => {
    const fetchSuggestions = () => {
      if (query.trim() === "") {
        setSuggestions([]); // Clear suggestions if query is empty
        return;
      }

      const filteredSuggestions = products?.filter((product) => {
        const regex = new RegExp(query, "i"); // Case-insensitive search
        return (
          product.name.match(regex) ||
          product.price <= parseInt(query.split("under")[1]?.trim(), 10)
        );
      });

      setSuggestions(filteredSuggestions);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query, products]); // Depend on both query and products

  // Handle search button click
  const handleSearchClick = () => {
    if (query.trim()) {
      setSuggestions([]);
      onSearch(query); // Trigger search with current query
    }
  };

  return (
    <div
      className={`relative ${!width && "max-sm:hidden"} flex ${
        width ? width : "w-full"
      } mx-auto justify-center`}
    >
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium dark:text-white text-gray-900 sr-only"
      >
        Search
      </label>
      <div className={`relative ${width ? width : "w-1/2"}`}>
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 dark:text-gray-400 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="w-[100%] p-4 ps-10 text-sm outline-none dark:text-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 bg-gray-50 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search products..."
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query as user types
          required
        />
        <button
          type="submit"
          onClick={handleSearchClick} // Trigger search on click
          className="text-white absolute end-2.5 bottom-2.5 dark:bg-blue-600 bg-blue-700 border-blue-700 hover:bg-transparent hover:text-blue-700 hover:border-2 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>

      {query && suggestions?.length > 0 && (
        <div className="absolute w-full bg-white border rounded max-h-40 overflow-x-auto shadow-md mt-10 z-10">
          {suggestions?.map((suggestion) => (
            <div
              key={suggestion._id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSuggestions([]);
                setQuery(suggestion.name);
                onSearch(suggestion.name, suggestion.price); // Pass both name and price when suggestion is clicked
              }}
            >
              {suggestion.name} under ₹{suggestion.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
