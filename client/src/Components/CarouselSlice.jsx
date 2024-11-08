function CarouselSlide({ image, title, slideNumber, description }) {
  const words = title.trim().split(" ");

  const lastWord = words.pop();
  const restOfString = words.join(" ");

  return (
    <div
      id={`slide${slideNumber}`}
      className=" relative carousel-item  max-sm:w-[100%] w-full max-sm:h-[400px] h-[450px] justify-center flex flex-row-reverse bg-gradient-to-r from-white via-[#ece6d8] to-whitecarousel-slide   transition-transform duration-800 ease-linear "
    >
      <div className=" absolute  max-sm:w-[150px] max-sm:h-[150px] w-[300px] h-[300px] max-sm:top-[30%]  sm:top-[15%] sm:right-[25%]  max-sm:right-[20%] rounded-full  z-0"></div>
      <div className="flex relative items-center justify-center mt-10  max-sm:h-[300px] w-1/2 px-5 z-999 rounded-r-3xl  ">
        <img src={image} className=" object-contain  h-[300px]" />
      </div>
      <div className=" relative z-0  max-sm:mt-5  flex flex-col  text-black items-start  justify-center w-1/2 max-sm:pl-6  sm:pl-10 capitalize">
        <h1 className="max-sm:text-2xl sm:text-5xl  tracking-[1px] ">
          {restOfString}
        </h1>
        <span className="font-semibold sm:text-6xl   max-sm:text-3xl">
          {lastWord}
        </span>
        <p className="w-[50%]  line-clamp-1  pt-2 ">{description}</p>
        <div className="pt-5 pl-6   flex max-sm:flex-col gap-2 sm:gap-10">
          <button className="  bg-[#9e6748]  hover:border-2 hover:border-[#9e6748] hover:bg-transparent px-1 sm:px-2 py-1 sm:py-2 rounded-sm text-white hover:text-[#9e6748] w-[100px] ">
            Shop now
          </button>
          <button className="  hover:bg-[#9e6748] border-2 border-[#9e6748] group-hover:bg-[#9e6748] sm:px-2 px-1 sm:py-2 py-1 rounded-sm hover:text-white text-[#9e6748] w-[100px]">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarouselSlide;
