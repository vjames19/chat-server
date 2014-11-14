# Chat Server
Live demo at [heroku](http://vj-chat-server.herokuapp.com/)

[ ![Codeship Status for vjames19/chat-server](https://codeship.com/projects/9e1416e0-4dda-0132-5218-2294dbcebc54/status)](https://codeship.com/projects/47502)
[![Coverage Status](https://coveralls.io/repos/vjames19/chat-server/badge.png?branch=master)](https://coveralls.io/r/vjames19/chat-server?branch=master)

# Prerequisites

* Node.js and npm - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm.
* Gulp - [Gulp](http://gulpjs.com/) - Install `npm install -g gulp`.
* Bower - [Bower](http://bower.io/) - Install `npm install -g bower`.

# Quick Install and Run

 The quickest way to get started:
  Clone & Run:

    git clone https://github.com/vjames19/chat-server.git
    cd chat-server
    npm install
    gulp server # This will start the server and restart/rebuild the server when any change in the source code happens.

  Then open a browser and go to:

    http://localhost:3000

# Code Style

  Follow the following general settings:

    indent_style = space
    indent_size = 2
    continuation_indent_size = 4
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true
    
# Test

To execute the tests execute `gulp test`. This will also, generate a coverage report, which lives under ./coverage

The coverage report can also be viewed in [coveralls](https://coveralls.io/r/vjames19/chat-server)

# Deployment

Continuous Deployment and Integration its taken care by [Codeship](https://codeship.com/).
If the test pass on codeship, the application then gets deployed to heroku.
