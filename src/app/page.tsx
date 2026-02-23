import React from 'react';
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

interface HomepageInfo {
  readingBooks: any[];
  favoriteTrack?: {
    url: string;
    name: string;
    artist: {
      url: string;
      name: string;
    };
  };
}

async function getHomepageInfo(): Promise<HomepageInfo | null> {
  try {
    const res = await fetch('https://books.api.dacubeking.com/homepageinfo', {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

function combineList(list: (string | React.ReactNode)[]) {
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];
  const last = list[list.length - 1];
  const others = list.slice(0, -1).reduce((prev: (string | React.ReactNode)[], curr, i) => {
    return i === 0 ? [curr] : [...prev, ', ', curr];
  }, []);

  return <>{others} & {last}</>;
}

export default async function Home() {
  const posts = await getSortedPostsData();
  const homepageInfo = await getHomepageInfo();

  return (
    <main>
      <div className="intro-bg" style={{ backgroundImage: "url('/assets/home/IMG_8116.jpg')" }}>
        <div className="intro">
          <header className="home-header-nav">
            <Link href="/projects" className="header-link">Projects</Link>
            <Link href="/reading" className="header-link">Reading Log</Link>
          </header>

          <div className="inner-intro flex flex-col">
            <div className="">
              <div>
                <h1 className="intro-title dacubeking leading-none">
                  Hey there!<br />
                  I&apos;m Adalie.
                </h1>
              </div>

              <div className="max-w-3xl mt-8">
                <p>
                  I’m a 21-year-old college student from Los Angeles, studying <strong>Computer Science</strong> and <strong>Math</strong> at <a href="https://www.psu.edu/">The Pennsylvania State University</a>. When I’m not writing code or doing homework, you&apos;ll probably find me watching k-dramas, reading romance novels, or playing video games.
                </p>

                <p className="mt-4">
                  In high school I was the programming lead for my First Robotics Competition team where I built award-winning robots, including one that secured us a division win at Worlds. I continue to do work on robots though my school&apos;s <a href="https://www.youtube.com/@PennStateRi3D/featured">Robot In 3 Days team</a>, where, in three days we build a 120-pound competition ready robot.
                </p>

                <p className="mt-4">Now? Life’s a mix of hobbies, projects, and curiosity.</p>

                <ul className="mt-2 space-y-2">
                  <li>🌟 <strong>Tinkering</strong> with code led me to create <Link href="https://github.com/adaliea/adaliea.github.io">this site</Link> and a bunch of other <Link href="/projects">projects</Link>.</li>
                  <li>📸 <strong>Photography</strong> to scratch my creative itch.</li>
                  <li className="min-h-[3em]">📚 <strong>And Reading!</strong> {(homepageInfo?.readingBooks?.length ?? 0) > 0 ? (
                    <span>Currently, I&apos;m reading {combineList(homepageInfo!.readingBooks.map((b: any) => <Link key={b.workId} href={b.link}>{b.name}</Link>))} by {combineList(Array.from(new Set(homepageInfo!.readingBooks.flatMap((b: any) => b.authors))).map((a, i) => <span key={i}>{a as string}</span>))}.</span>
                  ) : (
                    <span>Loading current read...</span>
                  )} My full reading list is <Link href="/reading">here</Link>.</li>
                </ul>

                <p className="mt-4">When I’m not geeking out over tech or reading, I’m probably:</p>

                <ul className="mt-2 space-y-2">
                  <li>
                    📺 <strong>Watching</strong> a TV show, movie, or a lecture on how to render a million blades of grass in real time. I’ve thoroughly enjoyed watching <a href="https://tv.apple.com/us/show/severance/umc.cmc.1srk2goyh2q2zdxcx605w8vtx">Severance</a>, and when watching movies tend to either watch rom-coms or action/thriller movies.
                  </li>
                  <li>
                    🕹️ <strong>Gaming!</strong> I finished <a href="https://www.alanwake.com/">Alan Wake 2</a> a while ago and am now climbing through the C-Sides of <a href="https://www.celestegame.com/">Celeste</a>. When I eventually get tired of dying over and over and over again, I’ll switch to <a href="https://www.playbalatro.com/">Balatro</a>. Also, <a href="https://dynmap.dacubeking.com/">Minecraft</a> and <a href="https://playvalorant.com/">Valorant</a> remain my go-to’s when I want to play with friends.
                  </li>
                  <li>🎶 <strong>Vibing to some music!</strong> {homepageInfo?.favoriteTrack ? (
                    <span>My current favorite is <a href={homepageInfo.favoriteTrack.url}>{homepageInfo.favoriteTrack.name}</a> by <a href={homepageInfo.favoriteTrack.artist.url}>{homepageInfo.favoriteTrack.artist.name}</a>.</span>
                  ) : (
                    <span>Loading favorite song...</span>
                  )}</li>
                  <li>✏️ <strong>Writing!</strong> Occasionally I’ll get the itch to write, and you’ll find the fruits of that below.</li>
                </ul>

                <p className="mt-4">I love exploring my curiosities and diving deep into new interests. Learning and experimenting with different things keeps life interesting for me.</p>

                <p className="mt-4">Anyways, if you’re reading this, why not follow me on <a href="https://bsky.app/profile/adalie.me">Bluesky</a>? Take a peek around here, if you’re curious about me. 🌐</p>
              </div>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 62" className="intro-border" preserveAspectRatio="none">
            <path d="M 446.349 44.811 C 470.785 44.262 496.544 41.664 518.252 30.431 C 529.372 24.677 500.553 51.817 500.553 51.817 L 501.752 78.734 L -5.254 79.103 C -5.254 79.103 -13.948 10.919 -6.084 27.481 C -1.033 38.118 10.642 46.901 22.308 48.498 C 44.472 51.531 64.693 26.197 84.993 24.531 C 119.724 21.68 140.63 62.776 181.969 60.667 C 218.623 58.797 254.41 28.156 290.376 20.844 C 341.923 10.364 393.761 45.992 446.349 44.811 Z"></path>
          </svg>
        </div>
      </div>

      <div className="wrapper py-12">
        <h2 className="text-4xl font-bold mb-8">Blog Posts:</h2>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <span className="post-meta">{post.date}</span>
              <h3>
                <Link href={`/posts/${post.slug}`} className="post-link">
                  {post.title}
                </Link>
              </h3>
              {post.excerpt && <div className="mt-2 text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: post.excerpt }} />}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
