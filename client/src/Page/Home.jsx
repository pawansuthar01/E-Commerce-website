import React, { useEffect, useState } from "react";
import Layout from "../layout/layout";
import ProductCard from "../Components/productCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../Redux/Slice/ProductSlice";
import CarouselSlide from "../Components/CarouselSlice";
import LoginPrompt from "../Components/loginProment";
import FeedbackForm from "../Components/feedbackfrom";
import FeedbackList from "../Components/feedbackList";
import { getAllCarousel } from "../Redux/Slice/CarouselSlice";

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState();
  const [isAnimating, setIsAnimating] = useState(true);
  const [loading, setLoading] = useState(true);
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
    SetCarousel(Carousel);
  }, [Carousel]);
  useEffect(() => {
    if (product.length == 0 || topProduct.length == 0) {
      setProducts(product);
      setTopProduct(topProducts);
    }
  }, [product]);
  const ProductLoad = async () => {
    setLoading(true);

    await dispatch(getAllCarousel());

    if (product.length == 0 || topProduct.length == 0) {
      await dispatch(getAllProduct({ page: 1, limit: 25 }));
    }
    setLoading(false);
  };
  const handleProductDelete = (productId) => {
    setProducts((prev) => prev.filter((product) => product._id !== productId));
    setTopProduct((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (!loading) {
        if (oneTime && !isLoggedIn) {
          setShow(true);
          setOneTime(false);
        }
      }
    }, 10000);
  }, [show, loading]);

  useEffect(() => {
    setCurrentSlide(1);
    if (!loading) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setCurrentSlide((prev) => prev + 1);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (currentSlide === 0) {
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentSlide(carousel?.length);
      }, 700);
    } else if (currentSlide === carousel?.length + 1) {
      const interval = setTimeout(() => {
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

          <div className="flex w-full justify-center gap-2 p-2 mb-2 flex-wrap">
            {carousel?.map((_, index) => (
              <button
                key={index}
                className={`  rounded-full p-1 border border-gray-500  dark:bg-gray-800  dark:text-white ${
                  currentSlide === index + 1 ? "bg-gray-500 " : "bg-[#dfacac]"
                }`}
                onClick={() => {
                  setIsAnimating(true);
                  setCurrentSlide(index + 1);
                }}
              ></button>
            ))}
          </div>
        </div>

        {/* Popular Products Section */}
        <div className="flex flex-col items-center max-w-xs:my-5 my-10 mx-1 w-full">
          <h2 className="text-2xl max-w-xs:text-xl max-w-xs:mb-2 font-bold mb-4 dark:text-white text-black">
            Popular Products
          </h2>
          <div className="flex justify-evenly overflow-y-scroll hide-scrollbar  scrollbar-width-thin flex-shrink max-w-xs:gap-2 gap-6 w-full">
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
          <h2 className="text-2xl font-bold mb-4 max-w-xs:text-xl max-w-xs:mb-2 dark:text-white text-black">
            More Products
          </h2>
          <div className="flex flex-wrap justify-evenly  max-w-xs:gap-1  gap-6 my-6 max-w-xs:my-2 w-full">
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
        <div className="w-full mb-10  max-w-xs:mb-0">
          <hr className="h-1 bg-slate-200" />
          <h1 className="text-2xl max-w-xs:mt-2 mt-10 font-bold mb-4 ml-10 max-w-xs:ml-0 max-w-xs:text-center  text-start dark:text-white text-black">
            Feedback Section
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
