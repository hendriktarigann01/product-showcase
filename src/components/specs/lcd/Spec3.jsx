import React from "react";

const fieldMappings = {
  size: "Size",
  touchscreen: "Touchscreen",
  os: "OS",
  android: "Android",
  windows: "Windows",
  maxres: "Maximum Resolution",
  ram: "RAM",
  storage: "Storage",
};

const formatFieldName = (key) => fieldMappings[key] || key;
const formatValue = (value) => {
  if (value === "OPT") return "Optional";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value || "-";
};

export function Spec3({ specs }) {
  if (!specs || specs.length === 0) return null;

  const allFields = Array.from(
    new Set(
      specs.flatMap((spec) => Object.keys(spec).filter((key) => key !== "type"))
    )
  );

  return (
    <div className="px-8 mt-4">
      <table className="table-fixed w-full text-left text-sm text-gray-600">
        <tbody>
          {Array.from({ length: Math.ceil(allFields.length / 2) }).map(
            (_, i) => {
              const leftField = allFields[i * 2];
              const rightField = allFields[i * 2 + 1];

              return (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } align-top`}
                >
                  <td className="py-3 px-4 font-medium w-48">
                    {formatFieldName(leftField)}
                  </td>
                  {specs.map((spec, index) => (
                    <td key={`left-${i}-${index}`} className="py-3 px-4">
                      {formatValue(spec[leftField])}
                    </td>
                  ))}

                  {rightField ? (
                    <>
                      <td className="py-3 px-4 font-medium w-48">
                        {formatFieldName(rightField)}
                      </td>
                      {specs.map((spec, index) => (
                        <td key={`right-${i}-${index}`} className="py-3 px-4">
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
}

export default Spec3;
