const MongoProvider = require('../mongoProvider');
const crypto        = require('crypto');

module.exports = class {
    constructor()
    {
        this.mongo = new MongoProvider();
    }
    
    getUser(condition, cb)
    {
        this.mongo.connect(
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
                                if (doc)
                                {
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
    
    hasValidData(user_data)
    {
        if (user_data)
        {
            if (!user_data.email || !user_data.password)
            {
                return false;
            }
            
            return true;
        }
        
        return false;
    }
    
    sign(user_data, cb)
    {
        if (!this.hasValidData(user_data))
        {
            cb({error: 'An user data is invalid'});
            return;
        }
        
        this.mongo.connect(
            (db) =>
            {
                db.collection(
                    'users', (err, collection) =>
                    {
                        if (err) throw err;
                        
                        console.log('we find: ' + user_data.email);
                        
                        collection.findOne(
                            {
                                email: user_data.email
                            },
                            (err, user) =>
                            {
                                if (err) throw err;
                                
                                if (!user)
                                {
                                    user = this.signUp(user_data, collection);
                                }
                                
                                cb(
                                    {
                                        email: user.email,
                                        key  : user.key
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
    
    signUp(user_data, collection)
    {
        let now      = Date.now();
        let md5sum   = crypto.createHmac('sha1', now.toString());
        let password = crypto.createHmac('sha1', user_data.password);
        let newUser  = {
            email   : user_data.email,
            password: password.digest('hex'),
            signup  : Date.now(),
            signin  : Date.now(),
            key     : md5sum.digest('hex')
        };
        
        collection.insertOne(newUser);
        return newUser;
    }
};