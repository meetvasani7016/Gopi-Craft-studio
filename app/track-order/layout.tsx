import { Suspense } from "react";

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
