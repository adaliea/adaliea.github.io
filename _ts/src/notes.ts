"use strict"

const extraCanvasHeight = 100;
const noteTextClassName = "note-text-rendered"
const noteTextWideClassName = "note-text-wide-rendered"


const STROKE_STYLE = "#706b67";

let showBoundingBoxes = false;

function toggleShowBoundingBoxes() {
    showBoundingBoxes = !showBoundingBoxes;
    updateNoteElements();
}

let fontsLoaded = false;
let noteFontLoaded = false;

let noteElementIds: string[] = [];
let canvasElementIds: string[] = [];
let noteTextElementIds: string[] = [];
let modifiedMarginsElementIds: string[] = [];

function toGlobalBounds(boundingClientRect: DOMRect) {
    return new DOMRect(boundingClientRect.x + window.scrollX, boundingClientRect.y + window.scrollY, boundingClientRect.width, boundingClientRect.height);
}

function updateNoteElements() {
    canvasElementIds.forEach(id => {
        let element = document.getElementById(id);
        if (!element) return;
        element.remove();
    });
    canvasElementIds = [];

    noteTextElementIds.forEach(id => {
        let element = document.getElementById(id);
        if (!element) return;
        element.remove()
    })
    noteTextElementIds = []

    modifiedMarginsElementIds.forEach(id => {
        let element = document.getElementById(id);
        if (!element) return;
        element.style.marginBottom = <string>element.dataset.originalMarginBottom;
    })

    noteElementIds.forEach(function (noteElementId, index) {
        let placedNotePos = new Map();
        const noteElement = document.getElementById(noteElementId)
        if (!noteElement) {
            console.error("Couldn't find element: " + noteElementId);
            return;
        }
        let boundingRect = toGlobalBounds(noteElement.getBoundingClientRect());
        // Find a parent paragraph element
        let parent: HTMLElement | null = noteElement.closest("p,li");
        if (!parent) {
            console.error("Couldn't find p parent for: " + noteElementId);
            return;
        }

        let parentBoundRect = toGlobalBounds(parent.getBoundingClientRect());

        let parentForRightSpacing = noteElement.closest("p,ul,ol")!;
        let spaceOnLeft = toGlobalBounds(parentForRightSpacing.getBoundingClientRect()).left -
            parseFloat(<string>window.getComputedStyle(parentForRightSpacing).marginLeft);
        let spaceOnRight = window.innerWidth - toGlobalBounds(parent.children.item(0)!.getBoundingClientRect()).right;
        let maxRightPos = parentBoundRect.right;

        let textElementParent = document.createElement("div");
        textElementParent.id = noteElementId + "-note-text";
        textElementParent.style.position = "absolute";
        textElementParent.className = noteTextClassName;
        noteTextElementIds.push(textElementParent.id);
        document.body.appendChild(textElementParent);

        let textElement = document.createElement("span");
        textElement.innerHTML = noteElement.getAttribute("data-note-text") as string;

        textElementParent.appendChild(textElement);

        let textElementBoundingBox = toGlobalBounds(textElement.getBoundingClientRect());
        let noteWidth = textElementBoundingBox.width;
        let noteHeight = textElementBoundingBox.height;

        let canPlaceOnLeft = spaceOnLeft > noteWidth + 60;
        let canPlaceOnRight = spaceOnRight > noteWidth + 60;
        let canPlaceOnSide = canPlaceOnLeft || canPlaceOnRight

        let maxRotation;
        if (canPlaceOnSide) {
            maxRotation = Math.min(degToRad(10), Math.atan2(17, textElementBoundingBox.height));
        } else {
            textElementParent.className = noteTextWideClassName;
            let textElementBoundingBox = toGlobalBounds(textElement.getBoundingClientRect());
            noteWidth = textElementBoundingBox.width;
            noteHeight = textElementBoundingBox.height;

            maxRotation = Math.min(degToRad(5), Math.atan2(17, textElementBoundingBox.height));
        }

        let randomRotation = random(index, 0) * maxRotation * 2 - maxRotation;
        textElementParent.style.transform = "rotate(" + randomRotation + "rad)"

        let rotatedNoteHeight = noteHeight + Math.max(0,Math.sin(randomRotation) * noteWidth);

        let yOffset;
        let ctx;
        let leftSide;
        if (canPlaceOnSide) {
            yOffset = parentBoundRect.y - extraCanvasHeight / 2;
            ctx = getCanvasCtx(0, parentBoundRect.y - extraCanvasHeight / 2, parentBoundRect.height + extraCanvasHeight);

            leftSide = random(index, 5) > 0.5;
            let leftBound = spaceOnLeft;
            let rightBound = window.innerWidth - spaceOnRight;
            let maxRightBound = window.innerWidth - noteWidth - 60;
            let topY = boundingRect.y - 30;
            textElementParent.style.top = (topY + Math.abs(Math.sin(randomRotation) * (noteWidth / 2))) + "px"

            let centerness = boundingRect.x - leftBound - (rightBound - leftBound) / 2; // Where the note origin is based on it's parent bounds
            if (Math.abs(centerness) > 50) {
                leftSide = centerness < 0;
            }

            if (!canPlaceOnLeft) {
                leftSide = false;
            }

            if (!canPlaceOnRight) {
                leftSide = true;
            }

            if (leftSide) {
                textElementParent.style.left = (spaceOnLeft - noteWidth - 30) + "px"
            } else {
                let noteBottomY = rotatedNoteHeight + topY + 25;
                let spaceNeededBelow = rotatedNoteHeight;
                let elem: Element | null = parent;
                while (true) {
                    if (!elem) break;
                    let next : Element | null = null;
                    if (elem instanceof HTMLUListElement || elem instanceof HTMLOListElement) {
                        // traverse into the list
                        next = elem.children[0];
                    } else if (elem instanceof HTMLLIElement) {
                        // traverse deeper in the list, all lists should have <span></span> inside them
                        next = elem.children[0].children[0];
                        if (!next || !(next instanceof HTMLLIElement)) {
                            // no children, try next element
                            next = elem.nextElementSibling;
                        }
                        if (!next) {
                            // end of sublist traverse up
                            let closest = elem.parentElement!.closest("li,ul,ol,p") as HTMLElement;
                            next = closest!.nextElementSibling;
                        }
                    }
                    if (!next) {
                        next = elem.nextElementSibling;
                    }

                    while (next instanceof HTMLHRElement) {
                        next = next.nextElementSibling;
                    }
                    elem = next;

                    if (elem instanceof HTMLUListElement || elem instanceof HTMLOListElement) {
                        continue;
                    }
                    if (!elem) break;
                    // all of the elems should have a span inside them.
                    let span = elem.children[0] as HTMLElement
                    let needToStop = false;
                    if (!span) {
                        // We ran into something not surrounded by a span. Process this event and then stop
                        span = elem as HTMLElement;
                        needToStop = true;
                    }

                    let bounds = toGlobalBounds(span.getBoundingClientRect());


                    if (bounds.top > noteBottomY) {
                        spaceNeededBelow = 0;
                        break;
                    }
                    if (rightBound < bounds.right || needToStop) {
                        if (bounds.right > maxRightBound || needToStop) {
                            spaceNeededBelow = noteBottomY - bounds.top;
                            break;
                        } else {
                            rightBound = bounds.right;
                        }
                    }
                }

                if (spaceNeededBelow > 0) {
                    parent.dataset.originalMarginBottom = parent.style.marginBottom;
                    if (!parent.id) {
                        parent.id = guidGenerator();
                    }
                    modifiedMarginsElementIds.push(parent.id);
                    parent.style.marginBottom = (spaceNeededBelow) + "px";
                }

                let leftPos = lerp(rightBound + 25, Math.max(rightBound + 25, maxRightPos - noteWidth - 20), random(index, 6));

                textElementParent.style.left = (leftPos) + "px"
            }
        } else {
            document.body.removeChild(textElementParent);
            parent.insertAdjacentElement("afterend", textElementParent);
            textElementParent.style.position = "relative"

            let textElemParentBoundingBox = toGlobalBounds(textElementParent.getBoundingClientRect());
            let parentParentBoundRect = toGlobalBounds(parent.parentElement!.getBoundingClientRect());

            let maxBoundX = window.innerWidth - textElemParentBoundingBox.width - Math.sin(randomRotation) * noteHeight - 20;
            let minBoundX = 0;

            let randomScale = textElemParentBoundingBox.width * 0.8
            let randomXOffset = random(index, 5) * randomScale;
            let xPos = boundingRect.x - (textElemParentBoundingBox.width / 2) // centered
                - (randomScale / 2) + randomXOffset; //randomness
            xPos = Math.max(minBoundX, Math.min(maxBoundX, xPos));

            textElementParent.style.paddingLeft = (xPos - parentParentBoundRect.x) + "px";

            textElementParent.style.textAlign = "left";
            ctx = getCanvasCtx(0, parentBoundRect.y - extraCanvasHeight / 2, parentBoundRect.height + textElemParentBoundingBox.width + extraCanvasHeight);
            yOffset = parentBoundRect.y - extraCanvasHeight / 2;
        }




        // modify the bounding box to be in the canvas space
        boundingRect = new DOMRect(boundingRect.x,
            boundingRect.y - yOffset,
            boundingRect.width, boundingRect.height);

        textElementBoundingBox = toGlobalBounds(textElement.getBoundingClientRect());
        let teBB = new DOMRect(textElementBoundingBox.x, textElementBoundingBox.y - yOffset, textElementBoundingBox.width, textElementBoundingBox.height);

        if (showBoundingBoxes) {
            let textParentBoundRect = toGlobalBounds(textElementParent.getBoundingClientRect());
            ctx.strokeStyle = "blue";
            ctx.strokeRect(textParentBoundRect.x, textParentBoundRect.y - yOffset, textParentBoundRect.width, textParentBoundRect.height);
            ctx.strokeStyle = "red";
            ctx.strokeRect(textElementBoundingBox.x, textElementBoundingBox.y - yOffset, textElementBoundingBox.width, textElementBoundingBox.height);
            ctx.strokeStyle = "orange";
            ctx.strokeRect(boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height);
            ctx.strokeStyle = STROKE_STYLE;
        }

        let topLeft;
        let topRight;
        let bottomLeft;
        let bottomRight;

        if (randomRotation > 0) {
            topLeft = new Point(teBB.left + Math.sin(randomRotation) * noteHeight, teBB.top);
        } else {
            topLeft = new Point(teBB.left, teBB.top - Math.sin(randomRotation) * noteWidth);
        }
        topRight = topLeft.addAngle(noteWidth, 0, randomRotation);
        bottomLeft = topLeft.addAngle(0, noteHeight, randomRotation);
        bottomRight = topLeft.addAngle(noteWidth, noteHeight, randomRotation);

        if (showBoundingBoxes) {
            ctx.strokeStyle = "green"
            ctx.beginPath();
            ctx.moveTo(topLeft.x,topLeft.y);
            ctx.lineTo(bottomLeft.x,bottomLeft.y);
            ctx.lineTo(bottomRight.x,bottomRight.y);
            ctx.lineTo(topRight.x, topRight.y);
            ctx.closePath();
            ctx.stroke()
            ctx.strokeStyle = STROKE_STYLE;
        }


        let alpha = random(index, 6) * 0.5 + 0.15;
        let endX;
        let endY;
        let rotationBias;
        if (canPlaceOnSide) {
            if (leftSide) {
                let alpha2 = invLerp(topRight.y, bottomRight.y, parentBoundRect.bottom - yOffset + 30);
                if (alpha2 < 1) {
                    alpha = lerp(0, alpha2, alpha);
                }
                endX = lerp(topRight.x, bottomRight.x, alpha) + 3;
                endY = lerp(topRight.y, bottomRight.y, alpha);
            } else {
                let alpha2 = invLerp(topLeft.y, bottomLeft.y, parentBoundRect.bottom - yOffset + 30);
                if (alpha2 < 1) {
                    alpha = lerp(0, alpha2, alpha);
                }
                endX = lerp(topLeft.x, bottomLeft.x, alpha);
                endY = lerp(topLeft.y, bottomLeft.y, alpha);
            }
            rotationBias = Math.sign(randomRotation) * (Math.abs(randomRotation) + degToRad(5));
        } else {
            let avgY = (topLeft.y + topRight.y) / 2;
            let maxDeltaX = (avgY - boundingRect.y + boundingRect.height / 2) * 0.75;
            let minX = Math.max(topLeft.x, boundingRect.x - maxDeltaX);
            let maxX = Math.min(topRight.x, boundingRect.x + maxDeltaX);

            let minAlpha = invLerp(topLeft.x, topRight.x, minX);
            let maxAlpha = invLerp(topLeft.x, topRight.x, maxX);

            alpha = lerp(minAlpha, maxAlpha, alpha)
            endX = lerp(minX, maxX, alpha);
            endY = lerp(topLeft.y, topRight.y, alpha);
            rotationBias = Math.atan2(boundingRect.y + boundingRect.height / 2 - endY, boundingRect.x - endX) - Math.PI / 2;
        }
        drawArrow(ctx, boundingRect.x, boundingRect.y + boundingRect.height / 2, endX, endY, index, rotationBias, canPlaceOnSide);

    })
}

document.addEventListener("DOMContentLoaded", function (event) {

    let canvas = getCanvas(1, 1, 1, 1);
    if (!canvas) return; // Canvas not supported. Give up in this case
    document.body.removeChild(canvas);
    canvasElementIds = [];

    // Main wrapper for the parts of the website we care about
    const pageContent = document.getElementsByClassName("page-content")[0];



    // Callback function to execute when mutations are observed
    const callback = (mutationList: MutationRecord[], observer: MutationObserver) => {
        if (!fontsLoaded || !noteFontLoaded) return;
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                // @ts-ignore
                let hasNonTextNode = Array.from(mutation.addedNodes).some(node => node.className !== noteTextClassName && node.className !== noteTextWideClassName);
                if (hasNonTextNode) {
                    updateNoteElements();
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    window.addEventListener('resize', updateNoteElements);

    // Wait for fonts to load before rendering. We'll get misaligned notes if we don't
    document.fonts.load("2em Indie Flower").then(() => {
        noteFontLoaded = true;
        if (fontsLoaded) {
            updateNoteElements();
        }
    });
    document.fonts.ready.then(() => {
        fontsLoaded = true;
        if (noteFontLoaded) {
            updateNoteElements();
        }
    });

    const config = {attributes: true, childList: true, subtree: true};
    observer.observe(pageContent, config);


    let notes = document.getElementsByClassName("note");
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        noteElementIds.push(note.id);
    }
});


let canvasWidthShrink = 0;

let canvasCount = 0;

function getCanvas(x: number, y: number, width: number, height: number) {
    // Add a canvas behind the page content to draw the notes on
    const canvas = document.createElement("canvas");
    canvas.id = "notes-canvas-" + canvasCount;
    canvasElementIds.push(canvas.id);
    canvasCount++;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.position = "absolute";
    canvas.style.top = y + "px";
    canvas.style.left = x + "px";
    canvas.style.right = "0px"
    canvas.style.zIndex = "-1"
    document.body.appendChild(canvas);


    if (!canvas.getContext) {
        console.error("Canvas not supported");
        return;
    }

    return canvas;
}

function getPixelRatio(context: CanvasRenderingContext2D) {
    let dpr = window.devicePixelRatio || 1,
        // @ts-ignore
        bsr = context.webkitBackingStorePixelRatio ||
            // @ts-ignore
            context.mozBackingStorePixelRatio ||
            // @ts-ignore
            context.msBackingStorePixelRatio ||
            // @ts-ignore
            context.oBackingStorePixelRatio ||
            // @ts-ignore
            context.backingStorePixelRatio || 1;

    return dpr / bsr;
}

function getCanvasCtx(x: number, y: number, height: number) {
    let width = document.getElementsByClassName("page-content")[0].getBoundingClientRect().width;

    const canvas = getCanvas(x, y, width - canvasWidthShrink, height)!;
    const ctx = canvas.getContext("2d")!;
    let pixelRatio = getPixelRatio(ctx);
    canvas.width = (width - canvasWidthShrink) * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    ctx.strokeStyle = STROKE_STYLE;

    ctx.lineWidth = 1.2;
    return ctx;
}

const degToRad = (deg: number) => (deg * Math.PI) / 180.0;
const radToDeg = (rad: number) => (rad * 180.0) / Math.PI;


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


function drawArrow(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, index: number, endAngleBias: number, connectedToSide: boolean) {
    let distance = Math.sqrt((startX - endX) * (startX - endX) + (startY - endY) * (startY - endY));
    let isUp;
    if (Math.abs(startY - endY) < 8) {
        isUp = endAngleBias < 0;
    } else {
        isUp = endY > startY;
    }

    let isLeft = endX < startX;

    // generate an angle between 30 - 60 degrees in rad
    let angle = random(index, 3) * (Math.PI / 6) + (Math.PI / 3);
    let angleCos = Math.cos(angle);
    let angleSin = Math.sin(angle);
    if (isLeft) {
        angleCos = -angleCos;
    }
    if (!isUp) {
        angleSin = -angleSin;
    }

    let enterMag = .12 * distance;
    let cp1x = angleCos * enterMag + startX;
    let cp1y = angleSin * enterMag + startY;

    let angle2 = (isLeft && connectedToSide) ? endAngleBias : endAngleBias + Math.PI;
    if (connectedToSide) {
        angle2 += random(index, 4) * 0.2
    } else {
        angle2 += Math.atan2(isUp ? -1 : 1, random(index, 4) * 0.4 - 0.2);
    }

    let backOffAmount = -20;
    endX = endX - backOffAmount * Math.cos(angle2);
    endY = endY - backOffAmount * Math.sin(angle2);

    let arrowOrigin = new Point(endX, endY).addAngle(-4 + (-6) * random(index, 5), 0, angle2);
    let arrowPoint = arrowOrigin.addAngle(-10, 0, angle2);
    let arrowLeft = arrowOrigin.addAngle(3, 5 + (3) * random(index, 9), angle2);
    let arrowLeftControl = arrowOrigin.addAngle(-3, 2 + (3) * random(index, 6), angle2);
    let arrowRight = arrowOrigin.addAngle(3, -5 + (-3) * random(index, 10), angle2);
    let arrowRightControl = arrowOrigin.addAngle(-3, -2 + (-3) * random(index, 7), angle2);


    let reextendAmount = random(index, 8) * 15;
    endX = endX - reextendAmount * Math.cos(angle2);
    endY = endY - reextendAmount * Math.sin(angle2);


    let exitMag = 0.4 * (connectedToSide ? distance : Math.min(distance,200));
    let cp2x = Math.cos(angle2) * exitMag + endX;
    let cp2y = Math.sin(angle2) * exitMag + endY;

    ctx.beginPath();

    ctx.moveTo(arrowLeft.x, arrowLeft.y);
    ctx.quadraticCurveTo(arrowLeftControl.x, arrowLeftControl.y, arrowPoint.x, arrowPoint.y);
    ctx.quadraticCurveTo(arrowRightControl.x, arrowRightControl.y, arrowRight.x, arrowRight.y);

    ctx.moveTo(startX, startY);

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    ctx.stroke();
}

function lerp(a: number, b: number, alpha: number) {
    return a + (b - a) * alpha;
}

/**
 * @return alpha value to get c when used in lerp
 * @param a
 * @param b
 * @param c
 */
function invLerp(a: number, b: number, c: number) {
    return (c - a) / (b - a);
}

function guidGenerator() {
    let S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(x: number, y: number) {
        return new Point(this.x + x, this.y + y);
    }

    addAngle(x: number, y: number, theta: number) {
        let sin = Math.sin(theta);
        let cos = Math.cos(theta);
        return new Point(this.x + cos * x - sin * y, this.y + sin * x + cos * y);
    }
}

