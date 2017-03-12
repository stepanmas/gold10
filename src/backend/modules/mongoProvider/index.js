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
                
                !function ()
                {
                    payload(db);
                    
                    return Promise.reject(); //TODO: need to test resolve
                }()
                    .then(() => {db.close()}).catch(
                        (err) =>
                        {
                            if (err)
                                console.log(err);
                        }
                    );
            }
        );
    }
}


module.exports = MongoProvider;