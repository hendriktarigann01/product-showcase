import React from "react";
import { Check, X } from "lucide-react";

const fieldMappings = {
  size: "Available Sizes",
  os: "Operating System",
  android: "Android Specs",
  windows: "Windows Specs",
  cpu: "Processor",
  ram: "Memory",
  cam: "Camera",
  mic: "Microphone",
  nfc: "NFC",
  fp: "Fingerprint Access",
  noise: "AI Noise Reduction",
  touchscreen: "Touchscreen",
  maxres: "Maximum Resolution",
  storage: "Storage",
};

const formatFieldName = (key) => fieldMappings[key] || key;
const formatValue = (value) => {
  if (value === "OPT") return "Optional";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value || "-";
};
const isBoolean = (value) => typeof value === "boolean";

export function Spec1({ spec }) {
  if (!spec) return null;
  const specEntries = Object.entries(spec).filter(
    ([key, value]) => key !== "type" && value !== undefined && value !== null
  );

  // Mobile/Tablet: Single column layout
  const MobileLayout = () => (
    <div className="px-4 sm:px-6">
      <div className="space-y-0">
        {specEntries.map(([key, value], index) => (
          <div
            key={index}
            className="flex items-center border-b border-gray-100"
          >
            <div className="w-32">
              <span className="font-medium text-[11px] lg:text-sm text-gray-700 flex-1">
                {formatFieldName(key)}
              </span>
            </div>
            <div className="flex-shrink-0 ml-4">
              {isBoolean(value) ? (
                formatValue(value) === "Yes" ? (
                  <div className="w-5 h-5 bg-teal-500 rounded-full flex justify-center items-center">
                    <Check size={12} className="text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-teal-500 rounded-full flex justify-center items-center">
                    <X size={12} className="text-white" />
                  </div>
                )
              ) : (
                <div className="w-auto">
                  <span className="text-[11px] lg:text-sm text-gray-600">
                    {formatValue(value)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Desktop: Original 3-column layout
  const DesktopLayout = () => {
    const groupedSpecs = specEntries.reduce((rows, [key, value], index) => {
      const rowIndex = Math.floor(index / 3);
      if (!rows[rowIndex]) rows[rowIndex] = [];
      rows[rowIndex].push({
        label: formatFieldName(key),
        value: formatValue(value),
        isBoolean: isBoolean(value),
      });
      return rows;
    }, []);

    return (
      <div className="px-8">
        <table className="table-fixed w-auto text-left text-gray-600 text-xs lg:text-sm mx-auto">
          <tbody>
            {groupedSpecs.map((row, i) => (
              <tr key={i} className="align-top">
                {row.map((spec, j) => (
                  <React.Fragment key={j}>
                    <td className="py-2 font-medium w-36">{spec.label}</td>
                    <td className="px-6 py-2 w-60">
                      {spec.isBoolean ? (
                        spec.value === "Yes" ? (
                          <div className="w-5 h-5 bg-teal-500 rounded-full flex justify-center items-center">
                            <Check size={12} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-teal-500 rounded-full flex justify-center items-center">
                            <X size={12} className="text-teal-500" />
                          </div>
                        )
                      ) : (
                        <span className="text-xs lg:text-sm">{spec.value}</span>
                      )}
                    </td>
                  </React.Fragment>
                ))}
                {[...Array(3 - row.length)].map((_, k) => (
                  <React.Fragment key={`empty-${k}`}>
                    <td className="py-2 w-36"></td>
                    <td className="px-6 py-2"></td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="block lg:hidden">
        <MobileLayout />
      </div>
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </>
  );
}

export default Spec1;
