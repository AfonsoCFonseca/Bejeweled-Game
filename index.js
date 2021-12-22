const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/views', express.static(path.join(__dirname, '/views')));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/homepage.html`);
});

app.listen(port, async () => {
    console.log(__dirname);
    console.log('Simple Server Running on port 8080');
});
