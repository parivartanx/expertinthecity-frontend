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

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveAutomod = () => {
    toast.success("Automoderation settings saved successfully");
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail) {
      toast.error("Please enter an email address");
      return;
    }

    // Add new admin
    const newAdmin = {
      id: adminUsers.length + 1,
      name: newAdminEmail.split('@')[0], // Simple name from email
      email: newAdminEmail,
      role: newAdminRole,
    };

    setAdminUsers([...adminUsers, newAdmin]);
    setNewAdminEmail("");
    toast.success(`New ${newAdminRole} added successfully`);
  };

  const handleRemoveAdmin = (id: number) => {
    setAdminUsers(adminUsers.filter(admin => admin.id !== id));
    toast.success("Admin user removed successfully");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
              <CardDescription>
                Configure general platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Platform Name</Label>
                <Input id="site-name" defaultValue="ExpertInTheCity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Support Email</Label>
                <Input id="contact-email" defaultValue="support@expertinthecity.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenance-mode" />
                  <Label htmlFor="maintenance-mode">Enable maintenance mode</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, only admins can access the platform
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
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
        
        {/* Role Management Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Manage users with administrative access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {admin.role === "super-admin" && (
                              <ShieldCheck className="h-4 w-4 text-primary" />
                            )}
                            <span className="capitalize">{admin.role}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAdmin(admin.id)}
                            disabled={admin.role === "super-admin"} // Prevent removing super-admin
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Admin User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Admin User</DialogTitle>
                    <DialogDescription>
                      Add a new user with administrative access
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        placeholder="Enter email address"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newAdminRole}
                        onValueChange={setNewAdminRole}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleAddAdmin}>
                      Add User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Configure access levels for each role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Super Admin</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Has full access to all platform features and settings
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="super-admin-1" checked disabled />
                    <Label htmlFor="super-admin-1">User Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="super-admin-2" checked disabled />
                    <Label htmlFor="super-admin-2">Expert Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="super-admin-3" checked disabled />
                    <Label htmlFor="super-admin-3">Content Moderation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="super-admin-4" checked disabled />
                    <Label htmlFor="super-admin-4">System Settings</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Moderator</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Can moderate content and manage reports
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="moderator-1" defaultChecked />
                    <Label htmlFor="moderator-1">User Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="moderator-2" defaultChecked />
                    <Label htmlFor="moderator-2">Expert Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="moderator-3" defaultChecked />
                    <Label htmlFor="moderator-3">Content Moderation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="moderator-4" />
                    <Label htmlFor="moderator-4">System Settings</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Analyst</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Has read-only access to data and analytics
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="analyst-1" />
                    <Label htmlFor="analyst-1">User Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="analyst-2" />
                    <Label htmlFor="analyst-2">Expert Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="analyst-3" />
                    <Label htmlFor="analyst-3">Content Moderation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="analyst-4" />
                    <Label htmlFor="analyst-4">System Settings</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Permissions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Content Moderation Tab */}
        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Moderation</CardTitle>
              <CardDescription>
                Configure automatic content moderation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="automod-toggle" 
                  checked={automodEnabled}
                  onCheckedChange={setAutomodEnabled}
                />
                <Label htmlFor="automod-toggle">Enable automated moderation</Label>
              </div>
              
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-medium">Content Filters</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="filter-profanity" 
                      checked={contentFilters.profanity}
                      onCheckedChange={(checked) => 
                        setContentFilters({...contentFilters, profanity: checked})
                      }
                      disabled={!automodEnabled}
                    />
                    <Label htmlFor="filter-profanity">Profanity Filter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="filter-harassment" 
                      checked={contentFilters.harassment}
                      onCheckedChange={(checked) => 
                        setContentFilters({...contentFilters, harassment: checked})
                      }
                      disabled={!automodEnabled}
                    />
                    <Label htmlFor="filter-harassment">Harassment Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="filter-spam" 
                      checked={contentFilters.spam}
                      onCheckedChange={(checked) => 
                        setContentFilters({...contentFilters, spam: checked})
                      }
                      disabled={!automodEnabled}
                    />
                    <Label htmlFor="filter-spam">Spam Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="filter-nudity" 
                      checked={contentFilters.nudity}
                      onCheckedChange={(checked) => 
                        setContentFilters({...contentFilters, nudity: checked})
                      }
                      disabled={!automodEnabled}
                    />
                    <Label htmlFor="filter-nudity">Nudity Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="filter-violence" 
                      checked={contentFilters.violence}
                      onCheckedChange={(checked) => 
                        setContentFilters({...contentFilters, violence: checked})
                      }
                      disabled={!automodEnabled}
                    />
                    <Label htmlFor="filter-violence">Violence Detection</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="sensitivity">Sensitivity Level</Label>
                  <span className="text-sm">Medium</span>
                </div>
                <Slider
                  id="sensitivity"
                  defaultValue={[50]}
                  max={100}
                  step={25}
                  disabled={!automodEnabled}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lenient</span>
                  <span>Strict</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAutomod}>Save Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Keyword Blocklist</CardTitle>
              <CardDescription>
                Configure words and phrases to be automatically flagged
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blocklist">Blocked Keywords</Label>
                <Textarea 
                  id="blocklist" 
                  placeholder="Enter keywords separated by commas"
                  defaultValue="inappropriate, offensive, [banned-term]"
                  disabled={!automodEnabled}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Content containing these keywords will be automatically flagged for review
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Reset to Default
              </Button>
              <Button className="gap-1">
                <Save className="h-4 w-4" />
                Save Blocklist
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notifications</CardTitle>
              <CardDescription>
                Configure what events trigger admin notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>User Reports</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-reports" defaultChecked />
                      <Label htmlFor="notify-reports">New reports</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="report-threshold" className="text-sm text-muted-foreground">
                          Notification threshold
                        </Label>
                        <span className="text-sm text-muted-foreground">{notificationThreshold} reports</span>
                      </div>
                      <Slider
                        id="report-threshold"
                        value={[notificationThreshold]}
                        max={10}
                        step={1}
                        onValueChange={(value) => setNotificationThreshold(value[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Notify when content receives this many reports
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Experts</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-expert-signup" defaultChecked />
                      <Label htmlFor="notify-expert-signup">New expert sign-ups</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-expert-verif" defaultChecked />
                      <Label htmlFor="notify-expert-verif">Verification requests</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Content</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-flagged" defaultChecked />
                      <Label htmlFor="notify-flagged">Flagged content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-pending" />
                      <Label htmlFor="notify-pending">Pending content approval</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>System</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-system" defaultChecked />
                      <Label htmlFor="notify-system">System alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-errors" defaultChecked />
                      <Label htmlFor="notify-errors">Error reports</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure email notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-digest">Daily Summary Email</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="email-digest" defaultChecked />
                  <Label htmlFor="email-digest">Receive daily platform summary</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-reports">Critical Reports</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="email-reports" defaultChecked />
                  <Label htmlFor="email-reports">Email for high-priority reports</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-time">Digest Delivery Time</Label>
                <Select defaultValue="9am">
                  <SelectTrigger id="email-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6am">6:00 AM</SelectItem>
                    <SelectItem value="9am">9:00 AM</SelectItem>
                    <SelectItem value="12pm">12:00 PM</SelectItem>
                    <SelectItem value="5pm">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-emails">Notification Recipients</Label>
                <Input 
                  id="notification-emails" 
                  placeholder="Email addresses separated by commas"
                  defaultValue="admin@expertinthecity.com"
                />
                <p className="text-xs text-muted-foreground">
                  Multiple email addresses can be added for critical notifications
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Email Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}