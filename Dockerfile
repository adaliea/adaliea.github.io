FROM ruby:3.2.2

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /srv/jekyll

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Install npm packages
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--incremental"]
