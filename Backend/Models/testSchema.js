const { Schema, model } = require('mongoose')

const testSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
})

const Test = model('Test', testSchema)

module.exports = Test