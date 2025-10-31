import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login";

describe("Login page", () => {
  it("authenticates and calls onLogin", async () => {
    const authenticate = jest.fn().mockResolvedValue("token-123");
    const onLogin = jest.fn();

    render(<Login authenticate={authenticate} onLogin={onLogin} />);

    await userEvent.type(screen.getByRole("textbox", { name: /email/i }), "qa@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "secret");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(authenticate).toHaveBeenCalledWith("qa@example.com", "secret"));
    expect(onLogin).toHaveBeenCalledWith("token-123");
  });

  it("shows an error when authentication fails", async () => {
    const authenticate = jest.fn().mockRejectedValue(new Error("401"));
    const onLogin = jest.fn();

    render(<Login authenticate={authenticate} onLogin={onLogin} />);

    await userEvent.type(screen.getByRole("textbox", { name: /email/i }), "qa@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "secret" );
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
    expect(onLogin).not.toHaveBeenCalled();
  });
});
