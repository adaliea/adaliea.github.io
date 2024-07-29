---
layout: default
title: Update Reading Progress
---

<head>
  <link rel="stylesheet" href="/css/books.css">
</head>

<div id = books>
</div>

<script>
    fetch(
		'https://books.api.dacubeking.com/read?bypassCache=true',
	)
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.json()
    }).then(function(books) {
        // filter books that aren't in the list "currentlyReading"
        books = books.filter(book => book.list === "Currently Reading");
        console.log(books);

        const url = new URL(window.location.href);
        const jsonData = decodeURI(url.searchParams.get('overrideJson'));
        const overrideData = JSON.parse(jsonData);

        for (book of books) {

            var authorHtml =
                book.authors.map(
                    (author, index) => `<a href="${book.authorLinks[index]}">${author}</a>`
            )
            try {
                if (overrideData != null && overrideData.workId === book.workId) {
                    book.percentComplete = overrideData.percent;
                    book.pages = overrideData.totalPages;
                    console.log(book); 
                }
            } catch (e) {
                console.log(e);
            }

            var html = `
                <div class="book">
                    <div style="display:inline-block;vertical-align:top;">
                        <a href="https://books.api.dacubeking.com/bestedition?workId=${book.workId}&render=true&bypassCache=true">
                            <img src="${book.coverLink}" alt="Edit Book Info for, ${book.name}">
                        </a>
                    </div>
                    <div style="display:inline-block;vertical-align:bottom;">
                        <div class="book-title">
                            <a href="https://books.api.dacubeking.com/bestedition?workId=${book.workId}&render=true">${book.name}</a>
                        </div>
                        <div class="author">
                            ${authorHtml}
                        </div>
                        <div class="published">
                            ${book.published}
                        </div>
                        <div>
                            <b>Progress:</b>
                            <div>
                                <b>
                                    Pages Read:
                                </b>
                                <input type="number" name="pages" id="${book.workId}pages" min="0" max="${book.pages}" value="${Math.round(book.percentComplete * book.pages)}" onInput="pagesChange('${book.workId}')">
                                <b>
                                    /
                                </b>
                                <input type="number" name="pages" id="${book.workId}totalPages" min="0" max="100000" value="${book.pages}" onInput="totalPagesChange('${book.workId}')">
                            </div>
                            <div>
                                <b>
                                    Percent Complete:
                                </b>
                                <input type="number" name="percent" id="${book.workId}percent" min="0" max="100" step="1" value="${Math.round(book.percentComplete * 100)}" onInput="percentChange('${book.workId}')" >
                                <b>
                                    %
                                </b>
                            </div>
                            <div>
                                <input type="submit" value="Submit" onclick="updateProgress('${book.workId}')">
                            </div>
                        </div>
                    </div>
                </div>
            `

            document.getElementById("books").innerHTML += html
        }
    })

    // Update the pages when the percent is changed
    function percentChange(workId) {
        console.log("percentChange");
        totalPages = document.getElementById(workId + "totalPages").value;
        var percent = document.getElementById(workId + "percent").value;
        document.getElementById(workId + "pages").value = Math.round(percent * totalPages / 100);
    }

    // Update the percent when the pages is changed
    function pagesChange(workId, pages) {
        console.log("pagesChange");
        totalPages = document.getElementById(workId + "totalPages").value;
        var pagesRead = document.getElementById(workId + "pages").value;
        document.getElementById(workId + "percent").value = Math.round(pagesRead / totalPages * 100);
    }

    // Update the percent when the total pages is changed
    function totalPagesChange(workId, pages) {
        console.log("totalPagesChange");
        var totalPages = document.getElementById(workId + "totalPages").value;
        document.getElementById(workId + "percent").value = Math.round(pages / totalPages * 100);
    }

    function updateProgress(workId, pages) {
        var pages = document.getElementById(workId + "pages").value;
        totalPages = document.getElementById(workId + "totalPages").value;
        var percent = pages / totalPages;

        window.location.href = "https://books.api.dacubeking.com/updateProgress?workId=" + workId + "&percent=" + percent + "&totalPages=" + totalPages;
    }
</script>
