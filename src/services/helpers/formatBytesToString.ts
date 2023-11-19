const formatBytesToString = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) {
    return "0 Bytes";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  const unit = sizes[i];
  const rounding = ["MB", "GB", "TB"].includes(unit) ? 1 : 0;
  return `${(bytes / Math.pow(1000, i)).toFixed(rounding)} ${unit}`;
};
export default formatBytesToString;
