import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { generateId } from "../lib/id";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const initialQuotes = [
  { id: "Q-101", customer: "Acme Corp", status: "sent", total: 3200 },
  { id: "Q-102", customer: "Jane Smith", status: "draft", total: 850 },
  { id: "INV-204", customer: "Bright Co.", status: "paid", total: 4200 }
];

export const QuotesPage: React.FC = () => {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Service Fee", quantity: 1, unitPrice: 500 }
  ]);

  const subtotal = useMemo(
    () => lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
    [lineItems]
  );

  const handleLineItemChange = (index: number, updates: Partial<LineItem>) => {
    setLineItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...updates } : item)));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Quotes & Invoices</h1>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {initialQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-semibold">{quote.id}</p>
                    <p className="text-xs text-muted-foreground">{quote.customer}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="capitalize">{quote.status}</p>
                    <p>${quote.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>Create Quote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="Client name" />
                <Input placeholder="Quote title" />
              </div>
              <Textarea placeholder="Notes or terms" />
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="grid gap-2 md:grid-cols-4">
                    <Input
                      className="md:col-span-2"
                      placeholder="Description"
                      value={item.description}
                      onChange={(event) => handleLineItemChange(index, { description: event.target.value })}
                    />
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => handleLineItemChange(index, { quantity: Number(event.target.value) })}
                    />
                    <Input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(event) => handleLineItemChange(index, { unitPrice: Number(event.target.value) })}
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  onClick={() => setLineItems((prev) => [...prev, { id: generateId(), description: "", quantity: 1, unitPrice: 0 }])}
                >
                  Add Line Item
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button>Create PDF</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
