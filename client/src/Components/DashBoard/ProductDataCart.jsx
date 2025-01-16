import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../Redux/Slice/ProductSlice";

export const ProductsCart = ({
  products,
  fetchProducts,
  totalPages,
  currentPage,
}) => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      fetchProducts(page);
    }
  };
  useEffect(() => {
    setProductData([...products]);
  }, [products]);
  const handleDeleteProduct = async (productId) => {
    if (!productId) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!isConfirmed) return;

    try {
      await dispatch(DeleteProduct(productId));
      toast.success("Product deleted successfully");

      navigate(-1);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };
  async function handelChangeStock(data) {
    if (data.stock == "In stock") {
      setProductData((prevData) =>
        prevData.map((product) =>
          product._id === data.id
            ? {
                ...product,
                stock: "Out stock",
              }
            : product
        )
      );
    } else {
      setProductData((prevData) =>
        prevData.map((product) =>
          product._id === data.id
            ? {
                ...product,
                stock: "In stock",
              }
            : product
        )
      );
    }
    await dispatch(
      updateProduct({
        id: data.id,
        data: { stock: data.stock == "In stock" ? "Out stock" : "In stock" },
      })
    );
  }
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <section className="overflow-x-auto bg-white shadow-md rounded-lg dark:bg-gray-800">
        <table className="w-full  ">
          <thead className="bg-gray-200 dark:bg-gray-500">
            <tr>
              <th className="p-2">No.</th>
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {productData.map((product, index) => (
              <tr key={product._id}>
                <td className="p-2">#{index + 1}</td>
                <td>
                  <img
                    onClick={() =>
                      window.open(`/product/${product._id}`, "_blank")
                    }
                    className="p-2 w-20 h-20 rounded-xl cursor-pointer"
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
                <td
                  onClick={() =>
                    handelChangeStock({
                      id: product._id,
                      stock: product?.stock,
                    })
                  }
                  title="click to change stock"
                  className={`p-2 ${
                    product?.stock == "In stock"
                      ? "text-green-400 hover:text-red-500"
                      : "text-red-400 hover:text-green-500"
                  }  cursor-pointer `}
                >
                  {product?.stock}
                </td>
                <td className="p-2">₹{product.price}</td>
                <td className="p-2">
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => handleDeleteProduct(product._id)}
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
  );
};
