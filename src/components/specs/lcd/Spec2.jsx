import React from "react";
import { Check, X } from "lucide-react";

const fieldMappings = {
  size: "Size",
  brightness: "Brightness",
  b2b: "B2B",
  unit_size_mm: "Unit Size",
  available: "Available",
};

const formatFieldName = (key) => fieldMappings[key] || key;
const formatValue = (value) => value || "-";

export function Spec2({ spec }) {
  if (!spec || !Array.isArray(spec.variants)) return null;

  return (
    <div className="px-0 lg:px-8">
      {/* Desktop Layout - Table with labels for each variant */}
      <div className="hidden lg:block">
        <table className="table-auto w-full mx-auto text-left text-[13px] text-gray-600 border-separate border-spacing-x-10">
          <tbody>
            {/* Brightness Row */}
            <tr>
              <td className="py-2 w-16">{formatFieldName("brightness")}</td>
              {/* First variant */}
              <td
                className="px-2 py-2 w-[186px] text-center"
                colSpan={spec.variants[0]?.options.length || 1}
              >
                <span>{formatValue(spec.variants[0]?.brightness)}</span>
              </td>

              {/* Label column for second variant */}
              {spec.variants.length > 1 && (
                <td className="py-2 w-16">{formatFieldName("brightness")}</td>
              )}

              {/* Second variant */}
              {spec.variants.length > 1 && (
                <td
                  className="px-2 py-2 w-[186px] text-center"
                  colSpan={spec.variants[1]?.options.length || 1}
                >
                  <span>{formatValue(spec.variants[1]?.brightness)}</span>
                </td>
              )}
            </tr>

            {/* B2B Row */}
            <tr>
              <td className="py-2 w-16">{formatFieldName("b2b")}</td>
              {/* First variant options */}
              {spec.variants[0]?.options.map((option, optIndex) => (
                <td
                  key={`first-${optIndex}`}
                  className="px-2 py-2 w-[186px] text-center"
                >
                  <span>{formatValue(option.b2b)}</span>
                </td>
              ))}

              {/* Label column for second variant */}
              {spec.variants.length > 1 && (
                <td className="py-2 w-16">{formatFieldName("b2b")}</td>
              )}

              {/* Second variant options */}
              {spec.variants.length > 1 &&
                spec.variants[1]?.options.map((option, optIndex) => (
                  <td
                    key={`second-${optIndex}`}
                    className="px-2 py-2 w-[186px] text-center"
                  >
                    <span>{formatValue(option.b2b)}</span>
                  </td>
                ))}
            </tr>

            {/* Unit Size Row */}
            <tr>
              <td className="py-2 w-16">{formatFieldName("unit_size_mm")}</td>
              {/* First variant options */}
              {spec.variants[0]?.options.map((option, optIndex) => (
                <td
                  key={`first-${optIndex}`}
                  className="px-2 py-2 w-[186px] text-center"
                >
                  <span>{formatValue(option.unit_size_mm)}</span>
                </td>
              ))}

              {/* Label column for second variant */}
              {spec.variants.length > 1 && (
                <td className="py-2 w-16">{formatFieldName("unit_size_mm")}</td>
              )}

              {/* Second variant options */}
              {spec.variants.length > 1 &&
                spec.variants[1]?.options.map((option, optIndex) => (
                  <td
                    key={`second-${optIndex}`}
                    className="px-2 py-2 w-[186px] text-center"
                  >
                    <span>{formatValue(option.unit_size_mm)}</span>
                  </td>
                ))}
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
                <td className="py-2 w-16">{formatFieldName("brightness")}</td>
                <td
                  className="px-2 py-2 text-center"
                  colSpan={variant.options.length}
                >
                  <span className="text-[9px]">
                    {formatValue(variant.brightness)}
                  </span>
                </td>
              </tr>

              {/* B2B Row */}
              <tr>
                <td className="py-2 w-16">{formatFieldName("b2b")}</td>
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
                <td className="py-2 w-16">{formatFieldName("unit_size_mm")}</td>
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
