const MongoProvider = require('../mongoProvider');
const assert = require('assert');

module.exports = class{
    constructor()
    {
        this.mongo = new MongoProvider();
    }
    
    list(userData, cb)
    {
        console.log(userData);
        
        this.mongo.connect(
            (db) => {
                db.collection(
                    'words',
                    (err, collection) => {
                        assert.equal(null, err);
    
                        collection.find(
                            {
                                author: userData._id
                            },
                            (err, words) => {
                                assert.equal(null, err);
                                
                                cb(
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
            }
        );
    }
};