import React from "react";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";

function ProductCard({ image, description, name, price }) {
  return (
    <div className="w-[250px] max-sm:w-[150px]  max-sm:h-[200px] flex flex-col h-[300px] cursor-pointer ">
      <section className="relative h-full flex justify-center rounded-lg p-5 w-[90%] bg-[#ece6d8] group">
        <img src={image} alt="product_image" className="object-contain" />

        <div className="absolute inset-0 bg-opacity-50 flex items-end pb-3 justify-center space-x-4 max-sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <button className="text-white text-2xl focus:outline-none transform opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-00">
            <FiShoppingCart className="bg-black p-2 rounded-lg w-[36px] h-[36px] max-sm:h-[32px] max-sm:w-[32px]" />
          </button>
          <button className="text-white text-2xl focus:outline-none transform opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-200">
            <FiEye className="bg-black p-2 rounded-lg" size={36} />
          </button>
          <button className="text-white text-2xl focus:outline-none transform opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-300">
            <FiHeart className="bg-black p-2 rounded-lg" size={36} />
          </button>
        </div>
      </section>

      <h1 className="text-black text-center capitalize font-semibold mt-3">
        {name}
      </h1>
      <p className="font-serif text-black text-center">{price}</p>
    </div>
  );
}

export default ProductCard;
