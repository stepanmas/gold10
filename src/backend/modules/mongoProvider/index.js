const mongo = require('mongodb').MongoClient;

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
}


module.exports = MongoProvider;