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
  // Add missing mappings
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
      <table className="table-fixed w-auto text-left text-gray-600 text-sm mx-auto">
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
                      <span className="text-sm">{spec.value}</span>
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
}

export default Spec1;
