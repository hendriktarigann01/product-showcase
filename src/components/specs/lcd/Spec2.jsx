import React from "react";
import { Check, X } from "lucide-react";

const fieldMappings = {
  size: "Size",
  brightness: "Brightness",
  b2b: "B2B",
  unit_size_mm: "Unit Size (mm)",
  available: "Available",
};

const formatFieldName = (key) => fieldMappings[key] || key;
const formatValue = (value) => value || "-";
const isBoolean = (value) => typeof value === "boolean";

export function Spec2({ spec }) {
  if (!spec || !Array.isArray(spec.options)) return null;

  // Group options by brightness if multiple brightness levels exist
  const brightnessGroups = {};
  spec.options.forEach((option) => {
    const brightness = option.brightness || spec.brightness;
    if (!brightnessGroups[brightness]) {
      brightnessGroups[brightness] = [];
    }
    brightnessGroups[brightness].push(option);
  });

  const brightnessLevels = Object.keys(brightnessGroups);

  return (
    <div className="px-8 mt-3">
      <table className="table-auto w-3/4 text-left text-sm text-gray-600 mx-auto">
        <tbody>
          {/* Brightness Row */}
          <tr>
            <td className="py-2 font-medium w-36">
              {formatFieldName("brightness")}
            </td>
            {brightnessLevels.map((brightness, index) => (
              <td
                key={index}
                className="px-6 py-2 text-center font-medium"
                colSpan={brightnessGroups[brightness].length}
              >
                <span className="text-sm">{formatValue(brightness)}</span>
              </td>
            ))}
          </tr>

          {/* B2B Row */}
          <tr>
            <td className="py-2 font-medium w-36">{formatFieldName("b2b")}</td>
            {brightnessLevels.map((brightness) =>
              brightnessGroups[brightness].map((option, optIndex) => (
                <td
                  key={`${brightness}-${optIndex}`}
                  className="px-6 py-2 text-center"
                >
                  <span className="text-sm">{formatValue(option.b2b)}</span>
                </td>
              ))
            )}
          </tr>

          {/* Unit Size Row */}
          <tr>
            <td className="py-2 font-medium w-36">
              {formatFieldName("unit_size_mm")}
            </td>
            {brightnessLevels.map((brightness) =>
              brightnessGroups[brightness].map((option, optIndex) => (
                <td
                  key={`${brightness}-${optIndex}`}
                  className="px-6 py-2 text-center"
                >
                  <span className="text-sm">
                    {formatValue(option.unit_size_mm)}
                  </span>
                </td>
              ))
            )}
          </tr>

          {/* Available Row */}
          <tr>
            <td className="py-2 font-medium w-36">
              {formatFieldName("available")}
            </td>
            {brightnessLevels.map((brightness) =>
              brightnessGroups[brightness].map((option, optIndex) => (
                <td
                  key={`${brightness}-${optIndex}`}
                  className="px-6 py-2 text-center"
                >
                  {isBoolean(option.available) ? (
                    option.available ? (
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex justify-center items-center mx-auto">
                        <Check size={12} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-teal-500 rounded-full flex justify-center items-center mx-auto">
                        <X size={12} className="text-teal-500" />
                      </div>
                    )
                  ) : (
                    <span className="text-sm">
                      {formatValue(option.available)}
                    </span>
                  )}
                </td>
              ))
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Spec2;
