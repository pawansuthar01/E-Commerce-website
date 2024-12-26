import React from "react";

function ProductImage({ image }) {
  return (
    <div className="relative h-64 overflow-hidden bg-gray-100">
      <img
        src={image}
        alt="Product"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export default ProductImage;
