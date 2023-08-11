const { Schema, model } = require('mongoose')

const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    resistance: {
      type: String,
      required: false,
      trim: true,
    },
    parentResist: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: false,
      trim: true,
    },
    spouseAge: {
      type: Number,
      required: false,
      trim: true,
    },
	  gender: {
      type: Boolean,
      required: false,
      trim: true,
    },
    mariageStatus:{
      type: String,
      required: false
    },
	  job: {
      type: String,
      required: false,
      trim: true,
    },
	  spouseJob: {
      type: String,
      required: false,
      trim: true,
    },
    fatherJob: {
      type: String,
      required: false,
      trim: true,
    },
    motherJob: {
      type: String,
      required: false,
      trim: true,
    },
    noSiblings: {
      type: Number,
      required: false,
      trim: true,
    },
	  noSisters: {
      type: Number,
      required: false,
      trim: true,
    },
    noBrothers: {
      type: Number,
      required: false,
      trim: true,
    },
	  noBoys: {
      type: Number,
      required: false,
      trim: true,
    },
	  noGirls: {
      type: Number,
      required: false,
      trim: true,
    },
    noChilren: {
      type: Number,
      required: false,
      trim: true,
    },
    hobby: {
      type: String,
      required: false,
      trim: true,
    },
    favBook: {
      type: String,
      required: false,
      trim: true,
    },
    favFilm: {
      type: String,
      required: false,
      trim: true,
    },
    favDish: {
      type: String,
      required: false,
      trim: true,
    },
    favMusic: {
      type: String,
      required: false,
      trim: true,
    },
    eduLevel: {
      type: String,
      required: false,
      trim: true,
    },
    eduField: {
      type: String,
      required: false,
      trim: true,
    },
    eduUni: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('Profile', profileSchema)