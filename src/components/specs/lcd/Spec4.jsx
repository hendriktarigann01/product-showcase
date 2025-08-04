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

  // Layout untuk side-by-side (single image) - sama seperti Spec5
  if (layout === "side") {
    return (
      <div className="flex justify-center items-center px-4 mt-10  ">
        <table className="w-full h-auto text-left text-sm text-gray-600">
          <tbody>
            <tr className="align-top">
              <td className="py-2 font-medium w-36">
                {formatFieldName("size")}
              </td>
              <td className="px-4 py-3 w-36">{size}</td>
            </tr>
            <tr className="align-top">
              <td className="py-2 font-medium">
                {formatFieldName("brightness")}
              </td>
              <td className="px-4 py-3">{brightness}</td>
            </tr>
            <tr className="align-top">
              <td className="py-2 font-medium">
                {formatFieldName("resolution")}
              </td>
              <td className="px-4 py-3">{resolution}</td>
            </tr>
            <tr className="align-top">
              <td className="py-2 font-medium">{formatFieldName("os")}</td>
              <td className="px-4 py-3">{os}</td>
            </tr>
            <tr className="align-top">
              <td className="py-2 font-medium">
                {formatFieldName("optional_components")}
              </td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  {Object.entries(opts).map(([key, val]) =>
                    val ? (
                      <div className="flex gap-4 items-center justify-start">
                        <div className="w-5 h-5 bg-teal-500 rounded-full flex justify-center items-center">
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="text-sm">{formatFieldName(key)}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </td>
            </tr>
            <tr className="align-top">
              <td className="py-2 font-medium">{formatFieldName("display")}</td>
              <td className="px-4 py-3">{display}</td>
            </tr>
            <tr className="align-top">
              <td className="py-2 font-medium">
                {formatFieldName("max_power_consumption")}
              </td>
              <td className="px-4 py-3">{max_power_consumption}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Spec4;
