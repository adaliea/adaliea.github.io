---
layout: post
title: Making Little Handwritten Notes on My Website!
excerpt: I wanted try adding some handwritten-like margin notes to my website. Creating a few of these probably wouldn't have been that hard.
  A little bit of html and css with some svg images I created beforehand would do.

  But since I like programming and don't really want to write a bunch of css and html I created a system that turns the following
  markdown ish syntax into a note on my website.
---

<head>
  <script type="text/javascript" src="/js/highlightjs/languages/javascript.min.js"></script>
</head>
I wanted to add some handwritten notes to my website %$That look like this!$%. Creating a few of these probably wouldn't be that hard.
A little bit of html and css with some svg images I created beforehand would do.

But since I like programming and don't really want to write a bunch of css and html I created a system that turns the following
markdown ish syntax into a note on my website.

`%​$This is how I write a note!$​%$My code doesn't know about code blocks so I have to use a Zero-Width-Space here so it doesn't turn this into an note!$%%`

I started this project with the following goals:

1. Make creating new notes really easy 
2. Have them also work on mobile and small displays 
3. They should work automatically. I don't want to have to run extra commands to generate everything. 
4. Arrows should look hand-drawn (ish). I don't want every arrow to look the same. %$Getting notes to place properly in lists took a bunch of effort$%

Source [here](https://github.com/adaliea/adaliea.github.io/blob/main/_ts/src/notes.ts)

# Starting in JS Land

Initially, to meet goal #3, I wrote everything in JS. We searched for the `%​$` & `$​%` in JS on the browser
and edited the DOM to remove the raw text of the notes. This caused some issues that I'll talk about later, but for the most part
the approach worked and was really easy to implement.

After finding a note we created an empty span that had the text of the note inside on of its data fields. 
We use a span to get the position of where we want the arrow to originate from and to inform the y-level of the note we later create.

I started by just placing notes in the margins of my website. I wasn't worried about inline note support (for mobile) yet. 

Notes are just just a div (that's styled) that has a span %$I'll explain why we need this in a bit$% inside which has the text inside.

## Problems with bounding boxes

There's a fun method on Elements [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
that "returns a DOMRect object providing information about the size of an element and its position **relative to the viewport**."

I'd somehow managed miss the _relative to the viewport_ part and spent far to long debugging why sometimes everything would be misaligned.
Since everything is initially processed on page load %$I do recalculate everything when the viewport changes, so I can't believe that it took me as long as it did to figure out what was happening$%
it worked ... until it didn't. Figuring this out took awhile, but the fix was relatively simple.

## Using the bounding boxes

If you'd like to see the bounding boxes press me -> 
<button type="button" onclick="toggleShowBoundingBoxes()">Toggle Bounding Boxes!</button>

The first issue I ran into was bounding boxes being incorrect because of fonts loading late. This was also a simple fix
(just delay rendering the notes until we have the fonts we need), but, once again, it took me a bit to figure out this was happening.

We're using the bounding boxes to place the arrows, so they need to actually be accurate bounds. Initially I didn't have a span
inside a div and only had the div. The bounding box of the div is the blue rectangle and you can see 
%$I'm just gonna drop a convenient example over here (hopefully!)$% that it is sometimes very off! 

I believe this happens because the bounding box is influenced by the styling. 
Putting a span (with no styling) inside the div gives me accurate bounding boxes (orange).

I then do some math, utilizing the known rotation and orange bounding box to derive the green bounding box that I can finally use.

## Randomness

As far as I can tell javascript doesn't have a way to seed a random. 
I, however, need consistent random values to prevent the page from experiencing seizures when its resized, so I present to you this piece of terrible code:

```javascript
let randoms: number[][] = []

function random(index: number, index2: number) {
    let arr1;
    if (randoms.length > index) {
        arr1 = randoms[index];
    } else {
        for (let i = randoms.length; i <= index; i++) {
            randoms.push([]);
        }
        arr1 = randoms[index];
    }
    if (arr1.length > index2) {
        return arr1[index2];
    } else {
        for (let i = arr1.length; i <= index2; i++) {
            arr1.push(Math.random());
        }
        return arr1[index2];
    }
}
```

It lazily generates random values for each unique `(index, index2)` and guarantees calls to the same position will return the same random.

I have it so that first index is the index of note in our list of notes. 
The second index is a number that I increment on each random call I make.
This keeps the specific code path a note took from effecting the random of other notes.
%$As the available space changes, notes can place themselves in different ways.$%

# Adding Build Tooling

At this point the project was mostly working. Yay! I however noticed that my preloads for some of my resources weren't working. 
The browser was preloading the content like expected but wasn't actually using them.

This was caused because of the way that I was searching for the notes in JS. 
I was using regex to match the `%​$ ... $​%` pattern and then modified the html to replace the text with a span that had the text in a data field.
This was causing scripts embedded in my html to get triggered when the html was modified which for some reason broke all my preloads!

## Jekyll Plugins

This site is a jekyll website and I was hosting it on Github Pages.

So instead of searching for notes in the user's browser I wrote a small Jekyll plugin (in Ruby) to search for the notes at build time.
All the rendering of the note is still done in the user's browser, but the I'm no longer modifying raw html on the browser which resolved my issues with preloads.

To get my jekyll plugins to work I had to switch to the actions version for deploying to github pages instead of the classic version.
The classic version is simpler, but it uses an old version of jekyll and is limited in how much you can customize it. 
Since I was already messing around with build tooling I took the time to polish it up a bit more.

I also added support for using typescript and migrated all the code I'd previously written to it (what can I say a girl likes her types).
I also added tooling to minify %$This turned out to be a massive headache since a lot of the preexisting tools are broken in subtle ways$%
everything on my website and migrated to using Cloudflare Pages. 

## Arrows

With our bounding boxes we can finally start drawing arrows. 
For now I'm creating a canvas and placing it behind all the text so I can draw with it. 
There isn't too much to say here except that we're using a bezier curve and that almost every value used in rendering the arrow 
has some sort of random jitter.

This is an area where I can see room for quite a bit of improvement. Some sort of system to try and keep arrows between lines
and better prevent them from overlapping text would be quite nice.

## Strap in, we're about dive into some really cursed code

At this point, everything was (mostly) working and I started writing this blog. I was using the note system, fixing the 
few bugs that popped up and it was seeming like the end of this project was near.

That was until I made the list of requirements at the beginning of this article and noticed that the notes would awkwardly
place themselves all the way in the right margin *even when actual content on the page didn't expand all the way to it*.

I wanted my notes to stay close to the text to help exemplify that annotating paper article or book feeling. 

Here's what I did to allow notes to place inside the content (instead of just the margin):

1. When building the site we now warp all the text in spans. 
    - When I say "all the text", I mean all the headings elements, paragraph elements, and list elements. This was needed 
      because we can only get the actual width of the content by querying the bounding box of the span. (Same idea from [earlier](#using-the-bounding-boxes))
2. We start by generating the note and getting the bounding boxes. %$This step is actually unchanged$%
3. We calculate how much space there is from the parent element (the element which the arrow is pointing from) to the edge of the screen.
4. If we calculate that there isn't enough space on either side we fallback to mobile rendering (placing notes below the paragraph).
5. Using that information we decide on a side to place the note on (which ever side will cause a shorter arrow).
6. If we've decided to place on the right side we now need to check if there is enough vertical space.
   - We iterate though the elements on the page below this element until we either: 
     - Have found enough space. During the iteration we've also kept track of the widest element. 
       - Using the known width of the note and available space we randomly place the note somewhere in the text.
         If the page is sufficiently wide (i.e there is plenty of extra space in the margin) we'll always go though this 
         code path as we can always scoot the note more into the margin.
     - We've found an element below that is too wide. 
       - We now add padding to the parent element to make enough room to place our notes without overlapping the pages' content
   - This is the part that has the terrible code. Because we've wrapped everything in spans and because we need to special case lists we get 
     [this nightmare of code](https://github.com/varun7654/varun7654.github.io/blob/b79df98f920087189784045d3adc695a4a9dafc7/_ts/src/notes.ts#L136-L193).
     I can't tell you how many subtle bugs have been in here, and how many infinite loops I caused during development.
7. Render arrows like normal

If you want you can play with and see how this all works by resizing this window. (Opening and resizing the dev console may be easier.)
The start of this article shows off pretty much all the behavior!

--- 

And that's about it! If you have a better way to do the above (please) 
[open an issue on github](https://github.com/varun7654/varun7654.github.io/issues/new) with your ideas!

... I've just realized 
[how long](https://github.com/varun7654/varun7654.github.io/compare/4b84de4...b2579f8c6ab6c980af3dfef0e2af2c4f9c015a94)%$Includes a healthy does of being distracted tho!$% 
this project has taken me to finish.


















