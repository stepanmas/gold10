const MongoProvider   = require('../mongoProvider');
const PasswordManager = require('./password');
const assert = require('assert');

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
                        
                        collection.findOne(
                            condition,
                            (err, item) => {
                                assert.equal(null, err);
                                
                                if (item)
                                    cb(item);
                                else
                                    cb({error: 'User not found'});
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
                                else
                                {
                                    if (!PasswordManager.validate(user.password, user_data.password))
                                    {
                                        cb({error: 'The password is not right'});
                                        return;
                                    }
                                }
                                
                                
                                collection.updateOne(
                                    {
                                        email: user_data.email
                                    },
                                    {
                                        $set: {signin: Date.now()}
                                    }
                                );
                                
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
        let key      = PasswordManager.hash((now + Math.random() * 1e17).toString());
        let password = PasswordManager.hash(user_data.password);
        let newUser  = {
            email   : user_data.email,
            password: password,
            signup  : now,
            signin  : now,
            key     : key
        };
        
        collection.insertOne(newUser);
        return newUser;
    }
    
    access(privateData, cb)
    {
        if (!privateData && !privateData.email && !privateData.key)
            return cb(
                {
                    error: 'Incoming data of user is not correct'
                }
            );
        
        this.getUser(
            {
                email: privateData.email,
                key  : privateData.key
            },
            cb
        );
    }
};