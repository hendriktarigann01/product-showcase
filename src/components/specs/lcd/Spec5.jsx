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

  // Layout untuk side-by-side (single image)
  if (layout === "side") {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <table className="w-full h-auto text-left text-sm text-gray-600">
          <tbody>
            <tr className="align-middle">
              <td className="py-2 font-medium w-36">
                {formatFieldName("size")}
              </td>
              <td className="px-4 py-3 w-36">{size}</td>
            </tr>
            <tr className="align-middle">
              <td className="py-2 font-medium">
                {formatFieldName("brightness")}
              </td>
              <td className="px-4 py-3">{brightness}</td>
            </tr>
            <tr className="align-middle">
              <td className="py-2 font-medium">
                {formatFieldName("resolution")}
              </td>
              <td className="px-4 py-3">{resolution}</td>
            </tr>
            <tr className="align-middle">
              <td className="py-2 font-medium">
                {formatFieldName("application")}
              </td>
              <td className="px-4 py-3">{application}</td>
            </tr>
            <tr className="align-middle">
              <td className="py-2 font-medium">
                {formatFieldName("display_ratio")}
              </td>
              <td className="px-4 py-3">{display_ratio}</td>
            </tr>
            <tr className="align-middle">
              <td className="py-2 font-medium">{formatFieldName("power")}</td>
              <td className="px-4 py-3">{power}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Spec5;
