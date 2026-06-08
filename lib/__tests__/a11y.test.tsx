import { render, act } from "@testing-library/react";
import { axe } from "jest-axe";

import Home from "../../app/page";

jest.mock("../../lib/store", () => ({
  useStore: () => ({
    activities: [],
    dailyFootprint: 0,
    budgetUsed: 0,
    weeklyTrend: [],
    recommendations: [],
    challenges: [],
    insight: null,
    isProcessing: false,
    dailyBudget: 10,
    region: "global",
    loadSampleData: jest.fn(),
    toggleChallenge: jest.fn(),
  }),
}));

jest.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter" }),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

it("landing page has no accessibility violations", async () => {
  const { container } = render(<Home />);
  const results = await act(async () => axe(container));
  expect(results).toHaveNoViolations();
});
