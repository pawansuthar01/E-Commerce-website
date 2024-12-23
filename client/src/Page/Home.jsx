import React, { useEffect, useState } from "react";
import Layout from "../layout/layout";
import ProductCard from "../Components/productCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../Redux/Slice/ProductSlice";
import { celebrities } from "../constants/Homecarousellist";
import CarouselSlide from "../Components/CarouselSlice";
import LoginPrompt from "../Components/loginProment";
import FeedbackForm from "../Components/feedbackfrom";
import FeedbackList from "../Components/feedbackList";
import { getAllCarousel } from "../Redux/Slice/CarouselSlice";

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(1); // Start from 1 (middle of the duplicated slides)
  const [isAnimating, setIsAnimating] = useState(true); // Control animation
  const [loading, setLoading] = useState(true); // Loader state
  const [show, setShow] = useState(false);
  const [oneTime, setOneTime] = useState(true);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const [carousel, SetCarousel] = useState([]);
  const { product, topProducts } = useSelector((state) => state.product);
  const [products, setProducts] = useState([]);
  const [topProduct, setTopProduct] = useState([]);
  const Carousel = useSelector((state) => state.carousel.Carousel);
  useEffect(() => {
    if (Carousel.length === 0) {
      SetCarousel(celebrities);
    } else {
      SetCarousel(Carousel);
    }
  }, [Carousel]);
  useEffect(() => {
    if (products.length == 0 || topProduct.length == 0) {
      setProducts(product);
      setTopProduct(topProducts);
    }
  }, [product]);
  const ProductLoad = async () => {
    setLoading(true);
    if (Carousel?.length == 0) {
      await dispatch(getAllCarousel());
    }
    if (product.length == 0) {
      await dispatch(getAllProduct({ page: 1, limit: 25 }));
    }
    setLoading(false);
  };
  const handleProductDelete = (productId) => {
    console.log(productId);
    setProducts((prev) => prev.filter((product) => product._id !== productId));
    setTopProduct((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (oneTime && !isLoggedIn) {
        setShow(true);
        setOneTime(false);
      }
    }, 10000);
  }, [show]);

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
        setCurrentSlide(carousel?.length);
      }, 700);
    } else if (currentSlide === carousel?.length + 1) {
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
                image={carousel[carousel?.length - 1]?.images[0]?.secure_url}
                title={carousel[carousel?.length - 1]?.name}
                description={carousel[carousel?.length - 1]?.description}
              />
              {carousel?.map((slide, index) => (
                <CarouselSlide
                  key={index}
                  image={slide?.images[0]?.secure_url}
                  title={slide?.name}
                  description={slide?.description}
                />
              ))}
              <CarouselSlide
                key="first-duplicate"
                image={carousel[0]?.images[0]?.secure_url}
                title={carousel[0]?.name}
                description={carousel[0]?.description}
              />
            </div>
          </div>

          <div className="flex w-full justify-center gap-2 py-2 flex-wrap">
            {carousel?.map((_, index) => (
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
          <h2 className="text-2xl font-bold mb-4 dark:text-white text-black">
            Popular Products
          </h2>
          <div className="flex justify-evenly overflow-y-scroll hide-scrollbar  scrollbar-width-thin flex-shrink gap-6 w-full">
            {Array.isArray(topProduct) &&
              topProduct?.length > 0 &&
              topProduct?.map((product, ind) => (
                <ProductCard
                  data={product}
                  key={ind}
                  className="relative group w-full"
                  onProductDelete={handleProductDelete}
                />
              ))}
          </div>
        </div>

        {/* More Products Section */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold mb-4 dark:text-white text-black">
            More Products
          </h2>
          <div className="flex flex-wrap justify-evenly gap-6 my-6 w-full">
            {Array.isArray(products) &&
              products?.length > 0 &&
              products?.map((product, ind) => (
                <ProductCard
                  data={product}
                  key={ind}
                  className="relative group"
                  onProductDelete={handleProductDelete}
                />
              ))}
          </div>
        </div>
        <div className="w-full mb-10 ">
          <hr className="h-1 bg-slate-200" />
          <h1 className="text-2xl mt-10 font-bold mb-4 ml-10 text-start dark:text-white text-black">
            feedback Section
          </h1>
          <FeedbackForm />
          <FeedbackList />
        </div>
        {show && <LoginPrompt show={show} setShow={setShow} />}
      </div>
    </Layout>
  );
}

export default HomePage;
