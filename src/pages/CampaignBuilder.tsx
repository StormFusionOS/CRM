import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { generateId } from "../lib/id";

interface CampaignStep {
  id: string;
  title: string;
  description: string;
}

const defaultSteps: CampaignStep[] = [
  { id: "1", title: "Audience", description: "Define target segment and filters." },
  { id: "2", title: "Content", description: "Select email/SMS templates." },
  { id: "3", title: "Schedule", description: "Choose start date and cadence." }
];

export const CampaignBuilderPage: React.FC = () => {
  const [steps, setSteps] = useState(defaultSteps);
  const [campaignName, setCampaignName] = useState("");
  const [type, setType] = useState("email");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Campaign Builder</h1>
      <Card>
        <CardHeader>
          <CardTitle>Campaign Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Campaign name" value={campaignName} onChange={(event) => setCampaignName(event.target.value)} />
            <Input placeholder="Type (email, sms, seo)" value={type} onChange={(event) => setType(event.target.value)} />
          </div>
          <Textarea placeholder="Objectives and notes" />
        </CardContent>
      </Card>

      <Tabs defaultValue="steps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="steps" className="space-y-4">
          {steps.map((step, index) => (
            <Card key={step.id}>
              <CardHeader>
                <CardTitle>
                  Step {index + 1}: {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={step.description}
                  onChange={(event) =>
                    setSteps((prev) => prev.map((item) => (item.id === step.id ? { ...item, description: event.target.value } : item)))
                  }
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="secondary"
            onClick={() => setSteps((prev) => [...prev, { id: generateId(), title: `Step ${prev.length + 1}`, description: "" }])}
          >
            Add Step
          </Button>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Execution Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>Name:</strong> {campaignName || "Untitled Campaign"}
              </p>
              <p>
                <strong>Type:</strong> {type.toUpperCase()}
              </p>
              <div>
                <strong>Steps:</strong>
                <ol className="ml-5 list-decimal space-y-2">
                  {steps.map((step) => (
                    <li key={step.id}>{step.description || step.title}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
