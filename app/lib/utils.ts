export function parseDateString(date: Date | string) {
  let d = new Date(date);
  let hours = d.getHours();
  let ampm = hours > 12 ? "pm" : "am";
  hours = hours > 12 ? hours - 12 : hours;
  let ds = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()} at ${hours}:${`${d.getMinutes()}`.padStart(
    2,
    "0"
  )} ${ampm}`;

  return ds;
}

export function calculateColorInRange(
  percentage: number,
  start: string,
  end: string
) {
  const startRGB = {
    red: parseInt(start.substring(1, 3), 16),
    green: parseInt(start.substring(3, 5), 16),
    blue: parseInt(start.substring(5), 16),
  };

  const endRGB = {
    red: parseInt(end.substring(1, 3), 16),
    green: parseInt(end.substring(3, 5), 16),
    blue: parseInt(end.substring(5), 16),
  };

  const red = Math.round(
    startRGB.red + (percentage / 100) * (endRGB.red - startRGB.red)
  ).toString(16);
  const green = Math.round(
    startRGB.green + (percentage / 100) * (endRGB.green - startRGB.green)
  ).toString(16);
  const blue = Math.round(
    startRGB.blue + (percentage / 100) * (endRGB.blue - startRGB.blue)
  ).toString(16);

  return `#${red}${green}${blue}`;
}
