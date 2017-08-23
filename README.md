
### setup

Setup [ArangoDB](https://www.arangodb.com/download-major/) your favorite way so thats listening at least on `127.0.0.1:8529`.
Go to the web ui and add a collection `tweets`.

ArangoDB is ready and we install the demo:

    git clone https://github.com/baslr/arangochair-serversendevents-demo
    cd arangochair-serversendevents-demo
    npm install
    node index.js

Now the demo is running and we can try it out: open multiple tabs in your browser with the address `127.0.0.1:3000` and tweet something.
