
const arangochair = require('arangochair');
const express = require('express');
const app = express();
app.listen(3000);

app.use(express.static(__dirname));

let sse = undefined;


app.use( (req, res, next) => {
    if ('/sse' === req.url) {
        sse = res;
        sse.setHeader('Content-Type', 'text/event-stream');
        return;
    }

    next();
});


const no4 = new arangochair('http://127.0.0.1:8529'); // ArangoDB node to monitor

no4.subscribe({collection:'users'});
no4.start();
no4.on('users', (docIn, type) => {
    const doc = JSON.parse(docIn);
    console.log(type);
    console.log(doc);
    sse.write('event: ' + type + '\ndata: ');
    sse.write(docIn);
    sse.write('\n\n');
});


no4.on('error', (err, httpStatus, headers, body) => {
    // arangochair stops on errors
    // check last http request
    no4.start();
});

