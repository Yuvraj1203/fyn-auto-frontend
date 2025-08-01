import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard"); // or /dashboard/tenant-creation
}
