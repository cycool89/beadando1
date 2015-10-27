var bcrypt = require('bcryptjs');

module.exports = {
    identity: 'user',
    connection: 'default',
    attributes: {
        azonosito: {
            type: 'string',
            required: true,
            unique: true,
        },
        password: {
            type: 'string',
            required: true,
        },
        surname: {
            type: 'string',
            required: true,
        },
        forename: {
            type: 'string',
            required: true,
        },
        inwork: {
            type: 'boolean',
            defaultsTo: false
        },
        arrival: {
            type: 'datetime',
            defaultsTo: 0//function () { return new Date(); },
        },
        role: {
            type: 'string',
            enum: ['alkalmazott', 'fonok'],
            required: true,
            defaultsTo: 'alkalmazott'
        },
        worktimes: {
            collection: 'worktime',
            via: 'user'
        },
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
        }

    },
    
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
        });
    }

};
