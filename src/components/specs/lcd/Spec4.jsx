import React from "react";
import { Check } from "lucide-react";

const fieldMappings = {
  size: "Size",
  brightness: "Brightness (nits)",
  resolution: "Resolution",
  os: "OS",
  display: "Display",
  max_power_consumption: "Max Power Consumption",
  optional_components: "Optional Components",
  camera: "Camera",
  nfc: "NFC",
  fingerprint: "Fingerprint",
  thermal_printer: "Thermal Printer",
  qr_code_scanner: "QR Code Scanner",
};

const formatFieldName = (key) =>
  fieldMappings[key] ||
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export function Spec4({ spec, layout = "default" }) {
  if (!spec) return null;

  const {
    size,
    brightness,
    resolution,
    os,
    optional_components,
    display,
    max_power_consumption,
  } = spec;

  const opts = optional_components?.[0] || {};

  // Layout untuk side-by-side (single image) - responsive version
  if (layout === "side") {
    return (
      <div className="flex justify-center items-center px-4 mt-10">
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
                  {formatFieldName("os")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  {os}
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("optional_components")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  <div className="space-y-1">
                    {Object.entries(opts).map(([key, val]) =>
                      val ? (
                        <div
                          key={key}
                          className="flex gap-2 sm:gap-4 items-center justify-start"
                        >
                          <div className="w-5 h-5 bg-teal-500 rounded-full flex justify-center items-center flex-shrink-0">
                            <Check size={12} className="text-white" />
                          </div>
                          <span className="text-xs lg:text-sm">
                            {formatFieldName(key)}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("display")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  {display}
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 font-medium w-44 sm:w-36 sm:table-cell">
                  {formatFieldName("max_power_consumption")}
                </td>
                <td className="px-0 sm:px-4 py-1 sm:py-3 sm:table-cell">
                  {max_power_consumption}
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

export default Spec4;