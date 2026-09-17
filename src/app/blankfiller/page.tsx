import type { Metadata } from "next";
import { BlankFiller } from "@/components/blank-filler";

export const metadata: Metadata = {
  title: "Blank Filler App",
  alternates: { canonical: "/blankfiller" },
};
export default function BlankFillerPage() {
  return (
    <div className="content-shell page-shell">
      <h1 className="page-title">Blank Filler App</h1>
      <BlankFiller />
    </div>
  );
}
