const MongoProvider = require('../mongoProvider');
const crypto = require('crypto');

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
        return false;
        if (user_data)
        {
            if (!user_data.name && !user_data.password)
                return false;
            
            return true;
        }
        
        return true;
    }
    
    sign(user_data, cb)
    {
        this.mongo.connect(
            (db) =>
            {
                
                db.collection(
                    'users', (err, collection) =>
                    {
                        if (err) throw err;
                        
                        
                        if (!this.hasValidData(user_data))
                        {
                            cb({error: 'An user data is invalid'});
                            return;
                        }
                        
                        let user = collection.find(
                            {
                                email: user_data.email
                            },
                            (err, user) =>
                            {
                                if (!user.email)
                                {
                                    user = this.signUp(user_data, collection);
                                }
                                
                                console.log(user, user.email);
                                
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
        let md5sum  = crypto.createHash('md5');
        let newUser = Object.assign(
            {},
            user_data,
            {
                signup: Date.now(),
                signin: Date.now(),
                key   : md5sum.digest('hex')
            }
        );
        
        collection.insert(newUser);
        return newUser;
    }
};