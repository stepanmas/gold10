const MongoProvider = require('../mongoProvider');
const assert = require('assert');
const moment = require('moment');

module.exports = class {
  constructor() {
    this.mongo = new MongoProvider();
  }

  list(userData, cb) {
    //console.log(userData);

    function ago(days) {
      return moment().add(days, 'days').format('YYYY-MM-DD');
    }

    this.mongo.connect(
      (db) => {
        db.collection(
          'words',
          (err, collection) => {
            assert.equal(null, err);

            let condition = [
              { learned: ago(-1) },
              { learned: ago(-4) },
              { learned: ago(-11) },
              { learned: ago(-25) },
              { learned: ago(-55) },
              { learned: ago(-117) }
            ];

            collection
              .find(
                {
                  author: userData._id,
                  $and: [
                    {
                      $or: condition
                    },
                  ]
                }
              )
              .sort(
                {
                  changed: -1,
                  added: -1
                }
              )
              .limit(condition.length * 10)
              .toArray(
                function (err, words) {
                  assert.equal(null, err);
                  cb(words);
                }
              );
          }
        );
      }
    );
  }

  forgot(word, userData, cb) {
    console.log(word, userData, cb);
    this.mongo.connect(
      (db) => {
        db.collection(
          'words',
          (err, collection) => {
            assert.equal(null, err);

            collection
              .update(
                {
                  author: userData._id,
                  original: word
                },
                {
                  $set: {
                    changed: Date.now(),
                    learned: null
                  },
                  $push: {
                    forgot: Date.now()
                  }
                }
              );

            cb();
          }
        );
      }
    );
  }
};
