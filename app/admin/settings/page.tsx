"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Save, RefreshCw, ShieldCheck } from "lucide-react";
import { useAdminAuthStore } from "@/lib/mainwebsite/auth-store";
import Image from "next/image";

// Mock admin users for the roles table
const mockAdmins = [
  { id: 1, name: "Admin User", email: "admin@expertinthecity.com", role: "super-admin" },
  { id: 2, name: "John Moderator", email: "john@expertinthecity.com", role: "moderator" },
  { id: 3, name: "Sarah Analyst", email: "sarah@expertinthecity.com", role: "analyst" },
];

export default function SettingsPage() {
  const [automodEnabled, setAutomodEnabled] = useState(true);
  const [notificationThreshold, setNotificationThreshold] = useState(3);
  const [adminUsers, setAdminUsers] = useState(mockAdmins);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("moderator");
  const [contentFilters, setContentFilters] = useState({
    profanity: true,
    harassment: true,
    spam: true,
    nudity: true,
    violence: false,
  });

  const { user } = useAdminAuthStore();

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>

      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>
                Your admin account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div className="flex items-center gap-6">
                  <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt="Admin Avatar"
                    width={80}
                    height={80}
                    className="rounded-full border"
                  />
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-muted text-xs font-medium border">{user.role}</span>
                      {user.createdAt && (
                        <span className="text-xs text-muted-foreground ml-2">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {user.bio && (
                      <div className="text-sm mt-2 text-muted-foreground">{user.bio}</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure timezone and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}