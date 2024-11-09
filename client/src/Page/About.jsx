import Layout from "../layout/layout";
import AboutImage from "../assets/home/download.jpg";
function About() {
  return (
    <Layout>
      <div className="sm:mt-[200px] relative max-sm:mt-2">
        <div className="flex  w-full  max-sm:flex-wrap ">
          <div className="w-full p-1   sm:pl-[100px] flex justify-center ">
            <img
              src={AboutImage}
              className=" sm:rounded-tr-[200px] max-sm:w-full  rounded-lg   h-[350px] "
              alt="About_image"
            />
          </div>
          <div className="  w-full sm:pr-10 ">
            <div className="font-bold text-black  w-full my-5 flex flex-col gap-3 mr-28   text-center">
              <h1 className="sm:text-4xl max-sm:text-2xl  ">
                {" "}
                Exquisite Design Combined
              </h1>
              <span className="sm:text-3xl max-sm:text-xl">
                {" "}
                With Functionalities
              </span>
            </div>
            <p className=" line-clamp-3 max-sm:px-5   relative  sm:m-5 text-xl text-[#909090] max-sm:my-10 text-center">
              Nune in Arcu Et Scelerisque Dignissim. Aliquam Enim Nunc, Volutpat
              Eget Ipsum Id, Varius Sodales Mi. vestibulum Ante lpsum Primis In
              Facucibus Orci Luctus Et Ultrices
            </p>

            <p className="font-bold text-[#8f8f8f] my-6   text-center max-sm:px-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet,
              tempore?
            </p>
            <div className="w-full justify-center flex  ">
              <img
                src={AboutImage}
                className="w-[250px] h-[200px] object-contain rounded-lg   "
                alt="About_image2"
              />
            </div>
          </div>
        </div>
        <div className="flex   capitalize text-black  sm:text-3xl max-sm:text-2xl  justify-center text-center w-full my-10  max-sm:px-[10%] sm:px-[20%] ">
          <h1 className="font-medium">
            {" "}
            i am passionately dedicated to{" "}
            <span className="font-bold">crafting timeless</span> elegance and{" "}
            <span className="font-bold text-yellow-300">
              capturing the essence of individual
            </span>{" "}
            <span> stories our brand is not just about adornment</span>
          </h1>
        </div>
        <div className="flex gap-5 capitalize  justify-center flex-wrap my-5 p-5">
          <div className="flex flex-col justify-center cursor-pointer  p-5 rounded hover:bg-[#f1d6cb] bg-[#fce7de] text-center line-clamp-2 sm:min-w-[200px]">
            <h1 className="text-2xl font-bold">15+</h1>
            <p className="text-xl ">All Over India </p>
          </div>
          <div className="flex flex-col justify-center cursor-pointer  p-5 rounded hover:bg-[#f1d6cb] bg-[#fce7de] text-center line-clamp-2 sm:min-w-[200px]">
            <h1 className="text-2xl font-bold">250K</h1>
            <p className="text-xl ">prodect avaliable </p>
          </div>
          <div className="flex flex-col justify-center cursor-pointer  p-5 rounded hover:bg-[#f1d6cb] bg-[#fce7de] text-center line-clamp-2 sm:min-w-[200px]">
            <h1 className="text-2xl font-bold">2K</h1>
            <p className="text-xl  ">prodect reviews </p>
          </div>
          <div className="flex flex-col justify-center cursor-pointer  p-5 rounded hover:bg-[#f1d6cb] bg-[#fce7de] text-center line-clamp-2 sm:min-w-[200px] ">
            <h1 className="text-2xl font-bold capitalize">100K</h1>
            <p className="text-xl  ">happy customers</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default About;
