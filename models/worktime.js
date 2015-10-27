
module.exports = {
    identity: 'worktime',
    connection: 'default',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            unique: true
        },
        dateFrom: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        dateTo: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        user: {
            model: 'user',
        },
    }
};
