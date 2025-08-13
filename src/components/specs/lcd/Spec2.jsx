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

export function Spec2({ spec }) {
  if (!spec || !Array.isArray(spec.variants)) return null;

  return (
    <div className="px-0 lg:px-8">
      {/* Desktop Layout - Horizontal table */}
      <div className="hidden lg:block">
        <table className="table-auto w-full lg:w-3/4 mx-auto text-left text-sm md:text-[13px] text-gray-600">
          <tbody>
            {/* Brightness Row */}
            <tr>
              <td className="py-2 font-medium w-36">
                {formatFieldName("brightness")}
              </td>
              {spec.variants.map((variant, variantIndex) => (
                <td
                  key={variantIndex}
                  className="px-0 py-2 text-center w-60"
                  colSpan={variant.options.length}
                >
                  <span>{formatValue(variant.brightness)}</span>
                </td>
              ))}
            </tr>

            {/* B2B Row */}
            <tr>
              <td className="py-2 font-medium w-36">
                {formatFieldName("b2b")}
              </td>
              {spec.variants.map((variant) =>
                variant.options.map((option, optIndex) => (
                  <td
                    key={`${variant.brightness}-${optIndex}`}
                    className="px-0 py-2 text-center w-60"
                  >
                    <span>{formatValue(option.b2b)}</span>
                  </td>
                ))
              )}
            </tr>

            {/* Unit Size Row */}
            <tr>
              <td className="py-2 font-medium w-36">
                {formatFieldName("unit_size_mm")}
              </td>
              {spec.variants.map((variant) =>
                variant.options.map((option, optIndex) => (
                  <td
                    key={`${variant.brightness}-${optIndex}`}
                    className="px-0 py-2 text-center w-60"
                  >
                    <span>{formatValue(option.unit_size_mm)}</span>
                  </td>
                ))
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Layout - Pisah per brightness */}
      <div className="lg:hidden space-y-4">
        {spec.variants.map((variant, variantIndex) => (
          <table
            key={variantIndex}
            className="table-auto w-full text-left text-[9px] text-gray-600"
          >
            <tbody>
              {/* Brightness Row */}
              <tr>
                <td className="py-2 font-medium w-16">
                  {formatFieldName("brightness")}
                </td>
                <td
                  className="px-2 py-2 text-center font-medium"
                  colSpan={variant.options.length}
                >
                  <span className="text-[9px]">
                    {formatValue(variant.brightness)}
                  </span>
                </td>
              </tr>

              {/* B2B Row */}
              <tr>
                <td className="py-2 font-medium w-16">
                  {formatFieldName("b2b")}
                </td>
                {variant.options.map((option, optIndex) => (
                  <td
                    key={`${variant.brightness}-${optIndex}`}
                    className="px-2 py-2 text-center"
                  >
                    <span className="text-[9px]">
                      {formatValue(option.b2b)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Unit Size Row */}
              <tr>
                <td className="py-2 font-medium w-16">
                  {formatFieldName("unit_size_mm")}
                </td>
                {variant.options.map((option, optIndex) => (
                  <td
                    key={`${variant.brightness}-${optIndex}`}
                    className="px-2 py-2 text-center"
                  >
                    <span className="text-[9px]">
                      {formatValue(option.unit_size_mm)}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}

export default Spec2;
