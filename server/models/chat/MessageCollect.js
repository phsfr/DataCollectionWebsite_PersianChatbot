const { Schema, model } = require('mongoose')

const messageCollectSchema = new Schema(
  {
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
    userProfile: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
      default: [],
    },
    receiverProfile: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
      default: [],
    },
    predictUProfile: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
      default: [],
    },
    predictUPoint:{
      type: Number,
      required: true,
      default: 0,
    },
    predictRProfile: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
      default: [],
    },
    predictRPoint:{
      type: Number,
      required: true,
      default: 0,
    },
    directCountU:{
      type: Number,
      default: 0,
    },
    directCountR:{
      type: Number,
      default: 0,
    },
    messages: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('MessageCollect', messageCollectSchema)
