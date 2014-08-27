# Omnibus



[![Build Status](https://img.shields.io/travis-ci/omnibus-app/Omnibus.svg?branch=master&style=flat)](https://travis-ci.org/omnibus-app/Omnibus)
[![Gulp](http://img.shields.io/badge/Built%20with-Gulp-blue.svg?style=flat)](http://gulpjs.com)


Omnibus is an interactive data visualization app that will make understanding large and complex bills easy.

It's increasingly common for legislation to be bundled into large omnibus bills which makes untangling the content of these bills more difficult. We've used our backend to calculate concrete figures and generate dynamic visualizations to make these perceived trends more apparent.
## Team

  - __Product Owner__: Nick Bottomley
  - __Project Manager__: Will Johnson
  - __Development Team Members__: Will LaBranche, Mike Schippert, Will Johnson, Nick Bottomley

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

Head [here](http://omnibusviz.azurewebsites.net) to see this repo deployed and connected to the Omnibus REST API. Hover over the bubbles or use the search bar to look for a particular bill, click on it for a more detailed view of this bill.

## Requirements

- [Omnibus REST API](https://github.com/omnibus-app/omnibus-backend) 
- Up to date versions of Node, Bower and Gulp on your local machine
- That's it!

## Tech Stack Features

- Backbone Marionette Layouts and Regions for seperation of rendering logic
- D3 and Backbone Routes enclosed within / handled from modules
- CoffeScript
- Jade Templating
- SCSS
- Browserify for max modularity, requiring front-end depencies
- Separate production / development automated builds

## Development


### Installing Dependencies

From within the root directory:

Install

```
npm install
```

Build

```
gulp
```

This will open a live page that will update as you edit files.

### Production


Install

```
npm install
```

Build

```
gulp
```

Build for production

```
gulp production
```

Works with the Chrome livereload extension (https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

### Deployment

We've had to push our compiled assets to github because Azure couldn't run some of our gulp tasks because ruby wasn't available in the box.
If you are hosting on another service, such as Heroku or AWS, uncomment the gulp tast lines in deploy.sh, remove public/ from the github repo and add public/ to the .gitignore

### Tasks

See the projects backlog in asana [here](https://app.asana.com/0/15149793768442/15184813615013)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.



## LICENSE

(MIT License)

Copyright (c) 2014 Piotr Godek

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
