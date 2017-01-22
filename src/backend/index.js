const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const morgan        = require('morgan');
const mongoProvider = require('./modules/mongoProvider');

const http = require('http').Server(app);
const io   = require('socket.io')(http);

app.use(bodyParser.json());
app.use(morgan('combined'));

app.get(
    '/', function (req, res)
    {
        let provider = new mongoProvider();

        provider.getUser(
            {
                one: 2
            },
            (r)=>
            {
                res.json(r);
            }
        );
    }
);

io.on(
    'connection', function (socket)
    {
        socket.on(
            'today', function (msg)
            {
                console.log(`got: today`);

                socket.emit(
                    'today',
                    [
                        {
                            original : 'essential',
                            translate: 'необходимый'
                        }
                    ]
                );
            }
        );
    }
);

http.listen(
    3000, function ()
    {
        console.log('Express server listening on port 3000');
    }
);