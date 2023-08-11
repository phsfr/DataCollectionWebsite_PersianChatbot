const { gql } = require('apollo-server')

module.exports = gql`
  scalar Date
  scalar Void
  enum RequestPlace {
    WEBSITE
    TWITTER
  }

  enum RequestType {
    QUESTION
    REQUEST
    OPINION
    OTHER
  }

  enum RequestProperty {
    INSULT
    SARCASM
    HUMOR
  }

  type User {
    id: ID!
    username: String!
    alias: String!
    token: String!
    requests: [ID]!
    points: Int
    createdAt: Date!
    updatedAt: Date!
    chats: [MessageCollect]
    isOnline: Boolean
    chatPoints: Int
    profilePoints: Int
  }

  type Profile {
    id: ID!
    name: String
    resistance: String
    parentResist: String
    age: Int
    spouseAge: Int
	  gender: Boolean
    mariageStatus: String
    job: String
    spouseJob: String
    fatherJob: String
    motherJob: String
    noSiblings: Int
    noSisters: Int
    noBrothers: Int
    noBoys: Int
    noGirls: Int
    noChilren: Int
    hobby: String
    favBook: String
    favFilm: String
    favDish: String
    eduLevel: String
    eduField: String
    eduUni: String
    createdAt: Date!
    updatedAt: Date!
  }

  type UserRequest {
    id: ID!
    user: ID!
    text: String!
    type: RequestType
    possibleReference: String
    properties: [RequestProperty]
    place: RequestPlace!
    createdAt: Date!
    updatedAt: Date!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input RegisterProfInput {
    name: String! 
    age: Int!
    job: String!
    spouseJob: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input UserRequestInput {
    text: String!
    type: RequestType
    possibleReference: String
    properties: [RequestProperty]
    place: RequestPlace!
  }
  type Message {
    id: ID!
    user: String!
    receiver: String!
    content: String!
    createdAt: Date!
  }
  type MessageCollect{
    user: String!
    receiver: String!
    userProfile: [Profile]
    receiverProfile: [Profile]
    predictUProfile: [Profile]
    predictRProfile: [Profile]
    messages: [Message]
  }
  type ChatHistoryHeader {
    receiver: String!
    lastMessage: Message!
  }
  type ChatHistoryHeaderMy {
    receiver: String!
    lastMessage: [Message!]
  }
  type ChatHistoryHeaderMy1 {
    id: ID!
    user: String!
    alias: String!
    messages: [Message!]
    createdAt: Date!
    updatedAt: Date!
  }
  type allProfiles{
    userProfile: Profile!
    predictRProfile: Profile
    receiverProfile: Profile!
  }
  type UserSummary{
    username: String!
    totalPoints: Int
  }
  type Query {
    users: [User]!
    topUsers: [User]!
    userRequests: [UserRequest]!
    userRequest(username: String!): [UserRequest]

    onlineUsersInit: [User]!
    messages(receiver: String!, other: String!): [Message!]
    messages_my(receiver: String!, other: String!): [Message!]
    myChats: [ChatHistoryHeader!]
    myChats_my: [ChatHistoryHeaderMy1!]
    allChatPoints: Int
    topChatUsers: [User]!
    profiles: [Profile]!
    findChat(chatId: ID!): [Message]
    getProfiles(messageColl_id: ID!): allProfiles
    getProfilePoint(messageColl_id: ID!):Int!
    getUserCount:Int
    getChatAlias(chatId: ID!): String!
    topChatUsers_my:[UserSummary]!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(loginInput: LoginInput): User!
    addUserRequest(userRequestInput: UserRequestInput): UserRequest!

    chatRequestAnswer(user: String!, receiver: String!): Void
    chatRequest(user: String!, receiver: String!): Void
    postMessage(user: String!, receiver: String!, content: String!): ID!
    postMessage_my(user: String!, receiver: String!, content: String!, isDirect: Boolean!): ID!
    exitChat: Void
    registerProfile(registerProfInput: RegisterProfInput): Profile!
    postMessageWithProf(user: String!, receiver: String!, content: String!, userProfile: ID!, receiverProfile: ID!): Void
    registerChat(user: String!, receiver: String!): ID!
    addMessage(chatId: ID!, content: String!):ID!
    postReceiverProfile(chatId: String!, profilePoint: Int!, age:Int, job: String, spouseJob: String, fatherJob: String, motherJob: String, name: String!, 
      gender:Boolean, noSiblings:Int, noSisters:Int, noBrothers:Int, noChildren:Int, noGirls:Int, noBoys:Int, mariageStatus:String,
      hobby:String, favBook:String, favFilm:String, favDish:String, resistance:String):ID!
    setOnLineUser(username:String!):ID!
    plusDirectQNums_msgcollect(chatId:ID!):ID!
  }

  type Subscription {
    newUserRequest: UserRequest!
    newTopUsers: [User]!
    newMessage(receiver: String!): Message
    messages(receiver: String!, other: String!): [Message!]
    messages_my(receiver: String!, other: String!): [Message!]
    chatRequestSub(receiver: String!): String
    chatRequestAnswerSub(receiver: String!): String
    onlineUsers: [User]!
  }
`
