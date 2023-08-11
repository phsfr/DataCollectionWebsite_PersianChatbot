const { Schema, model } = require('mongoose')

const userRequestchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
      minlength: 10,
    },
    type: {
      type: String,
      enum: ['REQUEST', 'QUESTION', 'OPINION', 'OTHER'],
    },
    possibleReference: {
      type: String,
    },
    properties: {
      type: [{ type: String, enum: ['INSULT', 'SARCASM', 'HUMOR'] }],
      default: [],
    },
    place: {
      type: String,
      enum: ['TWITTER', 'WEBSITE'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = {
  UserRequest: model('UserRequest', userRequestchema),
  userRequestSchema: userRequestchema,
}
