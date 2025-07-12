import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Megaphone, Plus, AlertCircle, Calendar, Users, Pin } from "lucide-react";

export default function Announcements() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const announcements = [
    {
      id: 1,
      title: "Holiday Schedule Update",
      content: "Please note that the office will be closed on February 19th (Presidents Day). All employees are expected to return to work on February 20th.",
      type: "holiday",
      priority: "medium",
      targetAudience: "all",
      publishDate: "2024-01-25",
      expiryDate: "2024-02-20",
      createdBy: "HR Manager",
      isRead: false,
      isPinned: true
    },
    {
      id: 2,
      title: "New Health Insurance Benefits",
      content: "We're excited to announce enhanced health insurance coverage starting March 1st. New benefits include dental coverage, vision care, and mental health support. HR will be hosting information sessions next week.",
      type: "policy",
      priority: "high",
      targetAudience: "all",
      publishDate: "2024-01-20",
      expiryDate: "2024-03-01",
      createdBy: "HR Manager",
      isRead: true,
      isPinned: true
    },
    {
      id: 3,
      title: "IT System Maintenance",
      content: "Scheduled system maintenance will occur this Saturday from 10 PM to 2 AM. Email and internal systems may be temporarily unavailable during this time.",
      type: "urgent",
      priority: "high",
      targetAudience: "all",
      publishDate: "2024-01-18",
      expiryDate: "2024-01-28",
      createdBy: "IT Support",
      isRead: true,
      isPinned: false
    },
    {
      id: 4,
      title: "Team Building Event",
      content: "Join us for our quarterly team building event on March 15th at the community center. Activities include team challenges, lunch, and networking. RSVP required by March 10th.",
      type: "event",
      priority: "medium",
      targetAudience: "all",
      publishDate: "2024-01-15",
      expiryDate: "2024-03-15",
      createdBy: "HR Manager",
      isRead: true,
      isPinned: false
    },
    {
      id: 5,
      title: "Updated Remote Work Policy",
      content: "Based on feedback, we're updating our remote work policy to allow up to 3 days per week of remote work for eligible positions. Please review the updated guidelines on the intranet.",
      type: "policy",
      priority: "medium",
      targetAudience: "all",
      publishDate: "2024-01-10",
      expiryDate: null,
      createdBy: "HR Manager",
      isRead: true,
      isPinned: false
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive" className="ml-2"><AlertCircle className="w-3 h-3 mr-1" />Urgent</Badge>;
      case "high":
        return <Badge variant="secondary" className="ml-2 bg-orange-500 text-white">High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="ml-2">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="ml-2">Low</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "policy":
        return <Badge variant="secondary" className="bg-blue-500 text-white">Policy</Badge>;
      case "event":
        return <Badge variant="secondary" className="bg-green-500 text-white">Event</Badge>;
      case "holiday":
        return <Badge variant="secondary" className="bg-purple-500 text-white">Holiday</Badge>;
      case "general":
        return <Badge variant="outline">General</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const regularAnnouncements = announcements.filter(a => !a.isPinned);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">
              Stay updated with company news and important information
            </p>
          </div>
          {user.role === 'hr' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Share important information with employees
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter announcement title" />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Enter announcement content"
                      className="min-h-[120px]" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="policy">Policy</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Employees</SelectItem>
                          <SelectItem value="hr">HR Department</SelectItem>
                          <SelectItem value="it">IT Department</SelectItem>
                          <SelectItem value="managers">Managers Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                      <Input type="date" id="expiry" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsDialogOpen(false)}>
                      Publish Announcement
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pin className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Pinned Announcements</h2>
            </div>
            <div className="grid gap-4">
              {pinnedAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(announcement.type)}
                        <Pin className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(announcement.publishDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {announcement.targetAudience === 'all' ? 'All Employees' : announcement.targetAudience.toUpperCase()}
                      </span>
                      <span>By {announcement.createdBy}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{announcement.content}</p>
                    {announcement.expiryDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div className="space-y-4">
          {pinnedAnnouncements.length > 0 && (
            <h2 className="text-xl font-semibold">Recent Announcements</h2>
          )}
          <div className="grid gap-4">
            {regularAnnouncements.map((announcement) => (
              <Card 
                key={announcement.id} 
                className={`hover:shadow-md transition-shadow ${!announcement.isRead ? 'border-l-4 border-l-orange-500 bg-orange-50/30' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      {!announcement.isRead && (
                        <Badge variant="secondary" className="bg-orange-500 text-white text-xs">New</Badge>
                      )}
                      {getPriorityBadge(announcement.priority)}
                    </div>
                    {getTypeBadge(announcement.type)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(announcement.publishDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {announcement.targetAudience === 'all' ? 'All Employees' : announcement.targetAudience.toUpperCase()}
                    </span>
                    <span>By {announcement.createdBy}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                  {announcement.expiryDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}