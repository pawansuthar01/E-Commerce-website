function CarouselSlide({ image, title, slideNumber, description }) {
  const words = title.trim().split(" ");
  const lastWord = words.pop();
  const restOfString = words.join(" ");

  return (
    <div
      id={`slide${slideNumber}`}
      className="relative carousel-item max-sm:w-[100%] bg-[#f5f5f5] dark:bg-[#1a1a1a] w-full max-sm:h-[400px] h-[550px] justify-center flex flex-row-reverse transition-transform duration-800 ease-linear"
    >
      <div className="absolute max-sm:w-[150px] max-sm:h-[150px] w-[300px] h-[300px] max-sm:top-[30%] sm:top-[15%] sm:right-[25%] max-sm:right-[20%] rounded-full z-0 bg-[#e0e0e0] dark:bg-[#333]"></div>
      <div className="flex relative items-center justify-center mt-10 max-sm:h-[300px] w-1/2 px-5 z-999 rounded-r-3xl">
        <img src={image} className="object-contain h-[300px]" />
      </div>
      <div className="relative z-0 max-sm:mt-5 flex flex-col dark:text-white text-black items-start justify-center w-1/2 max-sm:pl-6 sm:pl-10 capitalize">
        <h1 className="max-sm:text-2xl sm:text-5xl tracking-[1px]">
          {restOfString}
        </h1>
        <span className="font-semibold sm:text-6xl max-sm:text-3xl">
          {lastWord}
        </span>
        <p className="w-[90%] line-clamp-1 pt-2">{description}</p>
        <div className="pt-5 pl-6 flex max-sm:flex-col gap-2 sm:gap-10 group">
          <button className="bg-[#9e6748] dark:bg-[#7a4c36] border-2 border-[#9e6748] dark:border-[#7a4c36] px-1 sm:px-2 py-1 sm:py-2 rounded-sm text-white group-hover:bg-transparent hover:bg-transparent group-hover:text-[#9e6748] dark:group-hover:text-[#7a4c36] hover:text-[#9e6748] dark:hover:text-[#7a4c36] w-[100px]">
            Shop now
          </button>

          <button className="border-2 border-[#9e6748] dark:border-[#7a4c36] px-1 sm:px-2 py-1 sm:py-2 rounded-sm text-[#9e6748] dark:text-[#7a4c36] w-[100px] hover:bg-[#9e6748] dark:hover:bg-[#7a4c36] hover:text-white dark:hover:text-white group-hover:bg-[#9e6748] dark:group-hover:bg-[#7a4c36] group-hover:text-white dark:group-hover:text-white">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarouselSlide;
