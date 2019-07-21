const http = require('http');
const fs = require('fs');
// require the words, dedup and filters the one non a-z
const words = [... new Set(
    require('./words.json').filter(x => x.match(/^[a-z]+$/))
)];

words.sort((a, b) => {
    if (a.length == b.length) return 0;
    if (a.length < b.length) return -1;
    return 1;
});

let server = http.createServer();
server.addListener('request', (req, res) => {
    if (req.url == '/') {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<html>
            <head>
                <style>
                .key {
                    width: 24px;
                    height: 24px;
                    position: absolute;
                }
                .key.selected {
                    background-color: rgba(44, 100, 147, 0.4);
                }
                .key.bad {
                    background-color: rgba(255, 0, 0, 0.4);
                }
                #keyboard{
                    background-image: url(lily58.png);
                    background-size: cover;
                    height: 207px;
                    width: 600px;
                    position: relative;
                }
                #progress {
                    width: 100%;
                    font-style: italic;
                    padding-bottom: 1em;
                    margin-bottom: 5em;
                    border-bottom: 5px dashed;
                }

                body {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                    #round {
                        font-size: 30pt;
                        width: 600px;
                        margin-bottom: 1em;
                    }
                    .none {
                        color: darkgray;
                    }
                    .correct {
                        color: black;
                    }
                    .wrong {
                        color: red;
                    }
                    .current {
                        text-decoration: underline;
                    }

                </style>
                <title>Type me!</title>
                <script>
                    window.words ='${words}'.split(',');
                </script>
                <script src="main.js"></script>
            </head>
        <body>
        <section id="progress"></section>
        <section id="round"></section>
        <section id="keyboard"></section>
        </body>
        </html>`);
    } else {
        if (req.url.endsWith('.js')) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(fs.readFileSync('./assets/main.js', 'utf8'));
        } else {
            if (!req.url.includes('favicon')) {
                res.writeHead(200, { "Content-Type": "image/png" });
                fs.createReadStream('./assets/lily58.png').pipe(res);
                //res.end();
            }
        }
    }

});
server.listen(12345);