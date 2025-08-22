---
layout: page
title: Blank Filler App
---

<head>
    <link rel="preload" href="/ts_out/blankfiller.js" as="script" />
    <script type="text/javascript" src="/ts_out/blankfiller.js"></script>
    <link rel="stylesheet" href="/assets/css/blankfiller.css">
</head>


# Template:

Add fillable elements to your template by writing them as `[label]`
%$ If you need to use brackets, escape the first one by changing the `[` to `\[` $%

Capitalize the first letter in the label name to force the first letter to always be capital. Keep it lowercase to keep the casing entered.


<textarea title="Template" class="template" id="templateText" ></textarea>

_This is saved between browser sessions!_

---

# Fill out the Template

<div id = "fillArea"></div>

<p></p>

# Output

<textarea title="Output" class="template" id="outputText" ></textarea>
