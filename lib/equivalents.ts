/**
 * CO2 equivalence thresholds for human-readable comparisons.
 * Each entry defines a threshold and its representative equivalent.
 */
export const CO2_EQUIVALENTS = [
  { threshold: 0.01, text: "charging a smartphone", value: 0.008 },
  { threshold: 0.5, text: "boiling a kettle", value: 0.015 },
  { threshold: 2.0, text: "a load of laundry", value: 0.6 },
  { threshold: 10.0, text: "a gallon of gas consumed", value: 8.88 },
  { threshold: 50.0, text: "a tree grown for 10 years", value: 21.0 },
  { threshold: 200.0, text: "a flight from NY to LA", value: 150.0 },
];

/**
 * Converts kg CO2e to a human-readable equivalence string.
 * @param kgCO2 - Emissions in kg CO2e
 * @returns Formatted string like "= 2.5x boiling a kettle"
 */
export function getEquivalent(kgCO2: number): string {
  if (kgCO2 <= 0) return "Zero emissions!";
  
  for (let i = CO2_EQUIVALENTS.length - 1; i >= 0; i--) {
    const equivalent = CO2_EQUIVALENTS[i];
    if (kgCO2 >= equivalent.threshold) {
      const count = Math.round((kgCO2 / equivalent.value) * 10) / 10;
      return `= ${count}x ${equivalent.text}`;
    }
  }
  
  const count = Math.round((kgCO2 / CO2_EQUIVALENTS[0].value) * 10) / 10;
  return `= ${count}x ${CO2_EQUIVALENTS[0].text}`;
}
