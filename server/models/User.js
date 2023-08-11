const { Schema, model } = require('mongoose')
const { UserRequestSchema } = require('./UserRequest')

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    alias:{
      type: String,
      require: true,
      tirm:true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    requests: {
      type: [{ type: Schema.Types.ObjectId, ref: 'UserRequest' }],
      required: true,
      default: [],
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    profilePoints:{
      type: Number,
      required: true,
      default: 0,
    },
    tempPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    chats: {
      type: [{ type: Schema.Types.ObjectId, ref: 'MessageCollect' }],
      default: [],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    chatPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    didRegisterForChat: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
)

module.exports = model('User', userSchema)
