import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "../lib/toast";

const TriggerToast: React.FC = () => {
  const { addToast } = useToast();
  return (
    <button
      type="button"
      onClick={() => addToast({ type: "success", message: "Lead created" })}
    >
      Trigger Toast
    </button>
  );
};

describe("ToastProvider", () => {
  it("shows a toast when addToast is called", async () => {
    render(
      <ToastProvider>
        <TriggerToast />
      </ToastProvider>
    );

    await userEvent.click(screen.getByRole("button", { name: /trigger toast/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Lead created");
  });
});
