import React, { useEffect, useState } from "react";
import Layout from "../layout/layout";
import ProductCard from "../Components/productCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../Redux/Slice/ProductSlice";
import { celebrities } from "../constants/Homecarousellist";
import CarouselSlide from "../Components/CarouselSlice";

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(1); // Start from 1 (middle of the duplicated slides)
  const [isAnimating, setIsAnimating] = useState(true); // Control animation
  const [loading, setLoading] = useState(true); // Loader state
  const dispatch = useDispatch();
  const { product, topProducts } = useSelector((state) => state.product);

  const ProductLoad = async () => {
    setLoading(true); // Start loading
    await dispatch(getAllProduct({ page: 1, limit: 25 }));
    setLoading(false); // End loading
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentSlide((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentSlide === 0) {
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentSlide(celebrities.length);
      }, 700);
    } else if (currentSlide === celebrities.length + 1) {
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentSlide(1);
      }, 700);
    }
  }, [currentSlide]);

  useEffect(() => {
    ProductLoad();
  }, []);

  if (loading) {
    // Full-page loader
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="text-white flex flex-col items-center min-h-[90vh] relative">
        {/* Carousel Section */}
        <div className="bg-[#fff5ee] dark:bg-[#1f2937] shadow-lg w-full">
          <div className="relative w-full overflow-hidden">
            <div
              className={`flex ${
                isAnimating
                  ? "transition-transform duration-700 ease-in-out"
                  : ""
              }`}
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              <CarouselSlide
                key="last-duplicate"
                image={celebrities[celebrities.length - 1].image}
                title={celebrities[celebrities.length - 1].title}
                description={celebrities[celebrities.length - 1].description}
              />
              {celebrities.map((slide, index) => (
                <CarouselSlide
                  key={index}
                  image={slide.image}
                  title={slide.title}
                  description={slide.description}
                />
              ))}
              <CarouselSlide
                key="first-duplicate"
                image={celebrities[0].image}
                title={celebrities[0].title}
                description={celebrities[0].description}
              />
            </div>
          </div>

          <div className="flex w-full justify-center gap-2 py-2 flex-wrap">
            {celebrities.map((_, index) => (
              <button
                key={index}
                className={`btn btn-xs dark:bg-gray-800 bg-white dark:text-white ${
                  currentSlide === index + 1
                    ? "btn-active dark:bg-gray-500"
                    : ""
                }`}
                onClick={() => {
                  setIsAnimating(true);
                  setCurrentSlide(index + 1);
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Products Section */}
        <div className="flex flex-col items-center my-10 w-full">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            Popular Products
          </h2>
          <div className="flex flex-wrap justify-evenly gap-6 w-full">
            {Array.isArray(topProducts) &&
              topProducts.length > 0 &&
              topProducts
                .slice(0, 5)
                .map((product, ind) => (
                  <ProductCard
                    data={product}
                    key={ind}
                    className="relative group"
                  />
                ))}
          </div>
        </div>

        {/* More Products Section */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            More Products
          </h2>
          <div className="flex flex-wrap justify-evenly gap-6 my-6 w-full">
            {Array.isArray(product) &&
              product.length > 0 &&
              product.map((product, ind) => (
                <ProductCard
                  data={product}
                  key={ind}
                  className="relative group"
                />
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
