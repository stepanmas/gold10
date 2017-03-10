const MongoProvider = require('../mongoProvider');

module.exports = class {
    constructor(data, userData)
    {
        this.data     = data;
        this.userData = userData;
        this.mongo    = new MongoProvider();
    }
    
    save()
    {
        console.log(this.data);
        console.log(this.userData, 1);
    }
};