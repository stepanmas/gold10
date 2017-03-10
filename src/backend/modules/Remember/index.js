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
        //console.log(userData);
        
        function ago(days)
        {
            return moment().add(days, 'days').format('YYYY-MM-DD');
        }
        
        this.mongo.connect(
            (db) =>
            {
                db.collection(
                    'words',
                    (err, collection) =>
                    {
                        assert.equal(null, err);
                        
                        collection
                            .find(
                                {
                                    author: userData._id,
                                    $and  : [
                                        {
                                            $or: [
                                                {learned: ago(-1)},
                                                {learned: ago(-3)},
                                                {learned: ago(-7)},
                                                {learned: ago(-14)},
                                                {learned: ago(-30)}
                                            ]
                                        },
                                    ]
                                }
                            )
                            .sort(
                                {
                                    changed: -1,
                                    added  : -1
                                }
                            )
                            .limit(10)
                            .toArray(
                                function (err, words)
                                {
                                    assert.equal(null, err);
                                    cb(words);
                                }
                            );
                    }
                );
            }
        );
    }
};