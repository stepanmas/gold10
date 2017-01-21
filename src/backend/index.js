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
        console.log('a user connected');

        socket.on(
            'disconnect', function ()
            {
                console.log('user disconnected');
            }
        );

        socket.on(
            'message', function (msg)
            {
                console.log(msg);
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