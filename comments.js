// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Read comments.json file
let comments = [];
fs.readFile('comments.json', 'utf8', (err, data) => {
  if (err) throw err;
  comments = JSON.parse(data);
});

// GET /comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// POST /comments
app.post('/comments', (req, res) => {
  const newComment = {
    id: comments.length + 1,
    body: req.body.body
  };
  comments.push(newComment);
  fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
    if (err) throw err;
    res.json(newComment);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Path: index.html
// Create form to submit comment
<!DOCTYPE html>
<html>
  <head>
    <title>Comment System</title>
  </head>
  <body>
    <h1>Comment System</h1>
    <form id="comment-form">
      <textarea name="body" placeholder="Write your comment here"></textarea>
      <button type="submit">Submit</button>
    </form>
    <ul id="comments"></ul>
    <script>
      const form = document.getElementById('comment-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const body = form.body.value;
        fetch('/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ body })
        })
          .then(res => res.json())
          .then(comment => {
            const comments = document.getElementById('comments');
            const li = document.createElement('li');
            li.innerHTML = comment.body;
            comments.appendChild(li);
          });
      });
      fetch('/comments')
        .then(res => res.json())
        .then(comments => {
          const commentsList = document.getElementById('comments');
          comments.forEach(comment => {
            const li = document.createElement('li');
            li.innerHTML = comment.body;
            commentsList.appendChild(li);
          });
        });
    </script
