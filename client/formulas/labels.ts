type labelColor = "indigo" | "gray" | "green" | "blue" | "red" | "purple";
export const labelClasses: labelColor[] = [
  "indigo",
  "gray",
  "green",
  "blue",
  "red",
  "purple",
];
export const getLabelTextColor = (color: labelColor): string => {
  switch (color) {
    case "indigo":
      return "text-indigo-400";
    case "gray":
      return "text-gray-400";
    case "green":
      return "text-green-400";
    case "blue":
      return "text-blue-400";
    case "red":
      return "text-red-400";
    case "purple":
      return "text-purple-400";
    default:
      return "text-primary";
  }
};

// export const getLabelBgColor = (color: string): string => {
//   switch (color) {
//     case "indigo":
//       return "bg-indigo-500";
//     case "gray":
//       return "bg-gray-500";
//     case "green":
//       return "bg-green-500";
//     case "blue":
//       return "bg-blue-500";
//     case "red":
//       return "bg-red-500";
//     case "purple":
//       return "bg-purple-500";
//     default:
//       return "bg-primary";
//   }
// };
export function getLabelBgColor(
  color: string
): { checkbox: string; label: string } {
  switch (color) {
    case "indigo":
      return {
        checkbox: "data-[state=checked]:bg-indigo-500 border-indigo-500",
        label: "border-indigo-200",
      };
    case "gray":
      return {
        checkbox: "data-[state=checked]:bg-gray-500 border-gray",
        label: "bg-gray-200",
      };
    case "green":
      return {
        checkbox: "data-[state=checked]:bg-green-500 border-green",
        label: "bg-green-200",
      };
    case "blue":
      return {
        checkbox: "data-[state=checked]:bg-blue-500 border-blue-500",
        label: "bg-blue-200",
      };
    case "red":
      return {
        checkbox: "data-[state=checked]:bg-red-500 border-red-500",
        label: "bg-red-200",
      };
    case "purple":
      return {
        checkbox: "data-[state=checked]:bg-purple-500 border-purple",
        label: "bg-purple-200",
      };
    default:
      return {
        checkbox: "data-[state=checked]:bg-primary border-primary",
        label: "bg-primary",
      };
  }
};

export const getCheckboxBgColor = (color: string): string => {
  switch (color) {
    case "indigo":
      return "data-[state=checked]:bg-indigo-500 border-indigo-500";
    case "gray":
      return "bg-gray-500";
    case "green":
      return "bg-green-500";
    case "blue":
      return "bg-blue-500";
    case "red":
      return "data-[state=checked]:bg-red-500 border-red-500";
    case "purple":
      return "bg-purple-500";
    default:
      return "data-[state=checked]:bg-primary border-primary";
  }
};

export const getAppLabelBgColor = (color: string): string => {
  switch (color) {
    case "indigo":
      return "bg-indigo-200";
    case "gray":
      return "bg-gray-200";
    case "green":
      return "bg-green-200";
    case "blue":
      return "bg-blue-200";
    case "red":
      return "bg-red-200";
    case "purple":
      return "bg-purple-200";
    default:
      return "bg-primary";
  }
};
