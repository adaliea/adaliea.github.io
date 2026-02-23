'use client';

import { useEffect, useRef } from 'react';

export default function NotesClient() {
    const initializedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (initializedRef.current) return;
        initializedRef.current = true;

        const cleanup = () => {
            document.querySelectorAll('[id^="notes-canvas-"]').forEach(el => el.remove());
            document.querySelectorAll('[id$="-note-text"]').forEach(el => el.remove());
        };

        const extraCanvasHeight = 100;
        const noteTextClassName = "note-text-rendered"
        const noteTextWideClassName = "note-text-wide-rendered"
        const STROKE_STYLE = "#706b67";

        let fontsLoaded = false;
        let noteFontLoaded = false;
        let isUpdating = false;

        let noteElementIds: string[] = [];
        let canvasElementIds: string[] = [];
        let noteTextElementIds: string[] = [];
        let modifiedMarginsElementIds: string[] = [];

        function toGlobalBounds(boundingClientRect: DOMRect) {
            return new DOMRect(boundingClientRect.x + window.scrollX, boundingClientRect.y + window.scrollY, boundingClientRect.width, boundingClientRect.height);
        }

        const observer = new MutationObserver(() => {
            if (fontsLoaded && noteFontLoaded) runNotes();
        });

        function updateNoteElements() {
            if (isUpdating) return;
            isUpdating = true;
            observer.disconnect();

            canvasElementIds.forEach(id => document.getElementById(id)?.remove());
            canvasElementIds = [];

            noteTextElementIds.forEach(id => document.getElementById(id)?.remove());
            noteTextElementIds = []

            modifiedMarginsElementIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    (element as HTMLElement).style.marginBottom = (element as HTMLElement).dataset.originalMarginBottom || '';
                }
            })
            modifiedMarginsElementIds = [];

            noteElementIds.forEach(function (noteElementId, index) {
                const noteElement = document.getElementById(noteElementId)
                if (!noteElement) return;
                
                let boundingRect = toGlobalBounds(noteElement.getBoundingClientRect());
                let parent: HTMLElement | null = noteElement.closest("p,li,h1,h2,h3,h4,h5,h6");
                if (!parent) return;

                let parentBoundRect = toGlobalBounds(parent.getBoundingClientRect());
                let parentForRightSpacing = noteElement.closest("p,ul,ol,h1,h2,h3,h4,h5,h6")!;
                let spaceOnLeft = toGlobalBounds(parentForRightSpacing.getBoundingClientRect()).left -
                    parseFloat(window.getComputedStyle(parentForRightSpacing).marginLeft);
                
                const firstChild = parent.children.item(0);
                let spaceOnRight = window.innerWidth - (firstChild ? toGlobalBounds(firstChild.getBoundingClientRect()).right : parentBoundRect.right);
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
                    let teBB = toGlobalBounds(textElement.getBoundingClientRect());
                    noteWidth = teBB.width;
                    noteHeight = teBB.height;
                    maxRotation = Math.min(degToRad(5), Math.atan2(17, teBB.height));
                }

                let randomRotation = random(index, 0) * maxRotation * 2 - maxRotation;
                textElementParent.style.transform = "rotate(" + randomRotation + "rad)"
                let rotatedNoteHeight = noteHeight + Math.max(0,Math.sin(randomRotation) * noteWidth);

                let yOffset: number;
                let ctx: CanvasRenderingContext2D;
                let leftSide: boolean;

                if (canPlaceOnSide) {
                    yOffset = parentBoundRect.y - extraCanvasHeight / 2;
                    ctx = getCanvasCtx(0, parentBoundRect.y - extraCanvasHeight / 2, parentBoundRect.height + extraCanvasHeight)!;

                    leftSide = random(index, 5) > 0.5;
                    let leftBound = spaceOnLeft;
                    let rightBound = window.innerWidth - spaceOnRight;
                    let maxRightBound = window.innerWidth - noteWidth - 60;
                    let topY = boundingRect.y - 30;
                    textElementParent.style.top = (topY + Math.abs(Math.sin(randomRotation) * (noteWidth / 2))) + "px"

                    let centerness = boundingRect.x - leftBound - (rightBound - leftBound) / 2;
                    if (Math.abs(centerness) > 50) {
                        leftSide = centerness < 0;
                    }

                    if (!canPlaceOnLeft) leftSide = false;
                    if (!canPlaceOnRight) leftSide = true;

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
                                next = elem.children[0];
                            } else if (elem instanceof HTMLLIElement) {
                                next = elem.children[0]?.children[0];
                                if (!next || !(next instanceof HTMLLIElement)) {
                                    next = elem.nextElementSibling;
                                }
                                if (!next) {
                                    let closest = elem.parentElement!.closest("li,ul,ol,p") as HTMLElement;
                                    next = closest?.nextElementSibling;
                                }
                            }
                            if (!next) {
                                next = elem.nextElementSibling;
                            }
                            while (next instanceof HTMLHRElement) {
                                next = next.nextElementSibling;
                            }
                            elem = next;
                            if (elem instanceof HTMLUListElement || elem instanceof HTMLOListElement) continue;
                            if (!elem) break;
                            let span = elem.children[0] as HTMLElement
                            let needToStop = false;
                            if (!span) {
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
                            if (!parent.id) parent.id = guidGenerator();
                            modifiedMarginsElementIds.push(parent.id);
                            parent.style.marginBottom = (spaceNeededBelow) + "px";
                        }
                        let leftPos = lerp(rightBound + 25, Math.max(rightBound + 25, maxRightPos - noteWidth - 20), random(index, 6));
                        textElementParent.style.left = (leftPos) + "px"
                    }
                } else {
                    textElementParent.remove();
                    parent.insertAdjacentElement("afterend", textElementParent);
                    textElementParent.style.position = "relative"
                    let teParentBB = toGlobalBounds(textElementParent.getBoundingClientRect());
                    let pParentBR = toGlobalBounds(parent.parentElement!.getBoundingClientRect());
                    let maxBoundX = window.innerWidth - teParentBB.width - Math.sin(randomRotation) * noteHeight - 20;
                    let minBoundX = 0;
                    let randomScale = teParentBB.width * 0.8
                    let randomXOffset = random(index, 5) * randomScale;
                    let xPos = boundingRect.x - (teParentBB.width / 2) - (randomScale / 2) + randomXOffset;
                    xPos = Math.max(minBoundX, Math.min(maxBoundX, xPos));
                    textElementParent.style.paddingLeft = (xPos - pParentBR.x) + "px";
                    textElementParent.style.textAlign = "left";
                    ctx = getCanvasCtx(0, parentBoundRect.y - extraCanvasHeight / 2, parentBoundRect.height + teParentBB.width + extraCanvasHeight)!;
                    yOffset = parentBoundRect.y - extraCanvasHeight / 2;
                }

                boundingRect = new DOMRect(boundingRect.x, boundingRect.y - yOffset, boundingRect.width, boundingRect.height);
                let teBB = toGlobalBounds(textElement.getBoundingClientRect());
                let teBBRect = new DOMRect(teBB.x, teBB.y - yOffset, teBB.width, teBB.height);

                let topLeft: Point;
                if (randomRotation > 0) {
                    topLeft = new Point(teBBRect.left + Math.sin(randomRotation) * noteHeight, teBBRect.top);
                } else {
                    topLeft = new Point(teBBRect.left, teBBRect.top - Math.sin(randomRotation) * noteWidth);
                }

                let alpha = random(index, 6) * 0.5 + 0.15;
                let endX: number;
                let endY: number;
                let rotationBias: number;
                if (canPlaceOnSide) {
                    if (leftSide!) {
                        let topRight = topLeft.addAngle(noteWidth, 0, randomRotation);
                        let bottomRight = topLeft.addAngle(noteWidth, noteHeight, randomRotation);
                        let alpha2 = invLerp(topRight.y, bottomRight.y, parentBoundRect.bottom - yOffset + 30);
                        if (alpha2 < 1) alpha = lerp(0, alpha2, alpha);
                        endX = lerp(topRight.x, bottomRight.x, alpha) + 3;
                        endY = lerp(topRight.y, bottomRight.y, alpha);
                    } else {
                        let bottomLeft = topLeft.addAngle(0, noteHeight, randomRotation);
                        let alpha2 = invLerp(topLeft.y, bottomLeft.y, parentBoundRect.bottom - yOffset + 30);
                        if (alpha2 < 1) alpha = lerp(0, alpha2, alpha);
                        endX = lerp(topLeft.x, bottomLeft.x, alpha);
                        endY = lerp(topLeft.y, bottomLeft.y, alpha);
                    }
                    rotationBias = Math.sign(randomRotation) * (Math.abs(randomRotation) + degToRad(5));
                } else {
                    let topRight = topLeft.addAngle(noteWidth, 0, randomRotation);
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

            const postContent = document.querySelector(".post-content");
            if (postContent) {
                observer.observe(postContent, {attributes: true, childList: true, subtree: true});
            }
            isUpdating = false;
        }

        const degToRad = (deg: number) => (deg * Math.PI) / 180.0;
        let randoms: number[][] = []
        function random(index: number, index2: number) {
            let arr1 = randoms[index] || (randoms[index] = []);
            return arr1[index2] || (arr1[index2] = Math.random());
        }

        function drawArrow(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, index: number, endAngleBias: number, connectedToSide: boolean) {
            let distance = Math.sqrt((startX - endX) * (startX - endX) + (startY - endY) * (startY - endY));
            let isUp = Math.abs(startY - endY) < 8 ? endAngleBias < 0 : endY > startY;
            let isLeft = endX < startX;
            let angle = random(index, 3) * (Math.PI / 6) + (Math.PI / 3);
            let angleCos = isLeft ? -Math.cos(angle) : Math.cos(angle);
            let angleSin = isUp ? Math.sin(angle) : -Math.sin(angle);
            let enterMag = .12 * distance;
            let cp1x = angleCos * enterMag + startX;
            let cp1y = angleSin * enterMag + startY;
            let angle2 = (isLeft && connectedToSide) ? endAngleBias : endAngleBias + Math.PI;
            angle2 += connectedToSide ? random(index, 4) * 0.2 : Math.atan2(isUp ? -1 : 1, random(index, 4) * 0.4 - 0.2);
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

        function lerp(a: number, b: number, alpha: number) { return a + (b - a) * alpha; }
        function invLerp(a: number, b: number, c: number) { return (c - a) / (b - a); }
        function guidGenerator() { return Math.random().toString(36).substr(2, 9); }

        class Point {
            x: number; y: number;
            constructor(x: number, y: number) { this.x = x; this.y = y; }
            addAngle(x: number, y: number, theta: number) {
                let sin = Math.sin(theta); let cos = Math.cos(theta);
                return new Point(this.x + cos * x - sin * y, this.y + sin * x + cos * y);
            }
        }

        let canvasIdCounter = 0;
        function getCanvas(x: number, y: number, width: number, height: number) {
            const canvas = document.createElement("canvas");
            canvas.id = "notes-canvas-" + canvasIdCounter++;
            canvasElementIds.push(canvas.id);
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.style.position = "absolute";
            canvas.style.top = y + "px";
            canvas.style.left = x + "px";
            canvas.style.zIndex = "-1";
            canvas.style.pointerEvents = "none";
            document.body.appendChild(canvas);
            return canvas;
        }

        function getCanvasCtx(x: number, y: number, height: number) {
            const width = Math.min(window.innerWidth, document.documentElement.clientWidth);
            const canvas = getCanvas(x, y, width, height);
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;
            let dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            ctx.strokeStyle = STROKE_STYLE;
            ctx.lineWidth = 1.2;
            return ctx;
        }

        const handleResize = () => {
            runNotes();
        };

        window.addEventListener('resize', handleResize);

        let runNotesRequested = false;
        const runNotes = () => {
            if (runNotesRequested) return;
            runNotesRequested = true;
            requestAnimationFrame(() => {
                runNotesRequested = false;
                noteElementIds = [];
                let notes = document.getElementsByClassName("note");
                for (let i = 0; i < notes.length; i++) {
                    noteElementIds.push(notes[i].id);
                }
                updateNoteElements();
            });
        };

        document.fonts.load("2em Indie Flower").then(() => {
            noteFontLoaded = true;
            if (fontsLoaded) runNotes();
        });
        document.fonts.ready.then(() => {
            fontsLoaded = true;
            if (noteFontLoaded) runNotes();
        });

        const postContent = document.querySelector(".post-content");
        if (postContent) {
            observer.observe(postContent, {attributes: true, childList: true, subtree: true});
            // @ts-ignore
            if (window.hljs) window.hljs.highlightAll();

            const headings = postContent.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]');
            for (const heading of headings) {
                if (heading.querySelector('.headingLink')) continue;
                const linkIcon = document.createElement('a');
                linkIcon.setAttribute('href', `#${heading.id}`);
                linkIcon.addEventListener("click", () => navigator.clipboard.writeText(window.location.href.split('#')[0] + '#' + heading.id));
                linkIcon.innerHTML = '#';
                linkIcon.className = "headingLink"
                heading.appendChild(linkIcon);
                // @ts-ignore
                linkIcon.style.marginRight = -linkIcon.getBoundingClientRect().width + "px";
            }
        }

        runNotes();

        return () => {
            initializedRef.current = false;
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
            cleanup();
        };
    }, []);

    return null;
}
