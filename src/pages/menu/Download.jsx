import React, { useState } from "react";
import { X } from "lucide-react";

// Mapping product names to PDF files
const PDF_MAPPING = {
  "Digital Signage KMI 2000 Series": "KMI2000 Series.pdf",
  "Digital Signage KMI 2300": "KMI2300.pdf",
  "Digital Kiosk Signage KMI 4100 & 4200": "KMI4000 All Series.pdf",
  "Interactive Whiteboard KMI 7000 Series": "KMI7000 Series.pdf",
  "Video Wall KMI 8000": "KMI8000 - LFD Video Wall.pdf",
  "LED Outdoor for Fixed Installation": "Weather Resistance - Outdoor LED (All Series).pdf",
  "LED Poster Display": "Creative LED All Series.pdf"

};

export function Download({ isOpen, onClose, product }) {
  const [qrCode] = useState(product.download);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const extractKMINumber = (productName) => {
    if (PDF_MAPPING[productName]) return productName;

    const kmiMatch = productName.match(/KMI\s*(\d+)/i);
    if (kmiMatch) {
      const kmiNumber = kmiMatch[1];
      const kmiKey = `KMI ${kmiNumber}`;
      if (PDF_MAPPING[kmiKey]) return kmiKey;
    }

    for (const key of Object.keys(PDF_MAPPING)) {
      if (
        productName.includes(key) ||
        key.includes(productName.replace(/\s+/g, " ").trim())
      ) {
        return key;
      }
    }

    return null;
  };

  const handleDownloadPDF = () => {
    const matchedKey = extractKMINumber(product.name);
    const pdfFileName = matchedKey ? PDF_MAPPING[matchedKey] : null;

    if (pdfFileName) {
      const link = document.createElement("a");
      link.href = `/files/${pdfFileName}`;
      link.download = pdfFileName;
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`PDF file tidak tersedia untuk produk: ${product.name}`);
    }
  };

  const getPDFFileName = () => {
    const matchedKey = extractKMINumber(product.name);
    return matchedKey ? PDF_MAPPING[matchedKey] : "Product Brochure.pdf";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative animate-in fade-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-[#4ECDC4] rounded-full flex items-center justify-center text-white hover:bg-[#45b8af] transition-colors shadow-lg"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-6">
            Let's scan!
          </h2>

          {/* QR Code */}
          <div className="mb-6 flex justify-center">
            <div className="w-60 h-60 rounded-lg flex items-center justify-center">
              {qrCode ? (
                <img
                  src={qrCode}
                  alt="QR Code for product brochure"
                  className="w-full h-full object-contain"
                />
              ) : null}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-xs mb-4">
            Curious about the details? Simply scan this barcode and discover all
            the complete information about our product in one digital brochure.
          </p>

          {/* Download Link */}
          <p
            className="text-primary text-xs mb-6 underline cursor-pointer hover:text-teal-600 transition-colors"
            onClick={handleDownloadPDF}
          >
            {getPDFFileName()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Download;
