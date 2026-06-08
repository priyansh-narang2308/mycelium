import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ActivityLog } from "../../components/ActivityLog";

const mockAddActivity = jest.fn();
const mockSetRecommendations = jest.fn();
const mockSetInsight = jest.fn();
const mockSetIsProcessing = jest.fn();

let mockIsProcessing = false;

jest.mock("../../lib/store", () => ({
  useStore: () => ({
    activities: [],
    addActivity: mockAddActivity,
    setRecommendations: mockSetRecommendations,
    setInsight: mockSetInsight,
    setIsProcessing: mockSetIsProcessing,
    isProcessing: mockIsProcessing,
    region: "global",
  }),
}));

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockIsProcessing = false;
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ category: "transport", subCategory: "car", amount: 10 }),
  });
});

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

  it("disables submit button when input is empty", () => {
    render(<ActivityLog />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("enables submit button when input has text", () => {
    render(<ActivityLog />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "drove 10km" } });
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).not.toBeDisabled();
  });

  it("disables button while processing", () => {
    mockIsProcessing = true;
    render(<ActivityLog />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "drove 10km" } });
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("calls API and updates store on submit", async () => {
    render(<ActivityLog />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "drove 10km" } });

    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/parse",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: "drove 10km", region: "global" }),
        }),
      );
    });

    expect(mockSetIsProcessing).toHaveBeenCalledWith(true);
    expect(mockAddActivity).toHaveBeenCalled();
    expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
  });
});
