# Clickmap

Clickmap is a Node.js app that tracks clicks on a map!

## Overview

The app consists of the following components:

- `leaftlet` map frontend
- `express` server backend
- `sqlite` database

## Running locally

Node.js and npm are required to run the app. If you don't have Node.js
installed on your system, installation instructions can be found
[here](https://nodejs.org/en).

The app can be run on a local machine by following these steps:

```bash
# Clone the repo
$ git clone https://github.com/epsalt/clickmap.git
$ cd clickmap

# Install dependencies
$ npm install

# Run the app
$ npm start
```

If all goes well the application should be running at
http://localhost:3000/


## TODO
- Tests
- Bundle CSS
- Point deletion
- Style points from current session
- Check for session ID db collisions
