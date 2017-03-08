const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const morgan     = require('morgan');

// modules
const Auth      = require('./modules/Auth');
const Remember  = require('./modules/Remember');
const Translate = require('./modules/Translate');

// server
const http = require('http').Server(app);
const io   = require('socket.io')(http);

app.use(bodyParser.json());
app.use(morgan('combined'));

const auth      = new Auth();
const remember  = new Remember();
const translate = new Translate();

app.get(
    '/', function (req, res)
    {
        
    }
);

io.on(
    'connection', function (socket)
    {
        socket.on(
            'today', function (privateData)
            {
                auth.access(
                    privateData,
                    (userData) =>
                    {
                        if (userData.error)
                        {
                            socket.emit(
                                'access error',
                                userData
                            );
                        }
                        else
                        {
                            remember.list(
                                userData, list =>
                                {
                                    socket.emit(
                                        'today',
                                        list
                                    );
                                }
                            );
                        }
                        
                    }
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
        
        socket.on(
            'translate', function (word)
            {
                if (word.length > 1)
                {
                    console.log(word);
                    translate.run(
                        word,
                        r =>
                        {
                            socket.emit(
                                'translated',
                                r
                            );
                        }
                    );
                }
                else
                {
                    socket.emit(
                        'translated',
                        {
                            error: {
                                code   : 22,
                                message: 'In the word must be contains least two letters'
                            }
                        }
                    );
                }
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