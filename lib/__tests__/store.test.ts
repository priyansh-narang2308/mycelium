import { useStore } from "../store";
import { Activity } from "../types";

function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: "1",
    category: "transport",
    subCategory: "car",
    amount: 10,
    unit: "km",
    co2e: 1.7,
    timestamp: new Date().toISOString(),
    equivalent: "= 212.5x charging a smartphone",
    rawInput: "drove 10km",
    ...overrides,
  };
}

describe("useStore", () => {
  beforeEach(() => {
    useStore.setState({
      activities: [],
      dailyFootprint: 0,
      budgetUsed: 0,
      weeklyTrend: [],
      recommendations: [],
      challenges: [
        { id: "c1", title: "Challenge 1", description: "Desc", active: false, streak: 0, completed: false },
        { id: "c2", title: "Challenge 2", description: "Desc", active: false, streak: 0, completed: false },
      ],
      insight: null,
      isProcessing: false,
      region: "global",
    });
  });

  it("starts with an empty state", () => {
    const state = useStore.getState();
    expect(state.activities.length).toBe(0);
    expect(state.dailyFootprint).toBe(0);
  });

  it("adds an activity and updates footprint", () => {
    const store = useStore.getState();
    store.addActivity(makeActivity({ id: "1", co2e: 1.7 }));

    const state = useStore.getState();
    expect(state.activities.length).toBe(1);
    expect(state.activities[0].subCategory).toBe("car");
    expect(state.dailyFootprint).toBe(1.7);
  });

  it("appends multiple activities and sums footprint", () => {
    const store = useStore.getState();
    store.addActivity(makeActivity({ id: "1", co2e: 1.7 }));
    store.addActivity(makeActivity({ id: "2", co2e: 5.4, category: "food", subCategory: "beef", rawInput: "ate beef" }));

    const state = useStore.getState();
    expect(state.activities.length).toBe(2);
    expect(state.dailyFootprint).toBe(1.7 + 5.4);
  });

  it("caps budgetUsed at 100", () => {
    const store = useStore.getState();
    store.addActivity(makeActivity({ id: "1", co2e: 999, rawInput: "huge emissions" }));

    const state = useStore.getState();
    expect(state.budgetUsed).toBe(100);
  });

  it("clears activities and resets state", () => {
    const store = useStore.getState();
    store.addActivity(makeActivity({ id: "1", co2e: 1.7 }));
    store.clearActivities();

    const state = useStore.getState();
    expect(state.activities.length).toBe(0);
    expect(state.dailyFootprint).toBe(0);
    expect(state.budgetUsed).toBe(0);
  });

  it("sets recommendations", () => {
    const rec = { id: "r1", title: "Test", description: "Desc", potentialSavings: 100, difficulty: "Easy" as const };
    useStore.getState().setRecommendations([rec]);

    expect(useStore.getState().recommendations).toEqual([rec]);
  });

  it("sets insight", () => {
    useStore.getState().setInsight("You're doing great!");

    expect(useStore.getState().insight).toBe("You're doing great!");
  });

  it("toggles challenge active state and increments streak", () => {
    const store = useStore.getState();
    expect(store.challenges.length).toBeGreaterThan(0);
    const firstId = store.challenges[0].id;

    store.toggleChallenge(firstId);
    expect(useStore.getState().challenges[0].active).toBe(true);
    expect(useStore.getState().challenges[0].streak).toBe(1);

    useStore.getState().toggleChallenge(firstId);
    expect(useStore.getState().challenges[0].active).toBe(false);
  });

  it("starts with default global region", () => {
    expect(useStore.getState().region).toBe("global");
  });

  it("sets region correctly", () => {
    useStore.getState().setRegion("india");
    expect(useStore.getState().region).toBe("india");
  });
});
