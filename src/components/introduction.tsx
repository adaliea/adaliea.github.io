import Link from "next/link";
import type { HomepageInfo } from "@/lib/books";
import { CurrentlyReading, FavoriteSong } from "./homepage-activity";

export function Introduction({ info }: { info: HomepageInfo | null }) {
  return (
    <div className="inner-intro">
      <div>
        <h1 className="intro-title">
          <span className="dacubeking">Hey there!</span>
          <br />
          <span className="dacubeking">
            <span className="dacubeking">I’m</span> <span className="dacubeking">Adalie.</span>
          </span>
        </h1>
      </div>

      <p>
        I’m a 21-year-old college student from Los Angeles, studying{" "}
        <strong>Computer Science</strong> and <strong>Math</strong> at{" "}
        <a href="https://www.psu.edu/">The Pennsylvania State University</a>. When I’m not writing
        code or doing homework, you’ll probably find me watching k-dramas, reading romance novels,
        or playing video games.
      </p>
      <p>
        In high school I was the programming lead for my First Robotics Competition team where I
        built award-winning robots, including one that secured us a division win at Worlds. I
        continue to do work on robots though my school’s{" "}
        <a href="https://www.youtube.com/@PennStateRi3D/featured">Robot In 3 Days team</a>, where,
        in three days we build a 120-pound competition ready robot.
      </p>
      <p>Now? Life’s a mix of hobbies, projects, and curiosity.</p>
      <ul>
        <li>
          🌟 <strong>Tinkering</strong> with code led me to create{" "}
          <a href="https://github.com/adaliea/adaliea.github.io">this site</a> and a bunch of other{" "}
          <Link href="/projects">projects</Link>.
        </li>
        <li>
          {" "}
          📸 <strong>Photography</strong> to scratch my creative itch.
        </li>
        <li className="min-h-12">
          📚 <strong>And Reading!</strong> <CurrentlyReading books={info?.readingBooks || []} />
          My full reading list is <Link href="/reading">here</Link>.
        </li>
      </ul>
      <p>When I’m not geeking out over tech or reading, I’m probably:</p>
      <ul>
        <li>
          📺 <strong>Watching</strong> a TV show, movie, or a lecture on how to render a million
          blades of grass in real time. I’ve thoroughly enjoyed watching{" "}
          <a href="https://tv.apple.com/us/show/severance/umc.cmc.1srk2goyh2q2zdxcx605w8vtx">
            Severance
          </a>
          , and when watching movies tend to either watch rom-coms or action/thriller movies.
        </li>
        <li>
          🕹️ <strong>Gaming!</strong> I finished <a href="https://www.alanwake.com/">Alan Wake 2</a>{" "}
          a while ago and am now climbing through the C-Sides of{" "}
          <a href="https://www.celestegame.com/">Celeste</a>. When I eventually get tired of dying
          over and over and over again, I’ll switch to{" "}
          <a href="https://www.playbalatro.com/">Balatro</a>. Also,{" "}
          <a href="https://dynmap.dacubeking.com/">Minecraft</a> and{" "}
          <a href="https://playvalorant.com/">Valorant</a> remain my go-to’s when I want to play
          with friends.
        </li>
        <li>
          🎶 <strong>Vibing to some music! </strong>
          <FavoriteSong track={info?.favoriteTrack} />
        </li>
        <li>
          ✏️ <strong>Writing!</strong> Occasionally I’ll get the itch to write, and you’ll find the
          fruits of that below.
        </li>
      </ul>
      <p>
        I love exploring my curiosities and diving deep into new interests. Learning and
        experimenting with different things keeps life interesting for me.
      </p>
      <p>
        Anyways, if you’re reading this, why not follow me on{" "}
        <a href="https://bsky.app/profile/adalie.me">Bluesky</a>? Take a peek around here, if you’re
        curious about me. 🌐
      </p>
    </div>
  );
}
