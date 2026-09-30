import { redirect } from "next/navigation";

// Saved gyms will be available after account storage is implemented.
export default function SettingsPage() {
  redirect("/search");
}
