import React from "react";
import { formatPrice } from "./format";

function ProductInfo({ product }) {
  return (
    <div className="space-y-6 ">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {product.name}
      </h1>
      <p className="text-xl text-gray-600 dark:text-white">
        {product.description}
      </p>
      <div className="flex items-baseline">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
}

export default ProductInfo;
