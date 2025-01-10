import { useState } from "react";

export const ProductsCart = ({
  showProduct,
  products,
  fetchProducts,

  totalPages,
  currentPage,
}) => {
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      fetchProducts(page);
    }
  };
  return (
    <>
      {showProduct && (
        <>
          <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
          <section className="overflow-x-auto bg-white shadow-md rounded-lg dark:bg-gray-800">
            <table className="w-full  ">
              <thead className="bg-gray-200 dark:bg-gray-500">
                <tr>
                  <th className="p-2">No.</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td className="p-2">#{index + 1}</td>
                    <td>
                      <img
                        className="p-2 w-20 h-20 rounded-xl"
                        src={
                          product?.image?.secure_url
                            ? product?.image?.secure_url
                            : product?.images[0]?.secure_url
                        }
                        crossOrigin="anonymous"
                        alt={product.name}
                      />
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">₹{product.price}</td>
                    <td className="p-2">
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded"
                        onClick={() => handleProductDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-1 space-x-2 mb-6 ">
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
                      ? "bg-blue-300 text-white"
                      : "bg-white text-blue-400 border-blue-600"
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
          </section>
        </>
      )}
    </>
  );
};
