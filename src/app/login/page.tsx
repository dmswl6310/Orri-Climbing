import { redirect } from "next/navigation";

// Authentication is not available in the current browsing demo.
export default function LoginPage() {
  redirect("/search");
}
