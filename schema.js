const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      budget: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            return /^#[0-9A-Fa-f]{6}$/.test(value);
          },
          message: (props) => `${props.value} is not a valid color`,
        },
      },
}, {collection: 'chartData'})

module.exports = mongoose.model('chartData', schema)