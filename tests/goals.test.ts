import { describe, it, expect } from "vitest";
import { calculateGoalProgress } from "../src/services/goals";

describe("Dream Goals Domain Calculations (Ticket 03 Seam)", () => {
  it("calculates progress percentage and remaining amount correctly", () => {
    const target = 5000000;
    const saved = 2000000;

    const progress = calculateGoalProgress(target, saved);

    expect(progress.percentage).toBe(40);
    expect(progress.remaining).toBe(3000000);
    expect(progress.isAchieved).toBe(false);
  });

  it("caps percentage at 100% and flags isAchieved when saved reaches target", () => {
    const target = 4500000;
    const saved = 4500000;

    const progress = calculateGoalProgress(target, saved);

    expect(progress.percentage).toBe(100);
    expect(progress.remaining).toBe(0);
    expect(progress.isAchieved).toBe(true);
  });

  it("handles over-funded goals without exceeding 100% or giving negative remaining", () => {
    const target = 3000000;
    const saved = 3500000;

    const progress = calculateGoalProgress(target, saved);

    expect(progress.percentage).toBe(100);
    expect(progress.remaining).toBe(0);
    expect(progress.isAchieved).toBe(true);
  });

  it("handles zero or negative targets safely", () => {
    const progress = calculateGoalProgress(0, 100000);
    expect(progress.percentage).toBe(0);
    expect(progress.remaining).toBe(0);
  });
});
