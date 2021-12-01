const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// exclude the index.html that will be manipulated via server side rendering
app.use((req, res, next) => {
  const isIndexHtml = req.url === '/index.html';
  if (isIndexHtml) {
    console.log('Skipping serving of index.html. The index.html will by dynamically manipulated.', { url: req.url });
    res.status(404).end('404 Not found');
  }
  next();
});
app.use(express.static(path.join(__dirname, '../build'), { index: false }));

app.get('*', (req, res) => {
  const indexFile = path.join(`${__dirname}/../build/index.html`);
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, something went wrong!');
    }
    return res.send(data);
  });
});

const PORT = process.env.PORT || (() => { throw new Error('env PORT is not set'); })();

app.listen(PORT);

// eslint-disable-next-line no-console
console.log(`App is listening on port ${PORT}`);
