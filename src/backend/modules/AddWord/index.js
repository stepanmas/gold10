const MongoProvider = require('../mongoProvider');
const assert        = require('assert');

module.exports = class {
    constructor(data, userData)
    {
        this.word     = data;
        this.userData = userData;
        this.mongo    = new MongoProvider();
    }
    
    save(cb)
    {
        this.mongo.connect(
            (db) =>
            {
                db.collection(
                    'words', (err, collection) =>
                    {
                        assert.equal(null, err);
                        
                        let criteria = {
                            author  : this.userData._id,
                            original: this.word.original.toLowerCase()
                        };
                        
                        collection.findOne(
                            criteria,
                            (err, item) =>
                            {
                                assert.equal(null, err);
                                
                                // if the word exist already, then modify "forgot" option
                                if (item)
                                {
                                    let update = {
                                        $set : {
                                            learned      : null,
                                            translate    : this.word.translate,
                                            example      : this.word.example,
                                            imagine      : this.word.imagine,
                                            changed      : Date.now(),
                                            transcription: this.word.transcription,
                                            sound        : this.word.sound
                                        }
                                    };
                                    let message = 'The word already was added, but not learned.';
                                    
                                    if (item.learned)
                                    {
                                        update.$push = {forgot: Date.now()};
                                        message = 'Successfully updated, do you forgot the word?';
                                    }
                                    
                                    
                                    collection.update(
                                        criteria,
                                        update
                                    );
                                    
                                    cb({result: message});
                                }
                                // save that
                                else
                                {
                                    let now = Date.now();
                                    
                                    collection.insertOne(
                                        {
                                            author       : this.userData._id,
                                            added        : now,
                                            changed      : null,
                                            learned      : null,
                                            forgot       : [],
                                            original     : this.word.original.toLowerCase(),
                                            translate    : this.word.translate,
                                            example      : this.word.example,
                                            imagine      : this.word.imagine,
                                            transcription: this.word.transcription,
                                            sound        : this.word.sound
                                        }
                                    );
                                    
                                    cb(
                                        {
                                            result: 'Successfully inserted.'
                                        }
                                    );
                                }
                            }
                        );
                    }
                );
            }
        );
    }
};