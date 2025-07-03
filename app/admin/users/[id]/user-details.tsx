"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAdminUserStore } from "@/lib/mainwebsite/admin-user-store";
import { format } from "date-fns";
import { User, Shield, Clock, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UserDetails() {
  const params = useParams();
  const router = useRouter();
  const { fetchUserById, selectedUser, isLoading, error } = useAdminUserStore();

  useEffect(() => {
    if (params.id) {
      fetchUserById(params.id as string);
    }
  }, [params.id, fetchUserById]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !selectedUser) {
    return <div>{error || "User not found"}</div>;
  }

  const user = selectedUser;
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Users
        </Button>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex items-start space-x-6">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <div className="flex items-center space-x-2 mt-1">
                {user.role === "moderator" && <Shield className="h-4 w-4 text-primary" />}
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Joined Date</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{user.createdAt ? format(new Date(user.createdAt), "PPP") : "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 