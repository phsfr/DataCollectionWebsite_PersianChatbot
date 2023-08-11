const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()
const checkAuth = require('./util/check-auth')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')
const User = require('./models/User')

const pubsub = new PubSub()
const PORT = process.env.PORT || 4000
const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: async (connectionParams, webSocket, context) => {
      try {
        const username = checkAuth(connectionParams.authToken).username
        const user = await User.findOne({ username })
        user.isOnline = true
        await user.save()
        const onlines = await User.find()
        webSocket['UserName'] = user.username
        pubsub.publish('Online_Users_Channel', {
          onlineUsers: onlines,
        })
      } catch (e) {
        console.log('onConnect Error ' + e)
      }
    },
    onDisconnect: async (webSocket, context) => {
      const username = webSocket['UserName']
      const user = await User.findOne({ username })
      if (!user) return
      user.isOnline = false
      await user.save()
      const onlines = await User.find()
      pubsub.publish('Online_Users_Channel', {
        onlineUsers: onlines,
      })
    },
  },
  context: ({ req }) => ({ req, pubsub }),
})

mongoose
  .connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
    return server.listen({
      port: PORT,
    })
  })
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
