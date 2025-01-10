import { useState } from "react";
import { FaCircleXmark } from "react-icons/fa6";

export const Category = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState("");
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    if (categories.some((cat) => cat.name === newCategory)) {
      alert("Category already exists");
      return;
    }

    setCategories((prev) => [
      ...prev,
      { name: newCategory, subCategories: [] },
    ]);
    setNewCategory("");
  };
  function handelClickToRemove(category) {
    const userConfirmed = confirm(`Remove this category: ${category}?`);
    if (!userConfirmed) return;

    const updatedCategories = categories.filter((cat) => cat !== category);
    setCategories(updatedCategories);
  }
  return (
    <div className="mb-8 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-6">
        {/* Add Category Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Add Category
          </h3>
          <form
            onSubmit={handleAddCategory}
            className="flex flex-col gap-4 sm:flex-row sm:gap-6"
          >
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="px-4  py-2 dark:bg-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </form>
        </div>

        {/* Add Subcategory Form */}
      </div>

      {/* Display Current Categories */}
      <div className="mt-6 ">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Current Categories
        </h3>
        <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category, i) => (
            <div
              key={i}
              className=" relative p-4 border border-gray-300 dark:bg-gray-700 rounded-lg shadow-sm"
            >
              <h4 className="font-medium text-gray-900 dark:text-white">
                {category}
              </h4>
              <p className="cursor-pointer  absolute top-0 text-red-500  right-0 pr-2 pt-2">
                <FaCircleXmark
                  size={20}
                  onClick={() => handelClickToRemove(category)}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
