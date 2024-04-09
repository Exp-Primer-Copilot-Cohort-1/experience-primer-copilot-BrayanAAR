// Create web server
// Create a web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const comments = require('./comments.js');

http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === '/post') {
    // Save the comments
    comments.post(query.comment);
  } else if (pathname === '/get') {
    // Get the comments
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments.get()));
  } else {
    // Serve the HTML file
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(__dirname + '/index.html'));
  }
}).listen(8080);

// Path: comments.js
// Create the comments module
module.exports = {
  comments: [],
  post(comment) {
    this.comments.push(comment);
  },
  get() {
    return this.comments;
  }
};

// Path: index.html
<!DOCTYPE html>
<html>
  <head>
    <title>Comments</title>
  </head>
  <body>
    <h1>Comments</h1>
    <form>
      <input type="text" name="comment" />
      <button type="submit">Post</button>
    </form>
    <ul id="comments"></ul>
    <script>
      async function fetchComments() {
        const res = await fetch('/get');
        const comments = await res.json();
        const ul = document.getElementById('comments');
        ul.innerHTML = '';
        comments.forEach(comment => {
          const li = document.createElement('li');
          li.textContent = comment;
          ul.appendChild(li);
        });
      }
      
      fetchComments();
      
      document.querySelector('form').addEventListener('submit', async e => {
        e.preventDefault();
        const comment = e.target.elements.comment.value;
        await fetch(`/post?comment=${comment}`);
        fetchComments();
      });
    </script>
  </body>
</html>

// Path: package.json
{
  "name": "comments",
  "version": "1.0.0",
  "scripts": {
    "start": "node comments.js"
  },
  "dependencies": {
    "http": "^0.0.0",
    "url": "^0.11.0"
  }
}

// Run the web server
// Start the