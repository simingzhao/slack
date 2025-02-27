import type { Metadata } from "next";
import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Slack Clone - Main",
  description: "A Slack clone built with Next.js",
};

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto h-full max-w-6xl px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 