import { createServer } from "node:http";

const books = [
  {
    name: "A Cup of Tea",
    authors: ["A. Writer"],
    authorLinks: [],
    link: "https://example.com/tea",
    coverLink: "https://example.com/cover.jpg",
    workId: "tea",
    published: "2026",
    list: "Currently Reading",
    pages: 200,
    percentComplete: 0.25,
  },
  {
    name: "Other Stories",
    authors: ["B. Author"],
    authorLinks: [],
    link: "https://example.com/stories",
    coverLink: "",
    workId: "stories",
    published: "2025",
    list: "Already Read",
    pages: 100,
    percentComplete: 1,
  },
];
let failNext = false;
createServer((request, response) => {
  if (request.url === "/__fail-next" && request.method === "POST") {
    failNext = true;
    response.end("OK");
    return;
  }
  if (request.url?.startsWith("/read") && failNext) {
    failNext = false;
    response.writeHead(503);
    response.end("Unavailable");
    return;
  }
  response.setHeader("Content-Type", "application/json");
  response.end(
    JSON.stringify(
      request.url === "/homepageinfo"
        ? {
            readingBooks: [books[0]],
            favoriteTrack: {
              name: "A song",
              url: "https://example.com/song",
              artist: { name: "An artist", url: "https://example.com/artist" },
            },
          }
        : books,
    ),
  );
}).listen(4010, "127.0.0.1");
