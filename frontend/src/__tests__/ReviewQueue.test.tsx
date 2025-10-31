import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewQueue from "../components/ReviewQueue";

describe("ReviewQueue", () => {
  it("calls handlers when actions are clicked", async () => {
    const onApprove = jest.fn();
    const onReject = jest.fn();
    const items = [{ id: "change-1", description: "Update pricing copy" }];

    render(<ReviewQueue items={items} onApprove={onApprove} onReject={onReject} />);

    await userEvent.click(screen.getByRole("button", { name: /approve/i }));
    expect(onApprove).toHaveBeenCalledWith("change-1");

    await userEvent.click(screen.getByRole("button", { name: /reject/i }));
    expect(onReject).toHaveBeenCalledWith("change-1");
  });
});
