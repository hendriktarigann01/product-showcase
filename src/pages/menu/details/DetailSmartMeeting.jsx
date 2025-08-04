import React, { useRef, useEffect } from "react";
import { Header, ContactInfo } from "../../Layout";
import ImageHotspot from "../../../components/ImageHotspot";
import { useMorphTransition } from "./MorphTransition";
import { useNavigate } from "react-router-dom";

const DetailSmartMeeting = ({ selectedSmartRoom, onBack, onMainBack }) => {
  const imageRef = useRef(null);
  const { endTransition } = useMorphTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      endTransition();
    }, 900);

    return () => clearTimeout(timer);
  }, [endTransition]);

  const handleBackClick = () => {
    const imageElement =
      imageRef.current?.querySelector("img") || imageRef.current;
    onBack(imageElement);
  };

  const navigate = useNavigate();

  return (
    <div className="max-h-screen">
      <Header
        title="Smart Meeting Room"
        className="text-secondary"
        onBack={() => navigate(-1)}
        showBackButton={true}
      />

      {/* Detail View */}
      <div className="w-full h-screen pt-32 pb-24 bg-[#e7f4f3] px-4 lg:px-12 box-border overflow-hidden">
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="w-full flex items-center justify-between gap-16">
            {/* Left Side - Image */}
            <div className="flex-1 flex items-center justify-center">
              <div ref={imageRef} className="w-full max-w-2xl">
                {selectedSmartRoom.hotspots &&
                selectedSmartRoom.hotspots.length > 0 ? (
                  <ImageHotspot
                    imageSrc={selectedSmartRoom.image}
                    hotspots={selectedSmartRoom.hotspots}
                    productName={selectedSmartRoom.title}
                    containerClass="relative w-full h-full"
                    showRadarEffect={true}
                    hotspotSize="w-4 h-4"
                    cardWidth="w-64"
                  />
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={selectedSmartRoom.image}
                      alt={selectedSmartRoom.title}
                      className="max-w-full max-h-[500px] object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Information Panel */}
            <div className="flex-1 flex flex-col justify-center max-w-sm text-left">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-600 mb-4 uppercase tracking-wider">
                {selectedSmartRoom.title}
              </h2>

              {/*  */}
              <p className="text-primary text-lg mb-10">
                {selectedSmartRoom.max}
              </p>
              {/* Description */}
              <p className="text-gray-600 text-lg">
                {selectedSmartRoom.content}
              </p>

              <form className="text-gray-600 text-lg mt-10">
                <div className="mb-2">
                  <input
                    type="radio"
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2">Interactive Dashboard</label>
                  <label
                    for="teal-radio"
                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Teal
                  </label>
                </div>

                <div className="mb-2">
                  <input
                    type="radio"
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2">LED Indoor </label>
                  <label
                    for="teal-radio"
                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Teal
                  </label>
                </div>

                <div className="mb-2">
                  <input
                    type="radio"
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2">Video Wall</label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ContactInfo />
    </div>
  );
};

export default DetailSmartMeeting;
