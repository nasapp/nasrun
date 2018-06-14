'use strict';

var User = function(jsonStr) {
    if (jsonStr) {
        var obj = JSON.parse(jsonStr);
        this.address = obj.address;    
        this.timestamp = obj.timestamp;
        this.steps = obj.steps
    } else {
        this.address = "";
        this.timestamp = 0;
        this.steps = new Map();
    }
};

User.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

var NasrunContract = function() {
    LocalContractStorage.defineProperty(this, "runnerNumber");   
    LocalContractStorage.defineMapProperty(this, "userPool", {  
        parse: function(jsonText) {
            return new User(jsonText);
        },
        stringify: function(obj) {
            return obj.toString();
        }
    });
};

NasrunContract.prototype = {
    init: function() {
        this.runnerNumber = 0;
    },

    getrunnerNumber: function() {
        return this.runnerNumber.toString();
    },

    getrunnerinfo: function(address) {
        var user = this.userPool.get(address);
        return JSON.stringify(user)
    },

    save: function(date,steps) {
        var from = Blockchain.transaction.from;
        var value = Blockchain.transaction.value;
        var user;
        if (value != 0) {
            throw new Error("Sorry, you can't pay any nas.");
        }
        if (this.isUserAddressExists(from)) {
            user = this.userPool.get(from);
            user.timestamp =  new Date().getTime();
            user.steps[date]=steps;
            this.userPool.set(from, user); 
        } else {
            this.runnerNumber = this.runnerNumber+1;
            user = new User();
            user.address = from;
            user.timestamp = new Date().getTime();
            user.steps[date]=steps;
            this.userPool.put(from, user); 
        }
    },

    isUserAddressExists: function(address) {
        var user = this.userPool.get(address);
        if (!user) {
            return false;
        }
        return true;
    }
}

module.exports = NasrunContract;