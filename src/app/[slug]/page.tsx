import { getPageData, getAllPageSlugs } from '@/lib/posts';
import Notes from '@/components/Notes';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const pages = await getAllPageSlugs();
  return pages.map((page) => ({
    slug: page.params.slug,
  }));
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
  const pageData = await getPageData(params.slug);

  if (!pageData) {
    notFound();
  }

  return (
    <article className="wrapper py-12 post-content">
      <Notes />
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Back to home</Link>
        <h1 className="text-4xl font-bold">{pageData.title}</h1>
      </header>

      <div 
        className="e-content"
        dangerouslySetInnerHTML={{ __html: pageData.contentHtml }} 
      />
    </article>
  );
}
