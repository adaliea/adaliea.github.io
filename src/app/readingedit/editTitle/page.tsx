import type { Metadata } from "next";
import { type TitleData, TitleEditor } from "@/components/reading-editors";

export const metadata: Metadata = { title: "Finalize Book" };
export default async function TitlePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  let data: TitleData | null = null;
  try {
    const book = JSON.parse(typeof params.overrideData === "string" ? params.overrideData : "null");
    if (typeof params.workId === "string" && book && typeof book.name === "string")
      data = {
        workId: params.workId,
        cover: typeof params.cover === "string" ? params.cover : "",
        book,
      };
  } catch {
    /* Render a useful message for an incomplete edition-picker link. */
  }
  return (
    <div className="content-shell page-shell">
      <h1 className="page-title">Finalize Book</h1>
      {data ? (
        <TitleEditor data={data} />
      ) : (
        <p role="alert">Open this page from the book edition picker to edit a title.</p>
      )}
    </div>
  );
}
