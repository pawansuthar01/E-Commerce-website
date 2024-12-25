import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const SearchBar = ({ setQueryBarTitle, onSearch, width, TopMargin }) => {
  const [query, setQuery] = useState(setQueryBarTitle || "");
  const [show, setShow] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const products = useSelector((state) => state.product.product);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = () => {
      if (query.trim() == "") {
        setSuggestions([]);
        return;
      }

      const filteredSuggestions = products?.filter((product) => {
        const regex = new RegExp(query, "i");
        return (
          product.name.match(regex) ||
          product.price <= parseInt(query.split("under")[1]?.trim(), 10)
        );
      });

      setSuggestions(filteredSuggestions);
    };

    const debounce = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounce);
  }, [query, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => setShow(true);
  const handleBlur = () => {
    setTimeout(() => {
      if (!query) {
        setShow(false);
      }
    }, 300);
  };

  const handleSearchClick = () => {
    setShow(false);
    if (query.trim()) {
      setSuggestions([]);
      document.getElementById("defaultSearch").value = query;
      onSearch(query.trim()); // Trigger search with current query
    }
  };

  return (
    <div
      className={`relative ${!width && "max-sm:hidden"} flex ${
        width ? width : "w-full"
      } mx-auto justify-center ${TopMargin && TopMargin}`}
    >
      <label
        htmlFor="defaultSearch"
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
          id="defaultSearch"
          className="w-[100%] p-4 ps-10 text-sm outline-none dark:text-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 bg-gray-50 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search products..."
          autoComplete="off"
          value={query}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button
          type="submit"
          onClick={() => (handleSearchClick(), setSuggestions([]))}
          className="text-white absolute end-2.5 bottom-2.5 dark:bg-blue-600 bg-blue-700 border-blue-700 hover:bg-transparent hover:text-blue-700 hover:border-2 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>

      {query && show && suggestions?.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute w-full bg-white border rounded max-h-40 overflow-x-auto hide-scrollbar shadow-md mt-14 z-10 dark:text-white dark:bg-gray-700"
        >
          {suggestions?.map((suggestion) => (
            <div
              key={suggestion._id}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500"
              onClick={() => {
                const formattedQuery = `${suggestion.name} under ${suggestion.price}`;
                setSuggestions([]);
                setShow(false);
                setQuery(formattedQuery);
                onSearch(formattedQuery);
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
