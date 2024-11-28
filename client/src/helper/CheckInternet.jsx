import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SlowInternetPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkNetworkSpeed = () => {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (connection) {
        const slowConnectionTypes = ["slow-2g", "2g"];
        if (slowConnectionTypes.includes(connection.effectiveType)) {
        } else {
          navigate(-1);
        }
      }
    };

    // Initial check
    checkNetworkSpeed();

    // Listen for network changes
    navigator.connection?.addEventListener("change", checkNetworkSpeed);

    return () => {
      navigator.connection?.removeEventListener("change", checkNetworkSpeed);
    };
  }, []);

  return (
    <div className="w-full min-h-[100vh] flex flex-col items-center justify-center bg-gray-100 dark:bg-[#111827] dark:text-white text-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">
          Slow Internet Connection
        </h1>
        <p className="text-lg mb-6">
          Your internet connection is very slow. Some features may not work
          properly.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default SlowInternetPage;
