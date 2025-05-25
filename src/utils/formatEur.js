export default function formatEur(value, perM2 = false) {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (isNaN(num)) return value;
  const formatted = num.toLocaleString("et-EE");
  return perM2 ? `${formatted} €/m²` : `${formatted} €`;
} 