export function radians(degrees) {
  return degrees * Math.PI / 180.0;
}


export function degrees(rads) {
  return rads * 180.0 / Math.PI;
}


export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return null;
  }

  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}


export function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}


export function screenshotToNewWindow() {
  console.log("Remove this function, this is bullshit");
}


export function loadTextFile() {
  console.warn("This is not implemented");
}
