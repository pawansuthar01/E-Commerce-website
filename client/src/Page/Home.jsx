import React, { useEffect, useState } from "react";
import Layout from "../layout/layout";
import { Link, useNavigate } from "react-router-dom";
import list from "../constants/productlist";
import ProductCard from "../Components/productCard";
import CarouselSlide from "../Components/CarouselSlice";
import { celebrities } from "../constants/Homecarousellist";

function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % celebrities.length);
    }, 3000); // Slide changes every 3 seconds

    return () => clearInterval(interval);
  }, [celebrities.length]);

  return (
    <Layout>
      <div className=" text-white top-[-64px]  justify-center  flex-col items-center   min-h-[90vh]  relative">
        <div className="w-full carousel">
          {celebrities &&
            celebrities.map((slide, inx) => (
              <CarouselSlide
                key={inx}
                image={slide.image}
                title={slide.title}
                slideNumber={inx}
                description={slide.description}
                isActive={inx === currentSlide}
              />
            ))}
        </div>
        <div className=" flex flex-wrap  max-sm:justify-center justify-evenly  gap-10 my-10">
          {list &&
            list.map((product, ind) => <ProductCard {...product} key={ind} />)}
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
