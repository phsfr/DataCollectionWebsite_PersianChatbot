const { Schema, model } = require('mongoose')

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
    receiver: {
      type: String,
      required: true,
      trim: true,
    },
    isDirect: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('Message', messageSchema)
