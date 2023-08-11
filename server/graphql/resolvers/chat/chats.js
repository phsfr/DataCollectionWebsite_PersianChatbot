const { PubSub, withFilter, ApolloError } = require('apollo-server')
const checkAuth = require('../../../util/check-auth')
const User = require('../../../models/User')
const Message = require('../../../models/chat/Message')
const MessageCollect = require('../../../models/chat/MessageCollect')
const MessageList = require('../../../models/chat/MessageList')
const Profile = require('../../../models/chat/profile')
const { on } = require('../../../models/User')
const profileGen = require('../chat/GenerateProfile')

const subscribers = {}
const subscribersMessage = {}
const requestSubs = {}
const requestAnswerSubs = {}
// const onlines = []
const onMessagesUpdatesAllChats = (chanl, fn) => (subscribersMessage[chanl] = fn)
const onMessagesUpdates = (receiver, fn) => (subscribers[receiver] = fn)
const onRequestUpdates = (receiver, fn) => (requestSubs[receiver] = fn)
const onRequestAnswerUpdates = (receiver, fn) =>
  (requestAnswerSubs[receiver] = fn)
const isChatValid = (text) => {
  return true
}
const chatResolvers = {
  Query: {
    topChatUsers: async () => {
      return await User.find().sort({ chatPoints: -1, updatedAt: 1 })
    },
    topChatUsers_my: async () => {
      const users = await User.find().sort({updatedAt: 1 }).populate('chats')
      let scores = []
      users.forEach((u) => {
        // var profPoints = 0
        var chatPoint = 0
        for (let i = 0; i < u.chats.length; i++) {
          var profPoints = (u.chats[i].user==u.username? u.chats[i].predictRPoint:u.chats[i].predictUPoint)/13
          var numDirectQ = (u.chats[i].user==u.username? u.chats[i].directCountU:u.chats[i].directCountR)
          var chatLens = Math.floor(u.chats[i].messages.length/2)
          if(chatLens==0){
            chatPoint += 0
          }else{
            chatPoint += Math.floor((profPoints/(numDirectQ+chatLens))*100)
          }
          // profPoints += (u.chats[i].user==u.username? u.chats[i].predictRPoint:u.chats[i].predictUPoint)
        }
        const totalPoints = chatPoint//u.chatPoints + profPoints
        scores.push({'username': u.username, 'totalPoints':totalPoints})
      })
      return scores.sort((a, b)=>{return b.totalPoints-a.totalPoints})//({ totalPoints: -1, updatedAt: 1 })
    },
    messages: async (parent, args, context, info) => {
      const receiverUser = await User.findOne({
        username: args.receiver,
      }).populate('chats')
      const chats = receiverUser.chats.filter(
        (c) => c.receiver === args.other || c.user === args.other
      )
      return chats
    },
    messages_my: async (parent, args, context, info) => {
      const receiverUser = await User.findOne({
        username: args.receiver,
      }).populate('chats')
      const chats = receiverUser.chats.findOne({_id:args.other}).populate('messages')
      return chats.messages
    },
    findChat: async (parent, {chatId}, context, info) =>{
      const reqChat = await MessageCollect.findOne({_id: chatId}).populate('messages')
      //const messages = reqChat.populate('messages')
      return reqChat.messages
      //return messages || []
    },
    myChats: async (parent, args, context, info) => {
      const user = checkAuth(context)
      // console.log('Here: ' + JSON.stringify(user, null, 2))
      const userObj = await User.findOne({
        username: user.username,
      }).populate('chats')
      const map = new Map()
      userObj.chats.forEach((c) => {
        if (c.receiver === userObj.username) {
          if (!map.has(c.user)) map.set(c.user, c)
          else if (map.get(c.user).createdAt < c.createdAt) map.set(c.user, c)
        } else if (c.user === userObj.username) {
          if (!map.has(c.receiver)) map.set(c.receiver, c)
          else if (map.get(c.receiver).createdAt < c.createdAt)
            map.set(c.receiver, c)
        }
      })
      return Array.from(map).map(([key, value]) => ({
        receiver: key,
        lastMessage: value,
      }))
    },
    getChatAlias:  async (parent, {chatId}, context, info) => {
      const user = checkAuth(context)
      const reqChat = await MessageCollect.findOne({_id: chatId}).populate('messages')
      const otherUser = (reqChat.user==user.username ? reqChat.receiver: reqChat.user)
      const otherUserObj = await User.findOne({username: otherUser})
      return otherUserObj.alias
    },
    myChats_my: async (parent, args, context, info) => {
      const user = checkAuth(context)
      
      // console.log('Here: ' + JSON.stringify(user, null, 2))
      // console.log('user name is: ')
      // console.log(user.username)
      const userObj = await User.findOne({
        username: user.username,
      }).populate({path:'chats', populate:'messages userProfile receiverProfile'}) //[{path:'messages'}, {path: 'userProfile'}]})
      //return userObj.chats
      //console.log(userObj)
      const map = new Map()
      for(const c of userObj.chats){
        const otherUser = (c.user==userObj.username ? c.receiver: c.user)
        const otherUserObj = await User.findOne({username: otherUser})
        map.set(c.id, {"messages":c.messages, "user":otherUser, "alias":otherUserObj.alias, "createdAt": c.createdAt, "updatedAt":c.updatedAt})
      }
      // userObj.chats.forEach((c) => {
      //   //const chat = MessageCollect.findOne({_id: c.id}).populate('messages')
      //   const otherUser = (c.user==userObj.username ? c.receiver: c.user)
      //   const otherUserObj = User.findOne({username: otherUser})
      //   map.set(c.id, {"messages":c.messages, "user":otherUser, "alias":otherUserObj.alias, "createdAt": c.createdAt, "updatedAt":c.updatedAt})
      //   // if (c.receiver === userObj.username) {
      //   //  if (!map.has(c.user)) map.set(c.user, {"messages":c.messages, "id"})
      //   //  //else if (map.get(c.user).createdAt < c.createdAt) map.set(c.user, chat.messages)
      //   // } else if (c.user === userObj.username) {
      //   //  if (!map.has(c.receiver)) map.set(c.receiver, c.messages)
      //   //  //else if (map.get(c.receiver).createdAt < c.createdAt)
      //   //    map.set(c.receiver, chat.messages)
      //   // }
      // })
      
      // console.log('map is: ')
      // console.log(map)
      return Array.from(map).map(([key, value]) => ({
        id: key,
        messages: value.messages,
        user: value.user,
        alias: value.alias,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt
      }))
    },
    getProfiles: async (parent, {messageColl_id}, context, info) => {
      const user = checkAuth(context)
      //const userObj = await User.findOne({username: user.username})
      const messageCol = await MessageCollect.findOne({
        _id: messageColl_id,
      }).populate('userProfile').populate('predictRProfile receiverProfile predictUProfile')
      let userProf, predictUProf, predictRProf, receiverProf
      if(user.username == messageCol.user)
      {
        userProf = messageCol.userProfile[0]
        predictRProf = (messageCol.predictRProfile.length > 0 ? messageCol.predictRProfile[0]:null)
        receiverProf = messageCol.receiverProfile[0]
      }else{
        userProf = messageCol.receiverProfile[0]
        predictRProf = (messageCol.predictUProfile.length > 0 ? messageCol.predictUProfile[0]:null)
        receiverProf = messageCol.userProfile[0]
      }
      return {'userProfile': userProf, 'predictRProfile':predictRProf, 'receiverProfile':receiverProf}//, 'profilePoint':userObj.profilePoints}
    },
    getProfilePoint: async (parent, {messageColl_id}, context, info) => {
      const user = checkAuth(context)
      const messageCol = await MessageCollect.findOne({_id: messageColl_id})
      const pointProfile = (messageCol.user==user.username ? messageCol.predictRPoint:messageCol.predictUPoint)
      // const userObj = await User.findOne({username: user.username})
      return pointProfile//userObj.profilePoints
    },
    onlineUsersInit: async () => {
      //{ isOnline: true }
      const onlines = await User.find()
      return onlines
    },
    allChatPoints: async () => {
      const users = await User.find().populate('chats')
      let points = 0
      users.forEach((u) => { 
        // var profPoints = 0
        // var numDirectQ = 0
        // var chatLens = 0
        var chatPoint = 0
        for (let i = 0; i < u.chats.length; i++) {
          var profPoints = (u.chats[i].user==u.username? u.chats[i].predictRPoint:u.chats[i].predictUPoint)/13
          var numDirectQ = (u.chats[i].user==u.username? u.chats[i].directCountU:u.chats[i].directCountR)
          var chatLens = Math.floor(u.chats[i].messages.length/2)
          if(chatLens==0){
            chatPoint += 0
          }else{
            chatPoint += Math.floor((profPoints/(numDirectQ+chatLens))*100)
          }
        }
        points += chatPoint //u.chatPoints + profPoints
      })
      return points
    },
    getUserCount: async()=>{
      const userCounts = await User.countDocuments()+1
      return userCounts
    },
  },
  Mutation: {
    setOnLineUser:  async (parent, {username}, context) => {
      const user = await User.findOne({username: username})
      user.isOnline = false
      await user.save()
      return user._id
    },
    postReceiverProfile:  async (parent, {chatId, profilePoint, age, job, spouseJob, fatherJob, motherJob, name, gender, 
      noSiblings, noSisters, noBrothers, noChildren, noGirls, noBoys, mariageStatus, hobby, favBook, favFilm, favDish, 
      resistance}, context) => {

      const user = checkAuth(context)
      // const userObj = await User.findOne({username:user.username})
      // userObj.profilePoints = profilePoint
      // await userObj.save()

      const chat = await MessageCollect.findOne({_id: chatId}).populate('predictRProfile predictUProfile')

      const newPredRProf = new Profile({
          name,
          job,
          age,
          spouseJob,
          motherJob,
          fatherJob,
          gender, 
          noSiblings, 
          noSisters, 
          noBrothers, 
          noChildren, 
          noGirls,
          noBoys,
          mariageStatus,
          hobby, 
          favBook, 
          favFilm, 
          favDish, 
          resistance,
        })
      await newPredRProf.save()
      let removeProf
      if(user.username==chat.user){
        removeProf = chat.predictRProfile.pop()
        chat.predictRProfile.push(newPredRProf)
        chat.predictRPoint = profilePoint
      }else{
        removeProf = chat.predictUProfile.pop()
        chat.predictUProfile.push(newPredRProf)
        chat.predictUPoint = profilePoint
      }
      await chat.save()
      if(removeProf!=undefined) {await Profile.deleteOne({_id:removeProf._id})}
      return chat._id
    },
    postMessage: async (parent, { user, receiver, content }, context) => {
      // console.log('AAAAAAAAAAAa')
      checkAuth(context)
      // console.log('شسیییییییی')
      const senderUser = await User.findOne({ username: user }).populate(
        'chats'
      )
      const receiverUser = await User.findOne({ username: receiver })
      if (!isChatValid(content)) return 'notvalid'
      const chats = senderUser.chats.filter(
        (c) => c.receiver === receiver || c.user === receiver
      )
      const chatsCount = chats.length
      if (chatsCount !== 0) {
        const lastChat = chats[chatsCount - 1]
        if (lastChat.user === user) return 'notyourturn'
        else if (chatsCount == 6) {
          senderUser.chatPoints += 4
        } else if (chatsCount == 7) {
          senderUser.chatPoints += 4
        } else if (chatsCount > 7) senderUser.chatPoints++
      }

      const message = new Message({
        user,
        receiver,
        content,
      })

      await message.save()
      receiverUser.chats.push(message)
      senderUser.chats.push(message)

      await receiverUser.save()
      await senderUser.save()
      if (subscribers[receiver]) await subscribers[receiver](user)

      if (subscribers[user]) await subscribers[user](receiver)
      if (requestSubs[receiver]) requestSubs[receiver](user)
      return message.id
    },
    addMessage: async (parent, {chatId, content}, context) => {
      const chat = await MessageCollect.findOne({_id: chatId})
      const message = new Message({
        user: chat.user,
        receiver: chat.receiver,
        content,
      })
      await message.save()
      chat.messages.push(message)
      await chat.save()

      return message.id
    },
    plusDirectQNums_msgcollect: async (parent, {chatId}, context) => {
      const user = checkAuth(context)
      // const username="pegah"
      // console.log('inside plusDirectQNums_msgcollect func')
      // console.log(user.username)
      
      const chat = await MessageCollect.findOne({_id: chatId}).populate('messages')
      // console.log(chat.user)
      if (user.username==chat.user){
        chat.directCountU += 1
      }else{
        chat.directCountR += 1
      }
      if(chat.messages.length>0){
        const msg = chat.messages[chat.messages.length-1]//await Message.findOne({_id:msgId})
        msg.isDirect = true
        await msg.save()
      }
      await chat.save()
      return chat._id
    },
    postMessage_my: async (parent, { user, receiver, content, isDirect }, context) => {
      checkAuth(context)
      const senderUser = await User.findOne({ username: user }).populate(
        'chats'
      )
      const chat = await MessageCollect.findOne({_id: receiver}).populate('messages')
      // return chat.messages
      
      var chatReceiverName = chat.receiver
      if (chat.user != user) chatReceiverName = chat.user
      const receiverUser = await User.findOne({ username: chatReceiverName })//.populate('chats')
      if (!isChatValid(content)) return 'notvalid'
      // const chats = senderUser.chats.filter(
      //   (c) => c.receiver === receiver || c.user === receiver
      // )
      const messages = chat.messages
      const chatsCount = messages.length
      if (chatsCount !== 0) {
        const lastChat = messages[chatsCount - 1]
        if (lastChat.user === user) return 'notyourturn'
        else if (chatsCount == 6) {
          senderUser.chatPoints += 4
        } else if (chatsCount == 7) {
          senderUser.chatPoints += 4
        } else if (chatsCount > 7) senderUser.chatPoints++
      }

      const message = new Message({
        user,
        receiver: chatReceiverName,// receiver,
        content,
        isDirect,
      })

      if(isDirect) chat.directCount += 1

      await message.save()
      chat.messages.push(message)
      await chat.save()
      // receiverUser.chats.messages.push(message)
      // senderUser.chats.messages.push(message)

      await receiverUser.save()
      await senderUser.save()
      if (subscribers[chatReceiverName]) await subscribers[chatReceiverName](receiver)

      if (subscribers[user]) await subscribers[user](receiver)
      if (requestSubs[chatReceiverName]) requestSubs[chatReceiverName](receiver)
      return message.id
    },
    registerChat: async (parent, {user, receiver}, context) => {
      checkAuth(context)
      const randProf1 = profileGen.getProfile()
      const newProfile1 = new Profile({
        name: randProf1.name,
        age: randProf1.age,
        gender: randProf1.gender,
        mariageStatus: randProf1.marriageStatus,
        resistance: randProf1.resistance,
        job: randProf1.job,
        spouseJob: (randProf1.spouseJob!=''? randProf1.spouseJob: null),
        motherJob: randProf1.motherJob,
        fatherJob: randProf1.fatherJob,
        noSiblings: randProf1.noSiblings,
        noBrothers: randProf1.noBothers,
        noSisters: randProf1.noSisters,
        noChildren: (randProf1.noChildren!=-1? randProf1.noChildren: null),
        noBoys: (randProf1.noBoys!=-1? randProf1.noBoys: null),
        noGirls: (randProf1.noGirls!=-1? randProf1.noGirls: null),
        hobby: randProf1.hobby,
        favBook: randProf1.favBook,
        favDish: randProf1.favDish,
        favFilm: randProf1.favFilm
      })

      await newProfile1.save()

      const randProf2 = profileGen.getProfile()
      const newProfile2 = new Profile({
        name: randProf2.name,
        age: randProf2.age,
        gender: randProf2.gender,
        mariageStatus: randProf2.marriageStatus,
        resistance: randProf2.resistance,
        job: randProf2.job,
        spouseJob: (randProf2.spouseJob!=''? randProf2.spouseJob: null),
        motherJob: randProf2.motherJob,
        fatherJob: randProf2.fatherJob,
        noSiblings: randProf2.noSiblings,
        noBrothers: randProf2.noBothers,
        noSisters: randProf2.noSisters,
        noChildren: (randProf2.noChildren!=-1? randProf2.noChildren: null),
        noBoys: (randProf2.noBoys!=-1? randProf2.noBoys: null),
        noGirls: (randProf2.noGirls!=-1? randProf2.noGirls: null),
        hobby: randProf2.hobby,
        favBook: randProf2.favBook,
        favDish: randProf2.favDish,
        favFilm: randProf2.favFilm,
      })

      await newProfile2.save(        
        /*function (err) {
        if (err) return handleError(err);
        const messageCol = new MessageCollect({
          user: user,
          receiver: receiver,
          userProfile: newProfile1._id,
          receiverProfile: newProfile2._id,
        });
        messageCol.save(function(err) {if (err) return handleError(err); });
      }*/)
      const senderUser = await User.findOne({ username: user }).populate('chats')
      const receiverUser = await User.findOne({ username: receiver })

      const messageCol = new MessageCollect({
        user: user,
        receiver: receiver,
        //userProfile: newProfile1._id,
        //receiverProfile: newProfile2._id,
      })
      
      //messageCol.userProfile._id = newProfile1._id
      //messageCol.receiverProfile._id = newProfile2._id
      messageCol.userProfile.push(newProfile1)
      messageCol.receiverProfile.push(newProfile2)
      await messageCol.save()//function(err) {if (err) return console.log(JSON.stringify(err)); })
      receiverUser.chats.push(messageCol)
      senderUser.chats.push(messageCol)
      await receiverUser.save()
      await senderUser.save()
      return messageCol.id
    },
    postMessageWithProf: async (parent, { user, receiver, content, userProfile, receiverProfile }, context) => {
      // console.log('AAAAAAAAAAAa')
      checkAuth(context)
      // console.log('شسیییییییی')
      const senderUser = await User.findOne({ username: user }).populate(
        'chats'
      )
      const receiverUser = await User.findOne({ username: receiver })
      if (!isChatValid(content)) return 'notvalid'
      const chatMessages = senderUser.chats.populate('messages')
      const chats = chatMessages.filter(
        (c) => (c.userProfile == userProfile) && c.receiver === receiver || c.user === receiver
      )
      /*const chatsCount = chats.length
      var shouldbeAdded = false
      if (chatsCount !== 0) {
        const lastChat = chats[chatsCount - 1]
        if (lastChat.user === user) return 'notyourturn'
        else if (chatsCount == 6) {
          senderUser.chatPoints += 4
        } else if (chatsCount == 7) {
          senderUser.chatPoints += 4
        } else if (chatsCount > 7) senderUser.chatPoints++
      }else{
        shouldbeAdded = true
      }

      const message = new Message({
        user,
        receiver,
        content,
      })

      await message.save()
      if (shouldbeAdded){
        const messageCol = new MessageCollect({
          user,
          receiver,
          userProfile,
          receiverProfile,
          messages: [message],
        })
        receiverUser.chats.push(messageCol)
        senderUser.chats.push(messageCol)
      }
      receiverUser.chats.messages.push(message)
      senderUser.chats.messages.push(message)

      await receiverUser.save()
      await senderUser.save()
      if (subscribers[receiver]) await subscribers[receiver](user)

      if (subscribers[user]) await subscribers[user](receiver)
      if (requestSubs[receiver]) requestSubs[receiver](user)
      return message.id*/
    },
    exitChat: async (parent, {}, context) => {
      const user = checkAuth(context)
      // console.log(user.username + ' is exiting the chat')
    },
    chatRequest: async (parent, { user, receiver }, context) => {
      checkAuth(context)
      const receiverObj = await User.findOne({ username: receiver })
      const userObj = await User.findOne({ username: user })

      if (!receiverObj || !userObj || user === receiver) {
        throw new ApolloError(
          "User isn't available! for request " + user + ' ' + receiver
        )
      }

      requestSubs[receiver](user)
    },
    chatRequestAnswer: async (parent, { user, receiver }, context) => {
      checkAuth(context)
      // console.log(user + ' is sending e Answer to ' + receiver)
      const receiverObj = await User.findOne({ username: receiver })
      const userObj = await User.findOne({ username: user })
      if (!receiverObj || !userObj || user === receiver) {
        throw new ApolloError(
          "User isn't available! for answer " + user + ' ' + receiver
        )
      }
      requestAnswerSubs[receiver](user)
    },
  },
  Subscription: {
    onlineUsers: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('Online_Users_Channel')
      },
    },
    messages: {
      subscribe: async (parent, args, { pubsub }) => {
        const channel = args.receiver + '@' + args.other
        onMessagesUpdates(args.receiver, async (fromUser) => {
          const receiverUser = await User.findOne({
            username: args.receiver,
          }).populate('chats')
          const chats = receiverUser.chats.filter(
            (c) => c.receiver === fromUser || c.user === fromUser
          )

          pubsub.publish(args.receiver + '@' + fromUser, {
            messages: chats,
          })
        })
        setTimeout(async (fromUser) => {
          const receiverUser = await User.findOne({
            username: args.receiver,
          }).populate('chats')
          const chats = receiverUser.chats.filter(
            (c) => c.receiver === fromUser || c.user === fromUser
          )
          pubsub.publish(args.receiver + '@' + fromUser, {
            messages: chats,
          })
        }, 0)
        // console.log('CHANNEL: ' + channel)
        return pubsub.asyncIterator(channel)
      },
    },
    messages_my: {
      subscribe: async (parent, args, { pubsub }) => {
        // console.log('args.receiver: ' + args.receiver)
        // console.log('args.other: '+args.other)
        const channel = args.receiver + '@' + args.other

        onMessagesUpdates(args.receiver, async (fromUser) => {
          // console.log('(onMessageUpdates)args.receiver: '+args.receiver)
          // console.log('(onMessageUpdates)fromUser: '+fromUser)
          // console.log('(onMessageUpdates)args.other: '+args.other)
          
          const chats = await MessageCollect.findOne({_id:args.other}).populate('messages')
          pubsub.publish(args.receiver + '@' + fromUser, {
            messages_my: chats.messages,
          })
        })
        setTimeout(async (fromUser) => {
          // console.log('fromUser: '+fromUser)
          const chats = await MessageCollect.findOne({_id:args.other}).populate('messages')
          pubsub.publish(args.receiver + '@' + fromUser, {
            messages_my: chats.messages,
          })
        }, 0)
        // console.log('CHANNEL: ' + channel)
        return pubsub.asyncIterator(channel)
      },
    },
    chatRequestSub: {
      subscribe: async (parent, args, { pubsub }) => {
        const channel = args.receiver + '@request'
        // console.log('SUBBING ON + ' + channel)
        onRequestUpdates(args.receiver, (fromUser) =>
          pubsub.publish(channel, { chatRequestSub: fromUser })
        )
        setTimeout(() => pubsub.publish(channel, { chatRequestSub: '' }), 0)
        return pubsub.asyncIterator(channel)
      },
    },
    chatRequestAnswerSub: {
      subscribe: async (parent, args, { pubsub }) => {
        const channel = args.receiver + '@requestanswer'
        // console.log('SUBBING ON Answer + ' + channel)
        onRequestAnswerUpdates(args.receiver, (fromUser) =>
          pubsub.publish(channel, { chatRequestAnswerSub: fromUser })
        )
        setTimeout(
          () => pubsub.publish(channel, { chatRequestAnswerSub: '' }),
          0
        )
        return pubsub.asyncIterator(channel)
      },
    },
  },
}

module.exports = { chatResolvers }
