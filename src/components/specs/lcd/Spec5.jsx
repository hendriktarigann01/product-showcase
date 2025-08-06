import React from "react";
import { Check } from "lucide-react";

const fieldMappings = {
  size: "Size",
  brightness: "Brightness",
  resolution: "Resolution",
  application: "Application",
  display_ratio: "Display Ratio",
  power: "Power",
};

const formatFieldName = (key) =>
  fieldMappings[key] ||
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export function Spec5({ spec, layout = "default" }) {
  if (!spec) return null;

  const { size, brightness, resolution, application, display_ratio, power } =
    spec;

  // Layout untuk side-by-side (single image) - responsive version
  if (layout === "side") {
    return (
      <div className="flex justify-center items-center px-4 lg:mt-24">
        <div className="w-full max-w-md lg:max-w-none">
          <table className="w-full text-left text-xs lg:text-sm text-gray-600">
            <tbody>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("size")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 w-44 sm:w-36 sm:table-cell">
                  {size}
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("brightness")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  {brightness}
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("resolution")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  {resolution}
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("application")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  {application}
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("display_ratio")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  {display_ratio}
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("power")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  {power}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}

export default Spec5;