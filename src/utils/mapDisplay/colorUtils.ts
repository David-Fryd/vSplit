import type { GroupInfo } from "./renderPolygons";
// A utility function to convert hex color to RGB
const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// A utility function to convert RGB color to hex
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export function averageHexFromGroupcolors(uniqueGroupsInfo: GroupInfo[]) {
  // Calculate the average color
  let sumR = 0,
    sumG = 0,
    sumB = 0;
  uniqueGroupsInfo.forEach((groupInfo: GroupInfo) => {
    const rgb = hexToRgb(groupInfo.groupColor);
    if (rgb !== null) {
      sumR += rgb.r;
      sumG += rgb.g;
      sumB += rgb.b;
    }
  });

  // Calculate average values and convert to hex
  const avgR = Math.round(sumR / uniqueGroupsInfo.length);
  const avgG = Math.round(sumG / uniqueGroupsInfo.length);
  const avgB = Math.round(sumB / uniqueGroupsInfo.length);
  const combinedGroupColor = rgbToHex(avgR, avgG, avgB);
  return combinedGroupColor;
}
