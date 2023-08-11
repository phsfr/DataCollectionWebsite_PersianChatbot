const { UserInputError } = require('apollo-server')

const User = require('../../models/User')
const { UserRequest } = require('../../models/UserRequest')
const { validateRequestInput } = require('../../util/validators')
const checkAuth = require('../../util/check-auth')

module.exports = {
  Query: {
    userRequests: async () => {
      try {
        let userRequests = await UserRequest.find().sort({ createdAt: -1 })
        return userRequests
      } catch (error) {
        throw new Error(error)
      }
    },
    userRequest: async (parent, { username }, context, info) => {
      try {
        const user = await User.findOne({ username })

        if (user) {
          const userRequest = await UserRequest.find({ user: user._id }).sort({
            createdAt: -1,
          })
          if (userRequest) {
            return userRequest
          } else {
            throw new Error('User Request Not Found')
          }
        } else {
          throw new Error('User Not Found')
        }
      } catch (e) {
        throw new Error(e)
      }
    },
  },
  Mutation: {
    addUserRequest: async (
      parent,
      {
        userRequestInput: { text, type, possibleReference, properties, place },
      },
      context,
      info
    ) => {
      const user = checkAuth(context)

      const { errors, valid } = validateRequestInput(text)

      if (!valid) {
        throw new UserInputError('Validation Error', {
          errors: {
            errors,
          },
        })
      }

      const newUserRequest = new UserRequest({
        user: user.id,
        text: text,
        type: type,
        possibleReference: possibleReference,
        properties: properties,
        place: place,
      })

      const res = await newUserRequest.save()

      User.findById(user.id, async (err, user) => {
        if (err) {
          throw new Error(err)
        } else {
          user.requests.push(res)

          if (place === 'WEBSITE') {
            user.points = user.points + 5
          } else {
            user.points = user.points + 2
          }
          await user.save()

          context.pubsub.publish('NEW_USER_REQUEST', {
            newUserRequest: newUserRequest,
          })
          context.pubsub.publish('NEW_TOP_USERS', {
            newTopUsers: await User.find()
              .sort({ points: -1, updatedAt: 1 })
              .limit(10),
          })
        }
      })
      return newUserRequest
    },
  },
  Subscription: {
    newUserRequest: {
      subscribe: (parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('NEW_USER_REQUEST')
      },
    },
  },
}
