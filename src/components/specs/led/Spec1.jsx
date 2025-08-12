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
      {/* Desktop Layout */}
      <table className="hidden md:table table-fixed w-full text-left text-sm text-gray-600 text-[11px] lg:text-sm">
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

      {/* Mobile Layout */}
      <div className="md:hidden space-y-2">
        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("refresh_rate")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.refresh_rate)}
          </span>
        </div>

        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("brightness")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.brightness)}
          </span>
        </div>

        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("modul_size")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.modul_size)}
          </span>
        </div>

        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("pixel_resolution")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.pixel_resolution)}
          </span>
        </div>

        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("module_weight")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.module_weight)}
          </span>
        </div>

        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("cabinet_size")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.cabinet_size)}
          </span>
        </div>

        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("max_power")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.max_power)}
          </span>
        </div>

        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("cabinet_resolution")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.cabinet_resolution)}
          </span>
        </div>

        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("pixel_density")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.pixel_density)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Spec1_LED;
