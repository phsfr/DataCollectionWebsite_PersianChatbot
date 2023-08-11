const users = require('./users')
const profiles = require('./profiles')
const topUsers = require('./topUsers')
const userRequestResolvers = require('./userRequests')
const { chatResolvers } = require('./chat/chats')
const { Date } = require('./date')

module.exports = {
  Query: {
    ...userRequestResolvers.Query,
    ...users.Query,
    ...profiles.Query,
    ...topUsers.Query,
    ...chatResolvers.Query,
  },
  Mutation: {
    ...users.Mutation,
    ...profiles.Mutation,
    ...userRequestResolvers.Mutation,
    ...chatResolvers.Mutation,
  },
  Subscription: {
    ...userRequestResolvers.Subscription,
    ...topUsers.Subscription,
    ...chatResolvers.Subscription,
  },
  Date: Date,
}
