import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const pagesDirectory = path.join(process.cwd(), 'content/pages');

export interface PageData {
  slug: string;
  title: string;
  contentHtml: string;
  [key: string]: any;
}

export async function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // For excerpts, we want a simpler processing but including images
    let excerpt = matterResult.data.excerpt || '';
    if (!excerpt && matterResult.content) {
        // Fallback to first paragraph if no explicit excerpt
        const firstParagraph = matterResult.content.split('\n\n')[0];
        excerpt = firstParagraph;
    }

    const processedExcerpt = await remark()
      .use(html, { sanitize: false })
      .process(excerpt);

    return {
      slug,
      title: matterResult.data.title,
      date: matterResult.data.date ? new Date(matterResult.data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      excerpt: processedExcerpt.toString(),
      ...matterResult.data,
    };
  }));

  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

function processNotesAndWrappers(content: string) {
  let noteCounter = 0;
  
  // Replace notes %$ ... $%
  let processed = content.replace(/%\$([\s\S]*?)\$%/g, (_, noteText) => {
    const escapedText = noteText.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
    const id = `note-${noteCounter++}`;
    return `<span class='note' id='${id}' data-note-text='${escapedText}'></span>`;
  });

  // Wrap p, li, h1-h6 content in spans
  const tagsToWrap = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  tagsToWrap.forEach(tag => {
    const openTagRegex = new RegExp(`<${tag}(\\b[^>]*)>`, 'g');
    processed = processed.replace(openTagRegex, `<${tag}$1><span>`);
    const closeTagRegex = new RegExp(`</${tag}>`, 'g');
    processed = processed.replace(closeTagRegex, `</span></${tag}>`);
  });

  return processed;
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);
  
  let contentHtml = processedContent.toString();
  contentHtml = processNotesAndWrappers(contentHtml);

  return {
    slug,
    contentHtml,
    title: matterResult.data.title,
    date: matterResult.data.date ? new Date(matterResult.data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    ...matterResult.data,
  };
}

export async function getPageData(slug: string): Promise<PageData | null> {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);
  
  let contentHtml = processedContent.toString();
  contentHtml = processNotesAndWrappers(contentHtml);

  return {
    slug,
    contentHtml,
    title: matterResult.data.title,
    ...matterResult.data,
  };
}

export async function getAllPageSlugs() {
  const fileNames = fs.readdirSync(pagesDirectory);
  return fileNames.map(fileName => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, '')
      }
    };
  });
}
