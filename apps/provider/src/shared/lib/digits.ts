const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

export function toLatinDigits(value: string): string {
  return Array.from(value, (character) => {
    const persianIndex = persianDigits.indexOf(character);
    if (persianIndex >= 0) return String(persianIndex);

    const arabicIndex = arabicDigits.indexOf(character);
    return arabicIndex >= 0 ? String(arabicIndex) : character;
  }).join("");
}

export function getDigits(value: string): string {
  return toLatinDigits(value).replace(/\D/g, "");
}

export function constrainDigitCount(value: string, maximumDigits: number): string {
  return getDigits(value).slice(0, Math.max(0, maximumDigits));
}
