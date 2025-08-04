import React from "react";

const fieldMappings = {
  refresh_rate: "Refresh Rate",
  brightness: "Brightness",
  modul_size: "Modul Size",
  pixel_resolution: "Pixel resolution",
  module_weight: "Module weight",
  cabinet_size: "Cabinet Size",
  cabinet_resolution: "Cabinet resolution",
  max_power: "Max power",
  pixel_density: "Pixel density",
};

const formatFieldName = (key) => fieldMappings[key] || key;
const formatValue = (value) => {
  if (value === "OPT") return "Optional";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value || "-";
};

export function Spec1_LED({ specs }) {
  if (!specs || specs.length === 0) return null;

  const spec = specs[0];

  return (
    <div className="px-8 mt-4">
      <table className="table-fixed flex justify-center w-full text-left text-sm text-gray-600">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium w-48">
              {formatFieldName("refresh_rate")}
            </td>
            <td className="py-2 px-4 w-60">{formatValue(spec.refresh_rate)}</td>

            <td className="py-2 px-4 font-medium w-48">
              {formatFieldName("modul_size")}
            </td>
            <td className="py-2 px-4 w-60">{formatValue(spec.modul_size)}</td>

            <td className="py-2 px-4 font-medium w-48">
              {formatFieldName("cabinet_size")}
            </td>
            <td className="py-2 px-4 w-60">{formatValue(spec.cabinet_size)}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">
              {formatFieldName("brightness")}
            </td>
            <td className="py-2 px-4">{formatValue(spec.brightness)}</td>

            <td className="py-2 px-4 font-medium">
              {formatFieldName("pixel_resolution")}
            </td>
            <td className="py-2 px-4">{formatValue(spec.pixel_resolution)}</td>

            <td className="py-2 px-4 font-medium">
              {formatFieldName("max_power")}
            </td>
            <td className="py-2 px-4">{formatValue(spec.max_power)}</td>
          </tr>
          <tr>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4 font-medium">
              {formatFieldName("module_weight")}
            </td>
            <td className="py-2 px-4">{formatValue(spec.module_weight)}</td>

            <td className="py-2 px-4 font-medium">
              {formatFieldName("cabinet_resolution")}
            </td>
            <td className="py-2 px-4">
              {formatValue(spec.cabinet_resolution)}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4 font-medium">
              {formatFieldName("pixel_density")}
            </td>
            <td className="py-2 px-4">{formatValue(spec.pixel_density)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Spec1_LED;
