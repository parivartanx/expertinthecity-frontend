import { redirect } from "next/navigation";

export default function AuthHome() {
  redirect("/auth/login");
  return null;
}
