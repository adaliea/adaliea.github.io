const sizes = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600]

fetch(
    'https://books.api.dacubeking.com/read',
)
.then(response => {
    return response.json();
})
.then(json => {
        json.forEach(function(bookData) {
            let imageLink = bookData.coverLink;
            let imageSources = "";
            for (let size of sizes) {
                if (imageLink.includes("books.google.com")) {
                    imageSources += imageLink + "&fife=w" + size + " " + size + "w, "
                }
            }

            let div = document.createElement("div");
            div.className = "book";

            let imageDiv = document.createElement("div");
            imageDiv.className = "book-image";

            let imgLink = document.createElement("a");
            imgLink.href = bookData.link;

            let img = document.createElement("img");
            img.src = imageLink;
            img.srcset = imageSources;
            img.sizes = "(max-width: 35rem) calc(100vw - 2rem), (max-width: 51rem) 33rem, (max-width: 71rem) calc((100vw - 3rem) / 2), (max-width: 94rem) calc((100vw - 4rem) / 3), (max-width: 103rem) calc((100vw - 5rem) / 4), 25rem";
            img.loading = "lazy";
            img.alt = `Book Cover for: ${bookData.name}`;
            img.addEventListener("load", () => {
                img.style = "aspect-ratio: unset";
            })

            imgLink.appendChild(img);
            imageDiv.appendChild(imgLink);

            div.appendChild(imageDiv);


            if (bookData.list === "Currently Reading") {
                let currReadingDiv = document.createElement("div");
                currReadingDiv.className = "currently-reading";
                currReadingDiv.textContent = `Currently Reading - ${Math.round(bookData.percentComplete * 100)}%`
                div.appendChild(currReadingDiv);
            }

            let titleDiv = document.createElement("div");
            titleDiv.className = "book-title";
            titleDiv.href = bookData.link;
            titleDiv.textContent = bookData.name;
            div.appendChild(titleDiv);

            let authorDiv = document.createElement("div");
            authorDiv.className = "author";
            authorDiv.textContent = bookData.authors.join(", ");
            div.appendChild(authorDiv);

            let publishedDiv = document.createElement("div");
            publishedDiv.className = "published";
            publishedDiv.textContent = bookData.published;
            div.appendChild(publishedDiv);

            document.getElementById("books").appendChild(div);
        });
    }
)