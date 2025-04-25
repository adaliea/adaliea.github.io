---
layout: post
title: Create a Website
---

## Set up Jekyll

For this site, we'll use [Jekyll](https://jekyllrb.com/). 

[Jekyll](https://jekyllrb.com/) is a static site generator designed to simplify the creation of fast, secure, and scalable websites. 
Built on Ruby, it takes your content written in Markdown or HTML, combines it with templates, and generates a static website ready for deployment. 
It is ideal for blogs, portfolios, and documentation sites. (This site is made with Jekyll!) 
Its minimalistic approach makes it a popular choice for developers who value control, performance, and simplicity.

### Tips for Working with Jekyll
1. Start with one of the [Guides on the docs](https://jekyllrb.com/docs/installation/#guides) for how to install dependencies for Jekyll.
   - On the Windows instructions you can stop once you see `That’s it, you’re ready to use Jekyll!` 
2. Then head to [Step by Step Tutorial](https://jekyllrb.com/docs/step-by-step/01-setup/) on the docs for the rest of the instructions.
3. Preview Locally
   Use `bundle exec jekyll serve` to build and preview your site locally before pushing changes.
   This lets you test and refine your site in a safe environment.
4. Always use `bundle exec`. 
   Whenever you need to run a jekyll command like `jekyll serve`, prepend `bundle exec` to the command.
   Not doing this _will_ cause issues with dependencies not getting properly loaded.
   Just prepend `bundle exec` to these commands to resolve these issues.

If you're looking for more customization, check out the [Themes page](https://jekyllrb.com/docs/themes/)

## Git & Github

[GitHub](https://github.com/) is a web-based platform that helps developers store, manage,
and track changes to their code projects. 
Think of it as a combination of Google Docs and Dropbox, but specially designed for programming code.
Key features include:
- Version control that tracks all changes made to files over time 
- Collaboration tools that let multiple people work on the same project 
- Repository storage for keeping all your project files in one organized place 
- Issue tracking for managing bugs and feature requests 
- Code review tools for improving quality

GitHub uses a system called [Git](https://git-scm.com/) (hence the name)
that allows developers to create different versions of their code,
experiment without breaking the main project, and merge changes when they're ready.
This makes it easier for teams to work together without overwriting each other's work.
Even if you're not a professional programmer, GitHub can be useful for backing up your code,
showcasing your projects, or contributing to open-source software that anyone can help improve.

To be able to host your website on Cloudflare Pages (covered later),
you'll want to ensure that your website is pushed to a Git repository on Github.

If you're looking into how to get started with Git & Github,
GitHub's [_Start your journey_](https://docs.github.com/en/get-started/start-your-journey) 
resources are a good place to look. 

If you just want to get your website working follow the [_Upload a project to Github_](https://docs.github.com/en/get-started/start-your-journey/uploading-a-project-to-github) instructions.

