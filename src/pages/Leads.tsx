import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { LeadCard } from "../components/LeadCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getLeads, updateLeadStage, type Lead } from "../services/api";

const pipelineStages = ["New", "Contacted", "Quoted", "Won", "Lost"];

type LeadsByStage = Record<string, Lead[]>;

export const LeadsPage: React.FC = () => {
  const [leadsByStage, setLeadsByStage] = useState<LeadsByStage>({});
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getLeads().then((leads) => {
      const grouped = pipelineStages.reduce<LeadsByStage>((acc, stage) => ({ ...acc, [stage]: [] }), {});
      leads.forEach((lead) => {
        const stage = pipelineStages.includes(lead.stage) ? lead.stage : "New";
        grouped[stage] = [...(grouped[stage] ?? []), lead];
      });
      setLeadsByStage(grouped);
    });
  }, []);

  const allLeads = useMemo(() => pipelineStages.flatMap((stage) => leadsByStage[stage] ?? []), [leadsByStage]);
  const filteredLeads = useMemo(() => allLeads.filter((lead) => lead.name.toLowerCase().includes(filter.toLowerCase())), [allLeads, filter]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceList = Array.from(leadsByStage[source.droppableId] ?? []);
    const [moved] = sourceList.splice(source.index, 1);
    const destinationList = Array.from(leadsByStage[destination.droppableId] ?? []);
    destinationList.splice(destination.index, 0, { ...moved, stage: destination.droppableId });

    const updated = {
      ...leadsByStage,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList
    };
    setLeadsByStage(updated);
    await updateLeadStage(moved.id, destination.droppableId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <div className="flex gap-2">
          <Input placeholder="Search leads" value={filter} onChange={(event) => setFilter(event.target.value)} className="w-64" />
          <Button variant="secondary">Add Lead</Button>
        </div>
      </div>

      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <div className="grid gap-4 lg:grid-cols-5">
            <DragDropContext onDragEnd={handleDragEnd}>
              {pipelineStages.map((stage) => (
                <Droppable droppableId={stage} key={stage}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex h-[calc(100vh-220px)] flex-col gap-3 rounded-lg border bg-card p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{stage}</span>
                        <span className="text-xs text-muted-foreground">{leadsByStage[stage]?.length ?? 0}</span>
                      </div>
                      <div className="flex-1 space-y-3 overflow-y-auto">
                        {(leadsByStage[stage] ?? []).map((lead, index) => (
                          <Draggable draggableId={lead.id} index={index} key={lead.id}>
                            {(dragProvided) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                onClick={() => navigate(`/leads/${lead.id}`)}
                              >
                                <LeadCard lead={lead} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
          </div>
        </TabsContent>
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Lead Directory</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Source</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Value</th>
                    <th className="px-4 py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-t text-sm hover:bg-muted/40" onClick={() => navigate(`/leads/${lead.id}`)}>
                      <td className="px-4 py-2 font-medium">{lead.name}</td>
                      <td className="px-4 py-2">{lead.source}</td>
                      <td className="px-4 py-2">{lead.stage}</td>
                      <td className="px-4 py-2">${lead.value.toLocaleString()}</td>
                      <td className="px-4 py-2">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
