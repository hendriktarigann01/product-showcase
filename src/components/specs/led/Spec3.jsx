import React from "react";

const fieldMappings = {
  product_size: "Product Size",
  module_size: "Module Size",
  display_resolution: "Display Resolution",
  pixel_density: "Pixel Density",
  module_display_size: "Module Display Size",
  module_weight: "Module Weight",
  input_voltage: "Input Voltage (W / Screen)",
  refresh_frequency: "Refresh Frequency",
};

const formatFieldName = (key) => fieldMappings[key] || key;
const formatValue = (value) => {
  if (value === "OPT") return "Optional";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value || "-";
};

export function Spec3_LED({ specs }) {
  if (!specs || specs.length === 0) return null;

  const allFields = Array.from(
    new Set(
      specs.flatMap((spec) => Object.keys(spec).filter((key) => key !== "type"))
    )
  );

  const MobileLayout = () => (
    <div className="px-4 sm:px-6 mt-5">
      <div className="space-y-4">
        {specs.map((spec, specIndex) => (
          <div key={specIndex} className="p-4">
            <div className="space-y-2">
              {allFields.map((field) => (
                <div key={field} className="flex items-center py-1">
                  <div className="w-40">
                    <span className="text-xs font-medium text-gray-600">
                      {formatFieldName(field)}
                    </span>
                  </div>
                  <div className="w-auto">
                    <span className="text-xs text-gray-700">
                      {formatValue(spec[field])}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DesktopLayout = () => (
    <div className="px-8 flex justify-center">
      <table className="table-fixed text-left text-sm text-gray-600">
        <tbody>
          {Array.from({ length: Math.ceil(allFields.length / 2) }).map(
            (_, i) => {
              const leftField = allFields[i * 2];
              const rightField = allFields[i * 2 + 1];

              return (
                <tr key={i}>
                  <td className="py-2 px-1 font-medium w-48">
                    {formatFieldName(leftField)}
                  </td>
                  {specs.map((spec, index) => (
                    <td key={`left-${i}-${index}`} className="py-2 w-72">
                      {formatValue(spec[leftField])}
                    </td>
                  ))}

                  {rightField ? (
                    <>
                      <td className="py-2 px-1 font-medium w-48">
                        {formatFieldName(rightField)}
                      </td>
                      {specs.map((spec, index) => (
                        <td key={`right-${i}-${index}`} className="py-2 ">
                          {formatValue(spec[rightField])}
                        </td>
                      ))}
                    </>
                  ) : (
                    <>
                      <td></td>
                      {specs.map((_, idx) => (
                        <td key={`empty-${i}-${idx}`}></td>
                      ))}
                    </>
                  )}
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="block sm:hidden">
        <MobileLayout />
      </div>
      <div className="hidden sm:block lg:hidden">
        <MobileLayout />
      </div>
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </>
  );
}

export default Spec3_LED;
