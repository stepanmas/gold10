const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const Auth       = require('./modules/Auth');

const http = require('http').Server(app);
const io   = require('socket.io')(http);

app.use(bodyParser.json());
app.use(morgan('combined'));

const auth = new Auth();

app.get(
    '/', function (req, res)
    {
        
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
        
        
        socket.on(
            'signin', function (user_data)
            {
                auth.sign(
                    user_data,
                    (r) =>
                    {
                        socket.emit(
                            'signed',
                            r
                        );
                    }
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