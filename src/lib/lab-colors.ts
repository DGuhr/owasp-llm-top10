// Color mapping for OWASP Top 10 LLM labs — INNOQ brand palette
export const LAB_COLORS = {
  'LLM01': '#004153', // Prompt Injection - Petrol
  'LLM02': '#ff9c66', // Sensitive Info Disclosure - Apricot
  'LLM03': '#fff019', // Supply Chain - Yellow
  'LLM04': '#55cdaf', // Data Poisoning - Green
  'LLM05': '#24244c', // Improper Output - Blue
  'LLM06': '#ff4d67', // Excessive Agency - Red
  'LLM07': '#fc6e86', // System Prompt Leakage - Red 75%
  'LLM08': '#55cdaf', // Vector Embedding - Green
  'LLM09': '#ffb58c', // Misinformation - Apricot 75%
  'LLM10': '#005268', // Unbounded Consumption - Petrol 95%
} as const

export type LabId = keyof typeof LAB_COLORS
