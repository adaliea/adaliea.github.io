import { getPostData, getSortedPostsData } from '@/lib/posts';
import Notes from '@/components/Notes';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <article className="wrapper py-12 post-content">
      <Notes />
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Back to home</Link>
        <h1 className="text-4xl font-bold">{postData.title}</h1>
        <div className="post-meta mt-2">{postData.date}</div>
      </header>

      <div
        className="e-content"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />

      <footer className="mt-12 pt-8 italic">
        Thanks for reading! If you liked this, or found it helpful, maybe consider <a href="https://github.com/sponsors/adaliea" className="underline">buying me a coffee</a>?
      </footer>
    </article>
  );
}
