import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="scraper">Scraper</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-semibold">Jane Admin</p>
                <p className="text-xs text-muted-foreground">admin@company.com • Admin</p>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <Input placeholder="Invite email" />
                <Input placeholder="Role" />
                <Button>Send Invite</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-semibold">Twilio</p>
                <Input placeholder="API Key" />
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-semibold">SMTP</p>
                <Input placeholder="SMTP Connection" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scraper">
          <Card>
            <CardHeader>
              <CardTitle>Scraper Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input type="number" placeholder="Crawl frequency (hours)" />
              <Textarea placeholder="Allowed domains" />
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input type="time" placeholder="Backup schedule" />
              <Textarea placeholder="Maintenance notes" />
              <Button>Update</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
