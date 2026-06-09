export const STORAGE_KEYS = {
  ACTIVITIES: "CARBON_ACTIVITIES",
  BUDGET: "CARBON_BUDGET",
  REGION: "CARBON_REGION",
} as const;

export const CACHE_TTL_MS = 3_600_000;
export const CACHE_CLEANUP_INTERVAL_MS = 600_000;
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 30;
export const AI_MAX_HISTORY_ACTIVITIES = 30;
export const AI_CHAT_MAX_WORDS = 150;
export const AI_CHAT_MAX_MESSAGE_LENGTH = 2000;
export const PARSE_INPUT_MAX_LENGTH = 500;

export const DEFAULTS = {
  DAILY_BUDGET: 10,
  REGION: "global",
} as const;

export const CHALLENGES = [
  {
    id: "meatless-mon",
    title: "Meatless Monday",
    description: "Skip meat for one day",
  },
  {
    id: "bike-wed",
    title: "Bike to Work Wednesday",
    description: "Use a bike instead of a car",
  },
  {
    id: "public-transit",
    title: "Public Transit Week",
    description: "Take the bus or train instead of driving",
  },
] as const;

export const EMISSION_FACTOR_SOURCE = {
  TRANSPORT: "UK DEFRA 2024",
  FOOD: "Poore & Nemecek 2018",
  ENERGY: "UK DEFRA 2024",
  SHOPPING: "UK DEFRA 2024",
} as const;

export const GRID_AVERAGE_KG_PER_KWH = 0.4;

export const CO2_EQUIVALENTS = [
  { threshold: 0.01, text: "charging a smartphone", value: 0.008 },
  { threshold: 0.5, text: "boiling a kettle", value: 0.015 },
  { threshold: 2.0, text: "a load of laundry", value: 0.6 },
  { threshold: 10.0, text: "a gallon of gas consumed", value: 8.88 },
  { threshold: 50.0, text: "a tree grown for 10 years", value: 21.0 },
  { threshold: 200.0, text: "a flight from NY to LA", value: 150.0 },
] as const;

export const UI = {
  TOAST_SUCCESS: "Activity logged and analyzed!",
  TOAST_ERROR_PARSE: "Failed to process your activity. Please try again.",
  TOAST_ERROR_DEMO: "Failed to load demo data.",
  TOAST_SUCCESS_DEMO: "Demo data loaded! Check out your insights.",
  TOAST_SUCCESS_SETTINGS: "Settings saved successfully!",
  CONFIRM_CLEAR_DATA: "Clear all activity logs? This cannot be undone.",
} as const;

export const ACCESSIBILITY = {
  SKIP_TO_CONTENT: "Skip to main content",
  BUDGET_METER_LABEL: "Budget usage percentage",
  WEEKLY_TREND_LABEL: "7-day carbon emission trend",
  CATEGORY_CHART_LABEL: "Category breakdown chart",
  ACTIVITY_LOG_LABEL: "Activity input",
  CLOSE_MENU: "Close menu",
  OPEN_MENU: "Open menu",
  SEND_MESSAGE: "Send message",
  PROCESSING: "Processing your activity",
} as const;