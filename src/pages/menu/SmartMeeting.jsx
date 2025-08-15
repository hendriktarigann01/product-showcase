// import React, { useState, useRef, useEffect } from "react";
// import { Header, ContactInfo } from "../Layout";
// import { products } from "../../data/product";
// import DetailSmartMeeting from "../menu/details/DetailSmartMeeting";
// import { useMorphTransition } from "./details/MorphTransition";

// const SmartMeeting = ({ onBack }) => {
//   const [currentProduct] = products;
//   const smartImages = currentProduct.smart;
//   const smart1 = smartImages.find((item) => item.id === 1);
//   const smart2 = smartImages.find((item) => item.id === 2);
//   const smart3 = smartImages.find((item) => item.id === 3);
//   const smart4 = smartImages.find((item) => item.id === 4);

//   // State untuk mengelola detail view
//   const [selectedSmartRoom, setSelectedSmartRoom] = useState(null);
//   const { startTransition } = useMorphTransition();
//   const imageRefs = useRef({});

//   // Handle hotspot clicks pada gambar komposit utama
//   const handleImageClick = (smartId) => {
//     window.history.pushState(
//       { view: "detail", smartId },
//       "",
//       window.location.pathname
//     );

//     const selectedSmartData = smartImages.find((item) => item.id === smartId);
//     const imageElement = imageRefs.current[smartId];

//     if (imageElement) {
//       startTransition(imageElement, null, {
//         startImage: selectedSmartData.image,
//         endImage: selectedSmartData.image,
//         direction: "forward",
//         productIndex: smartId - 1,
//         selectedSmartId: smartId,
//       });
//     }

//     // Small delay to allow transition to start
//     setTimeout(() => {
//       setSelectedSmartRoom(selectedSmartData);
//     }, 100);
//   };

//   const compositeHotspots = currentProduct.smart_room.map((room) => ({
//     ...room,
//     onClick: () => handleImageClick(room.smartId),
//   }));

//   useEffect(() => {
//     const handlePopState = (event) => {
//       if (selectedSmartRoom) {
//         setSelectedSmartRoom(null);
//       }
//     };

//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [selectedSmartRoom]);

//   // Jika ada selectedSmartRoom, tampilkan detail view
//   if (selectedSmartRoom) {
//     return (
//       <DetailSmartMeeting
//         selectedSmartRoom={selectedSmartRoom}
//         onBack={(imageElement) => {
//           if (imageElement) {
//             startTransition(
//               imageElement,
//               imageRefs.current[selectedSmartRoom.id],
//               {
//                 startImage: selectedSmartRoom.image,
//                 endImage: selectedSmartRoom.image,
//                 direction: "backward",
//                 productIndex: selectedSmartRoom.id - 1,
//                 selectedSmartId: selectedSmartRoom.id,
//               }
//             );
//           }

//           window.history.back();
//         }}
//       />
//     );
//   }

//   return (
//     <div className="max-h-screen">
//       <Header
//         title="Smart Meeting Room"
//         className="text-secondary"
//         onBack={onBack}
//         showBackButton={true}
//       />
//       <div className="w-full h-screen pt-32 pb-24 bg-[#e7f4f3] px-4 lg:px-12 box-border overflow-hidden">
//         <div className="max-w-7xl mx-auto h-full flex flex-col">
//           {/* Main content area with centered image */}
//           <div className="flex-grow flex items-center justify-center">
//             {/* Image Display Container - Properly Centered */}
//             <div className="flex items-center justify-center">
//               {/* Container dengan ukuran tetap dan centered positioning */}
//               <div
//                 className="relative flex items-center justify-center"
//                 style={{
//                   width: "900px",
//                   height: "490px",
//                 }}
//               >
//                 {/* Container untuk images dengan posisi yang sudah di-setting */}
//                 <div className="relative w-full h-full">
//                   {/* Apply scaling here */}
//                   <div
//                     style={{
//                       transform: "scale(0.7)",
//                       transformOrigin: "center center",
//                     }}
//                   >
//                     {/* smart_1 - Back layer */}
//                     <img
//                       ref={(el) => (imageRefs.current[1] = el)}
//                       src={smart1?.image}
//                       alt={smart1?.title}
//                       className="absolute object-contain z-30 left-[80px] top-[300px] w-[555px] h-[410px] cursor-pointer"
//                       onClick={() => handleImageClick(1)}
//                     />

//                     {/* smart_2 - Middle layer */}
//                     <img
//                       ref={(el) => (imageRefs.current[2] = el)}
//                       src={smart2?.image}
//                       alt={smart2?.title}
//                       className="absolute object-contain z-10 left-[-80px] top-[240px] w-[430px] h-[356px] cursor-pointer"
//                       onClick={() => handleImageClick(2)}
//                     />

//                     {/* smart_3 - Front layer */}
//                     <img
//                       ref={(el) => (imageRefs.current[3] = el)}
//                       src={smart3?.image}
//                       alt={smart3?.title}
//                       className="absolute object-contain z-27 left-[110px] top-[40px] w-[639px] h-[452px] cursor-pointer"
//                       onClick={() => handleImageClick(3)}
//                     />

//                     {/* smart_4 - Front layer */}
//                     <img
//                       ref={(el) => (imageRefs.current[4] = el)}
//                       src={smart4?.image}
//                       alt={smart4?.title}
//                       className="absolute object-contain z-20 left-[400px] top-[142px] w-[555px] h-[410px] cursor-pointer"
//                       onClick={() => handleImageClick(4)}
//                     />
//                   </div>

//                   {/* Hotspots untuk Smart Meeting */}
//                   <div
//                     className="absolute inset-0 pointer-events-none"
//                     style={{ zIndex: 100 }}
//                   >
//                     {compositeHotspots.map((hotspot) => (
//                       <div key={hotspot.id}>
//                         <div
//                           className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
//                           style={{
//                             left: `${hotspot.x}%`,
//                             top: `${hotspot.y}%`,
//                             zIndex: 101,
//                           }}
//                           onClick={hotspot.onClick}
//                         >
//                           <div className="relative flex items-center justify-center">
//                             {/* Radar waves */}
//                             <div className="absolute w-6 h-6 rounded-full bg-teal-500 border opacity-40 animate-ping"></div>
//                             <div
//                               className="absolute w-8 h-8 rounded-full bg-teal-500 border opacity-30 animate-ping"
//                               style={{ animationDelay: "1.5s" }}
//                             ></div>
//                             <div
//                               className="absolute w-10 h-10 rounded-full bg-teal-500 border opacity-20 animate-ping"
//                               style={{ animationDelay: "2s" }}
//                             ></div>
//                             {/* Hotspot Button */}
//                             <button className="relative w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center shadow-lg"></button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bottom section */}
//           <div className="flex justify-center pb-6"></div>
//         </div>
//       </div>

//       <ContactInfo />
//     </div>
//   );
// };

// export default SmartMeeting;
