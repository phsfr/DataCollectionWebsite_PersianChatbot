const { Schema, model } = require('mongoose')

const messageListSchema = new Schema(
  {
    user: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      required: true,
    },
    receiver: {
      type: String,
      required: true,
      trim: true,
    },
    messages: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('MessageList', messageListSchema)
