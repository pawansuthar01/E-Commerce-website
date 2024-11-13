import React, { useEffect, useState } from "react";
import Layout from "../layout/layout";
import { Link, useNavigate } from "react-router-dom";
import list from "../constants/productlist";
import ProductCard from "../Components/productCard";
import CarouselSlide from "../Components/CarouselSlice";
import { celebrities } from "../constants/Homecarousellist";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const UserId = useSelector((state) => state?.auth?.data?._id);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % celebrities.length);
    }, 3000); // Slide changes every 3 seconds

    return () => clearInterval(interval);
  }, [celebrities.length]);
  // useEffect(() => {
  //   const socket = io("http://localhost:5000");
  //   if (UserId != undefined) {
  //     socket.emit("join", UserId);
  //   }

  //   socket.on("newNotification", (message) => {
  //     // Show notification to the user
  //     alert(`Notification: ${message}`);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [UserId]);
  return (
    <Layout className="">
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
