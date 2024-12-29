import Layout from "../../layout/layout";

export const LoadingCart = ({ dataType }) => {
  const getLoadingContent = (dataType) => {
    switch (dataType) {
      case "user":
        return {
          image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=User",
          text: "Loading User Data... Please wait.",
        };
      case "payment":
        return {
          image: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Payment",
          text: "Loading Payment Data... Please wait.",
        };
      case "product":
        return {
          image: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Product",
          text: "Loading Product Data... Please wait.",
        };
      default:
        return {
          image: "https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Loading",
          text: "Loading Data... Please wait.",
        };
    }
  };

  const { image, text } = getLoadingContent(dataType);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <img src={image} alt="Loading" className="w-24 h-24" />
      <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">
        {text}
      </p>
    </div>
  );
};
