import React from "react";

const fieldMappings = {
  refresh_rate: "Refresh Rate",
  brightness_led: "Brightness",
  module_size: "Module Size",
  pixel_resolution: "Pixel Resolution",
  module_weight: "Module Weight",
  cabinet_size: "Cabinet Size",
  max_power: "Max Power",
  cabinet_resolution: "Cabinet Resolution",
  pixel_density: "Pixel Density",
  type: "Type",
};

const formatFieldName = (key) => fieldMappings[key] || key;
const formatValue = (value) => {
  if (value === "OPT") return "Optional";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value || "-";
};

export function Spec2_LED({ specs }) {
  if (!specs || specs.length === 0) return null;

  const spec = specs[0];

  return (
    <div className="px-8 mt-12 md:mt-0">
      {/* Desktop Layout */}
      <table className="hidden md:table mx-auto table-auto text-left text-sm text-gray-600">
        <tbody>
          <tr>
            <td className="py-3 pr-8 font-medium">
              {formatFieldName("refresh_rate")}
            </td>
            <td className="py-3 pr-12">{formatValue(spec.refresh_rate)}</td>

            <td className="py-3 pr-8 font-medium min-w-[120px]">
              {formatFieldName("module_size")}
            </td>
            <td className="py-3 pr-12 min-w-[140px]">
              {formatValue(spec.module_size)}
            </td>

            <td className="py-3 pr-8 font-medium min-w-[120px]">
              {formatFieldName("cabinet_size")}
            </td>
            <td className="py-3 min-w-[140px]">
              {formatValue(spec.cabinet_size)}
            </td>
          </tr>

          <tr>
            <td className="py-3 pr-8 font-medium">
              {formatFieldName("Brightness")}
            </td>
            <td className="py-3 pr-12">{formatValue(spec.brightness_led)}</td>
            <td className="py-3 pr-8 font-medium">
              {formatFieldName("pixel_resolution")}
            </td>
            <td className="py-3 pr-12">{formatValue(spec.pixel_resolution)}</td>
            <td className="py-3 pr-8 font-medium">
              {formatFieldName("max_power")}
            </td>
            <td className="py-3">{formatValue(spec.max_power)}</td>
          </tr>

          <tr>
            <td className="py-3 pr-8"></td>
            <td className="py-3 pr-12"></td>
            <td className="py-3 pr-8 font-medium">
              {formatFieldName("module_weight")}
            </td>
            <td className="py-3 pr-12">{formatValue(spec.module_weight)}</td>
            <td className="py-3 pr-8 font-medium">
              {formatFieldName("cabinet_resolution")}
            </td>
            <td className="py-3">{formatValue(spec.cabinet_resolution)}</td>
          </tr>

          <tr>
            <td className="py-3 pr-8"></td>
            <td className="py-3 pr-12"></td>
            <td className="py-3 pr-8"></td>
            <td className="py-3 pr-12"></td>

            <td className="py-3 pr-8 font-medium">
              {formatFieldName("pixel_density")}
            </td>
            <td className="py-3">{formatValue(spec.pixel_density)}</td>
          </tr>
        </tbody>
      </table>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-2">
        <div className="flex py-1">
          <span className="font-medium text-gray-600 text-[11px] lg:text-sm w-32">
            {formatFieldName("type")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.type)}
          </span>
        </div>

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
            {formatFieldName("module_size")}
          </span>
          <span className="text-gray-600 text-[11px] lg:text-sm">
            {formatValue(spec.module_size)}
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

export default Spec2_LED;
