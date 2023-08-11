const User = require('../../models/User')

module.exports = {
  Query: {
    topUsers: async () => {
      try {
        return await User.find().sort({ points: -1, updatedAt: 1 }).limit(10)
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Subscription: {
    newTopUsers: {
      subscribe: (parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('NEW_TOP_USERS')
      },
    },
  },
}
