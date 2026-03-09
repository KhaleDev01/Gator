# Gator 🐊

A CLI-based RSS feed aggregator built with TypeScript, Node.js, and PostgreSQL.

## What it does

Gator lets you register users, follow RSS feeds, and browse the latest posts — all from your terminal. A background aggregator continuously fetches and stores new posts from your followed feeds.

## Requirements

- Node.js
- PostgreSQL

## Installation

```sh
git clone https://github.com/KhaleDev01/Gator
cd gator
npm install
```

## Configuration

Create a config file at `~/.gatorconfig.json`:

```json
{
  "dbUrl": "postgres://youruser:@localhost:5432/gator",
  "currentUserName": ""
}
```

Run migrations to set up the database:

```sh
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Commands

### `register <username>`
Creates a new user and sets them as the current user.
```sh
npm run start register alice
```

### `login <username>`
Switches the current user to an existing user.
```sh
npm run start login alice
```

### `users`
Lists all registered users. The current user is marked with `(current)`.
```sh
npm run start users
```

### `addfeed <name> <url>`
Adds a new RSS feed to the database and follows it as the current user.
```sh
npm run start addfeed "Hacker News" "https://news.ycombinator.com/rss"
```

### `feeds`
Lists all feeds in the database along with the user who added them.
```sh
npm run start feeds
```

### `follow <url>`
Follows an existing feed as the current user.
```sh
npm run start follow "https://news.ycombinator.com/rss"
```

### `following`
Lists all feeds the current user is following.
```sh
npm run start following
```

### `unfollow <url>`
Unfollows a feed as the current user.
```sh
npm run start unfollow "https://news.ycombinator.com/rss"
```

### `agg <time_between_reqs>`
Starts the feed aggregator in a continuous loop. Fetches feeds and saves posts to the database. Accepts duration strings like `1s`, `1m`, `1h`.
```sh
npm run start agg 1m
```
Stop it with `Ctrl+C`.

### `browse [limit]`
Displays the latest posts from feeds the current user follows. Defaults to 2 posts if no limit is provided.
```sh
npm run start browse 10
```

### `reset`
Deletes all users and their data from the database.
```sh
npm run start reset
```

## Example workflow

```sh
# Register a user
npm run start register alice

# Add some feeds
npm run start addfeed "Hacker News" "https://news.ycombinator.com/rss"
npm run start addfeed "Boot.dev Blog" "https://www.boot.dev/blog/index.xml"

# Start the aggregator in one terminal
npm run start agg 1m

# Browse posts in another terminal
npm run start browse 5
```

## Tech stack

- **TypeScript** - language
- **PostgreSQL** - database
- **Drizzle ORM** - database queries and migrations
- **fast-xml-parser** - RSS/XML parsing
- **tsx** - TypeScript execution
