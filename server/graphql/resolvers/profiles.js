const { UserInputError } = require('apollo-server')

const jwt = require('jsonwebtoken')
require('dotenv').config()

const Profile = require('../../models/chat/profile')
const {
    validateProfileInput,
} = require('../../util/validators')

const generateToken = (profile) => {
  return jwt.sign(
    {
      id: profile.id,
      name: profile.name,
    },
    'secretkey',
    { expiresIn: '10h' }
  )
}

module.exports = {
  Query: {
    profiles: async () => {
      try {
        return await Profile.find().sort({ points: -1, updatedAt: 1 })
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    registerProfile: async (
      parent,
      { registerProfInput: { name, age, job, spouseJob} },
      context,
      info
    ) => {

      const newProfile = new Profile({
        name,
        age,
        job,
        spouseJob,
      })

      const res = await newProfile.save()

      return {
        ...res._doc,
        id: res._id, 
      }
    },
  },
}
