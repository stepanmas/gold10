const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

// modules
const Auth = require('./modules/Auth');
const Remember = require('./modules/Remember');
const Translate = require('./modules/Translate');
const AddWord = require('./modules/AddWord');
const Learn = require('./modules/Learn');

// server
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(morgan('combined'));

const auth = new Auth();
const remember = new Remember();
const translate = new Translate();
const learn = new Learn();

app.get(
  '/', function (req, res) {

  }
);

io.on(
  'connection', function (socket) {
    console.log('connected');

    socket.on(
      'today', function (privateData) {
        console.log('today', privateData);

        auth.access(
          privateData,
          (userData) => {
            if (userData.error) {
              socket.emit(
                'access error',
                userData
              );
            }
            else {
              remember.list(
                userData, list => {
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
      'learn', function (privateData) {
        auth.access(
          privateData,
          (userData) => {
            if (userData.error) {
              socket.emit(
                'access error',
                userData
              );
            }
            else {
              learn.list(
                userData, list => {
                  socket.emit(
                    'learn',
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
      'learned', function (word, privateData) {
        auth.access(
          privateData,
          (userData) => {
            if (userData.error) {
              socket.emit(
                'access error',
                userData
              );
            }
            else {
              learn.mark(
                word,
                userData,
                r => {
                  socket.emit(
                    'learned',
                    r
                  );
                }
              );
            }

          }
        );
      }
    );

    socket.on(
      'signin', function (user_data) {
        console.log('signin', user_data);

        auth.sign(
          user_data,
          (r) => {
            console.log('signed', r);
            socket.emit(
              'signed',
              r
            );
          }
        );
      }
    );

    socket.on(
      'translate', function (word) {
        console.log('translate', word);

        if (word.length > 1) {
          translate.run(
            word,
            r => {
              socket.emit(
                'translated',
                r
              );
            }
          );
        }
        else {
          socket.emit(
            'translated',
            {
              error: {
                code: 22,
                message: 'In the word must be contains least two letters'
              }
            }
          );
        }
      }
    );

    socket.on(
      'add_word', function (data, privateData) {
        auth.access(
          privateData,
          userData => {
            if (userData.error) {
              socket.emit(
                'access error',
                userData
              );
            }
            else {
              let AW = new AddWord(data, userData);

              AW.save(r => socket.emit('added_word', r));
            }
          }
        );
      }
    );

    socket.on(
      'forgot',
      function (word, privateData) {
        auth.access(
          privateData,
          userData => {
            if (userData.error) {
              socket.emit(
                'access error',
                userData
              );
            }
            else {
              remember.forgot(
                word, userData, () => {
                  socket.emit(
                    'forgot_marked'
                  );
                }
              );
            }
          }
        );
      }
    );

    socket.on(
      'saveExample',
      function (params, privateData) {
        auth.access(
          privateData,
          userData => {
            if (userData.error) {
              socket.emit(
                'access error',
                userData
              );
            }
            else {
              learn.saveExample(
                params, userData, (r) => {
                  if (!r.error) {
                    socket.emit(
                      'savedExample',
                      {
                        error: null,
                        msg: 'The example was save'
                      }
                    );
                  } else {
                    socket.emit(
                      'savedExample',
                      {
                        error: r.error
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  }
);

http.listen(
  3001, function () {
    console.log('Express server listening on port 3001');
  }
);
