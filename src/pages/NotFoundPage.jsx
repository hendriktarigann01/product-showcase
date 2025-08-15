const NotFoundPage = () => {
  const handleHome = () => {
    console.log("Navigate to Home");
    window.location.href = "/";
  };

  return (
    <div className="h-screen bg-[#e7f4f3] relative overflow-hidden">
      <div className="relative z-10 gap-y-6 flex flex-col items-center justify-center h-screen px-4">
        {/* Logo Section */}
        <div className="text-center w-48 sm:w-64 md:w-[700px] h-auto">
          <img
            src="/error-icon.webp"
            className="w-full h-full"
            alt="Error Icon"
          />
        </div>

        {/* Error Message */}
        <div className="text-center text-gray-600">
          <h1 className="text-base sm:text-lg md:text-2xl font-semibold mb-4 sm:mb-6">
            Oops! Page Not Found
          </h1>
          <p className="text-xs sm:text-sm md:text-lg mx-auto leading-relaxed max-w-xs sm:max-w-full">
            It looks like you've strayed into an undiscovered place. But don't
            worry, we can get back!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col text-white sm:flex-row gap-3 sm:gap-4 items-center">
          <button
            onClick={handleHome}
            className="w-24 h-9 sm:w-28 sm:h-10 md:w-36 md:h-11 lg:w-40 lg:h-12 bg-primary hover:bg-teal-600 flex justify-center items-center gap-2 rounded-md text-xs sm:text-sm md:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
