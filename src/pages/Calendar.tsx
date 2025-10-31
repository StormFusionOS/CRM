import React, { useMemo, useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { generateId } from "../lib/id";

interface Appointment {
  id: string;
  title: string;
  contact: string;
  date: string;
  time: string;
}

const sampleAppointments: Appointment[] = [
  { id: "1", title: "On-site estimate", contact: "John D.", date: "2023-11-08", time: "10:00" },
  { id: "2", title: "Design review", contact: "Lisa K.", date: "2023-11-09", time: "14:00" }
];

export const CalendarPage: React.FC = () => {
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [time, setTime] = useState("09:00");

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, []);

  const handleCreateAppointment = () => {
    setAppointments((prev) => [
      ...prev,
      { id: generateId(), title, contact, date: selectedDate, time }
    ]);
    setTitle("");
    setContact("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
              <DialogDescription>Connect with leads and customers.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
              <Input placeholder="Contact" value={contact} onChange={(event) => setContact(event.target.value)} />
              <Input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
              <Input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateAppointment}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Week Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-7">
          {weekDays.map((day) => {
            const dayAppointments = appointments.filter((appointment) => appointment.date === format(day, "yyyy-MM-dd"));
            return (
              <div key={day.toISOString()} className="rounded-lg border p-3">
                <p className="text-sm font-semibold">{format(day, "EEE dd")}</p>
                <div className="mt-2 space-y-2">
                  {dayAppointments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No appointments</p>
                  ) : (
                    dayAppointments.map((appointment) => (
                      <div key={appointment.id} className="rounded-md bg-primary/10 p-2 text-xs">
                        <p className="font-semibold">{appointment.title}</p>
                        <p className="text-muted-foreground">{appointment.contact}</p>
                        <p>{appointment.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
