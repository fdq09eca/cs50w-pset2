# Project 2: Flack

This project is for fulfilling the course [CS50w](https://courses.edx.org/courses/course-v1:HarvardX+CS50W+Web/course/) offered by EdX Harvard.

## Objectives

- Learn to use JavaScript to run code server-side.
- Become more comfortable with building web user interfaces.
- Gain experience with Socket.IO to communicate between clients and
  servers.

## Overview

In this project, you’ll build an online messaging service using Flask,
similar in spirit to [Slack](https://slack.com/). Users will be able to
sign into your site with a display name, create channels (i.e.
chatrooms) to communicate in, as well as see and join existing channels.
Once a channel is selected, users will be able to send and receive
messages with one another in real time. Finally, you’ll add a personal
touch to your chat application of your choosing!

## Milestones

We recommend that you try to meet the following milestones:

- Complete the Display Name, Channel Creation, and Channel List steps.
- Complete the Messages View and Sending Messages steps.
- Complete the Remembering the Channel and Personal Touch steps.

## Getting Started

### Python and Flask

As with Project 1, make sure that you have a copy of [Python
3.6](https://www.python.org/downloads/) or higher installed on your
machine. You’ll also need to install `pip`. If you downloaded Python
from Python’s website, you likely already have `pip` installed (you can
check by running `pip` in a terminal window). If you don’t have it
installed, be sure to [install
it](https://pip.pypa.io/en/stable/installing/) before moving on!

To run this Flask application:

1. Download the `project2` distribution code from
   <https://cdn.cs50.net/web/2020/x/projects/2/project2.zip> and unzip
   it.
2. In a terminal window, navigate into your `project2` directory.
3. Run `pip3 install -r requirements.txt` in your terminal window to
   make sure that all of the necessary Python packages (Flask and
   Flask-SocketIO, for instance) are installed.
4. Set the environment variable `FLASK_APP` to be `application.py`. On
   a Mac or on Linux, the command to do this is
   `export FLASK_APP=application.py`. On Windows, the command is
   instead `set FLASK_APP=application.py`.
5. Run `flask run` to start up your Flask application.
6. If you navigate to the URL provided by `flask`, you should see the
   text `"Project 2: TODO"`!

## Requirements

Alright, it’s time to actually build your web application! Here are the
requirements:

- **Display Name**: When a user visits your web application for the
  first time, they should be prompted to type in a display name that
  will eventually be associated with every message the user sends. If
  a user closes the page and returns to your app later, the display
  name should still be remembered.

  - use a form(_Jinja_) or a prompt(_JS_, by client browser) to obtain the client name, and store it in the client's localstorage
  - > it is totally JS, you need it to be in the `localStorage` not `sessionStorage` for enabling user to not input their name everytime.

- **Channel Creation**: Any user should be able to create a new
  channel, so long as its name doesn’t conflict with the name of an
  existing channel.

  - channel should be mark with unique id/name
  - Dynamic url (_flask_)

- **Channel List**: Users should be able to see a list of all current
  channels, and selecting one should allow the user to view the
  channel. We leave it to you to decide how to display such a list.

  - an `accordion` from _bs4_
  - allow user to create a channel, using _flask_ form.
  - make sure it is using `socketio` and `emit`
    - people should see a new channel being created in real-time

- **Messages View**: Once a channel is selected, the user should see any messages that have already been sent in that channel, _up to a maximum of 100 messages_. Your app should only store the 100 most _recent messages per channel in server-side memory_.

  - use a `counter` in view function
  - conversation should be marked with `counter`
  - use a `session` to store the recent 100 messages of **each channel**, replace if `key (counter)` is repeated
  - or use `list` and `pop`?

- **Sending Messages**: Once in a channel, users should be able to
  send text messages to others the channel. When a user sends a
  message, their display name and the timestamp of the message should
  be associated with the message. All users in the channel should then
  see the new message (with display name and timestamp) appear on
  their channel page. Sending and receiving messages should NOT
  require reloading the page.

  - show message input field only if the user is in a channel (_flask, jinja condition_)
    - no boardcast from the lobby
  - use `socketio` and `emit` from _flask_ as and API to boardcast users' message in the channel
    - messages are formated with timestamp `datetime` module
  - use JS to display to each client

- **Remembering the Channel**: If a user is on a channel page, closes
  the web browser window, and goes back to your web application, your
  application should remember what channel the user was on previously
  and take the user back to that channel.
  - client side stores **current channel name/id**
  - use _JS_ to check if client name and channel name/id exist in the index page
    - if yes, redirect to the _channel_
- **Personal Touch**: Add at least one additional feature to your chat
  application of your choosing! Feel free to be creative, but if
  you’re looking for ideas, possibilities include: supporting deleting
  one’s own messages, supporting use attachments (file uploads) as
  messages, or supporting private messaging between two users.

  - private messaging
    - _user-id_ to _user-id_, conditional `socketio`
      - show to the respective user when their id is suggested by another user's input
  - attachment, uplaoding (_flask_, check the documentation)

- In `README.md`, include a short writeup describing your project,
  what’s contained in each file, and (optionally) any other additional
  information the staff should know about your project. Also, include
  a description of your personal touch and what you chose to add to
  the project.
- If you’ve added any Python packages that need to be installed in
  order to run your web application, be sure to add them to
  `requirements.txt`!

Beyond these requirements, the design, look, and feel of the website are
up to you! You’re also welcome to add additional features to your
website, so long as you meet the requirements laid out in the above
specification!

## Hints

- You shouldn’t need to use a database for this assignment. However,
  you should feel free to store any data you need in memory in your
  Flask application, as via using one or more global variables defined
  in `application.py`.
- You will likely find that [local
  storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  will prove helpful for storing data client-side that will be saved
  across browser sessions.
