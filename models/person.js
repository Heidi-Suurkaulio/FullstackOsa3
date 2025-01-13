const mongo = require('mongoose')

mongo.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongo.connect(url)
  .then(result => {
    console.log(`connected to MongoDB ${result.connection.name}`)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const newSchema = new mongo.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2}-\d{6,}/.test(v) || /\d{3}-\d{5,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})

newSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongo.model('Person', newSchema)