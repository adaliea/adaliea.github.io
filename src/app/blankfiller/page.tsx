import type { Metadata } from "next";
import { BlankFiller } from "@/components/blank-filler";

export const metadata: Metadata = {
  title: "Blank Filler App",
  description:
    "A small browser tool for filling in text templates: mark blanks with [label] and fill them in.",
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
