import { render, screen } from "@testing-library/react";
import { ActivityLog } from "../../components/ActivityLog";

jest.mock("../../lib/store", () => ({
  useStore: () => ({
    activities: [],
    addActivity: jest.fn(),
    setRecommendations: jest.fn(),
    setInsight: jest.fn(),
    setIsProcessing: jest.fn(),
    isProcessing: false,
  }),
}));

describe("ActivityLog", () => {
  it("renders the input field", () => {
    render(<ActivityLog />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<ActivityLog />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
  });

  it("renders the terminal header", () => {
    render(<ActivityLog />);
    expect(screen.getByText("Log Activity")).toBeInTheDocument();
  });
});
