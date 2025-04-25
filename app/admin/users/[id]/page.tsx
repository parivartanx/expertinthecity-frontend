import { mockUsers } from "@/lib/mock-data";
import UserDetails from "./user-details";

// Ensure this is a top-level export
export async function generateStaticParams() {
  // In a real app, you would fetch this from an API
  return mockUsers.map((user) => ({
    id: user.id,
  }));
}

// Add metadata export
export const metadata = {
  title: "User Details",
  description: "View detailed information about a user",
};

export default function UserDetailsPage() {
  return <UserDetails />;
} 