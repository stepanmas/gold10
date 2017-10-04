const MongoProvider = require('../mongoProvider');
const assert        = require('assert');
const moment        = require('moment');

module.exports = class {
    constructor()
    {
        this.mongo = new MongoProvider();
    }

    list(userData, cb)
    {
        this.mongo.connect(
            (db) => {
                db.collection(
                    'words',
                    (err, collection) => {
                        assert.equal(null, err);

                        collection
                            .find(
                                {
                                    author: userData._id,
                                    $and  : [
                                        {
                                            $or: [
                                                {learned: moment().format('YYYY-MM-DD')},
                                                {learned: null}
                                            ]
                                        },
                                    ]
                                }
                            )
                            .sort(
                                {
                                    learned: -1,
                                    changed: -1,
                                    added  : -1
                                }
                            )
                            .limit(10)
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

    mark(word, userData, cb)
    {
        this.mongo.connect(
            (db) => {
                db.collection(
                    'words',
                    (err, collection) => {
                        assert.equal(null, err);

                        collection
                            .update(
                                {
                                    author  : userData._id,
                                    original: word
                                },
                                {
                                    $set: {
                                        learned: moment().format('YYYY-MM-DD'),
                                        changed: Date.now()
                                    }
                                }
                            );

                        cb();
                    }
                );
            }
        );
    }

    saveExample(params, userData, cb)
    {
        console.log(params.example);
        this.mongo.connect(
            (db) => {
                console.log(params);
                db.collection(
                    'words',
                    (err, collection) => {
                        assert.equal(null, err);

                        collection
                            .update(
                                {
                                    author  : userData._id,
                                    original: params.original
                                },
                                {
                                    $set: {
                                        example: params.example,
                                        changed: Date.now()
                                    }
                                }
                            );

                        cb({result: 'success'});
                    }
                );
            }
        );
    }
};