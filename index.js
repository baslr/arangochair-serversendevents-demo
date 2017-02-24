const fastango = require('fastango3')('http://127.0.0.1:8529');
const arangochair = require('arangochair');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.listen(3000);

app.use(express.static(__dirname + '/public'));

let sses = [];

app.use( (req, res, next) => {
    if ('/sse' === req.url) {
        sses.push(res);
        res.setHeader('Content-Type', 'text/event-stream');
        res.on('close', () => {
            console.log('sse close');
            const idx = sses.indexOf(res);
            if (-1 === idx) return;
            sses.splice(idx, 1);
            console.log(sses.length);
        });

        res.write('data: initial\n\n');
        return;
    }

    next();
});

app.post('/tweet', (req, res) => {
    console.dir(req.body);
    fastango.tweets.save(JSON.stringify(req.body), (...a) => console.log(a) );
    res.sendStatus(204);
});


const no4 = new arangochair('http://127.0.0.1:8529'); // ArangoDB node to monitor

no4.subscribe({collection:'tweets'});
no4.start();
no4.on('tweets', (docIn, type) => {
    const doc = JSON.parse(docIn);
    console.log(type);

    const message = 'event: ' + type + '\ndata: ' + JSON.stringify(doc) + '\n\n';
    for(const sse of sses) {
        sse.write(message);
    }
});

no4.on('error', (err, httpStatus, headers, body) => {
    console.log('on error', err);
    // arangochair stops on errors
    // check last http request
    no4.start();
});

