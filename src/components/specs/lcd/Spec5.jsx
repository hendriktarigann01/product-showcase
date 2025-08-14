import React from "react";

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
      <div className="flex justify-center items-center w-full px-8 lg:px-4 mt-0">
        <div className="w-full max-w-md lg:max-w-lg">
          <div className="overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm text-gray-600">
              <tbody>
                <tr className="align-top">
                  <td className="py-2 sm:py-3 pr-2 sm:pr-4 font-medium text-xs sm:text-sm">
                    {formatFieldName("size")}
                  </td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm">{size}</td>
                </tr>
                <tr className="align-top">
                  <td className="py-2 sm:py-3 pr-2 sm:pr-4 font-medium text-xs sm:text-sm">
                    {formatFieldName("brightness")}
                  </td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm">
                    {brightness}
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="py-2 sm:py-3 pr-2 sm:pr-4 font-medium text-xs sm:text-sm">
                    {formatFieldName("resolution")}
                  </td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm">
                    {resolution}
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="py-2 sm:py-3 pr-2 sm:pr-4 font-medium text-xs sm:text-sm">
                    {formatFieldName("application")}
                  </td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm">
                    {application}
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="py-2 sm:py-3 pr-2 sm:pr-4 font-medium text-xs sm:text-sm">
                    {formatFieldName("display_ratio")}
                  </td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm">
                    {display_ratio}
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="py-2 sm:py-3 pr-2 sm:pr-4 font-medium text-xs sm:text-sm">
                    {formatFieldName("power")}
                  </td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm">{power}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Spec5;
