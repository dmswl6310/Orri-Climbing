import { redirect } from "next/navigation";

// Keep the former personal page URL useful without an account.
export default function SettingsPage() {
  redirect("/saved");
}
