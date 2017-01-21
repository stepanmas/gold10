const mongo  = require('mongodb').MongoClient,
      assert = require('assert');

class MongoProvider {
    constructor()
    {
        this.url = 'mongodb://localhost:27017/gold20';
    }

    connect(payload)
    {
        mongo.connect(
            this.url, function (err, db)
            {
                if (err) throw err;

                payload(db);

                db.close();
            }
        );
    }

    getUser(condition, cb)
    {
        this.connect(
            (db) =>
            {

                db.collection(
                    'users', function (err, collection)
                    {
                        if (err) throw err;

                        let result = [],
                            list   = collection.find(condition)
                            ;

                        list.each(
                            function (err, doc)
                            {
                                if (err) throw err;
                                if (doc) {
                                    result.push(doc);
                                    console.log(result);
                                }
                                else
                                    cb(result);
                            }
                        );
                    }
                );

            }
        );
    }
}


module.exports = MongoProvider;