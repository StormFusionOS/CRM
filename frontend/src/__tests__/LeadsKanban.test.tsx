import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LeadsKanban, Lead } from "../components/LeadsKanban";

describe("LeadsKanban", () => {
  const leads: Lead[] = [
    { id: "1", name: "Ada Lovelace", company: "Analytical Engines", status: "new" },
    { id: "2", name: "Grace Hopper", company: "Cobol Inc", status: "contacted" }
  ];

  it("renders leads in the correct columns and triggers move handler", () => {
    const handleMove = jest.fn();
    render(<LeadsKanban leads={leads} onMoveLead={handleMove} />);

    expect(screen.getByRole("heading", { name: /new/i })).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Move to Qualified/i })[0]);
    expect(handleMove).toHaveBeenCalledWith("1", "qualified");
  });
});
