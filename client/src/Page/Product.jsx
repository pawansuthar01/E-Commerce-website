import { useDispatch } from "react-redux";
import { getAllProduct } from "../Redux/Slice/ProductSlice";

import { useEffect, useState } from "react";
import ProductCard from "../Components/productCard";
import Layout from "../layout/layout";

function Product() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchProducts = async (page) => {
    setLoading(true);

    try {
      const response = await dispatch(
        getAllProduct({ page, limit: window.innerWidth > 760 ? "50" : "25" })
      );
      const { data, totalPages } = response.payload;
      setProducts(data); // Assuming response.payload has `data` and `totalPages`
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    fetchProducts(1); // Load the first page initially
  }, []);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      fetchProducts(page);
    }
  };

  return (
    <Layout>
      <div className="min-h-[100vh] ">
        <div className="sm:hidden  flex w-screen justify-center mt-4 ">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative w-full mx-10  ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none   ">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
              className="w-full p-4 ps-10 text-sm outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700  border-blue-700 hover:bg-transparent hover:text-blue-700 hover:border-2 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </div>
        <div className="container mx-auto ">
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : products.length > 0 ? (
            <>
              <div className=" flex flex-wrap  max-sm:justify-center justify-evenly  gap-10 my-10">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    data={product}
                    loadProduct={() => fetchProducts()}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap justify-center  space-x-2 space-y-2 mb-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 border rounded bg-white text-blue-500 border-blue-500"
                  >
                    Previous
                  </button>
                )}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 border rounded ${
                      index + 1 === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500 border-blue-500"
                    }`}
                    disabled={index + 1 === currentPage}
                  >
                    {index + 1}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 border rounded bg-white text-blue-500 border-blue-500"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">No products found.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
export default Product;
