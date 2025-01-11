const mongoose = require('mongoose')
const args = process.argv.length

/**
 * Establishes a connection to the database
 * @returns {Object} connection object to database
 */
function makeConnection() {
    const username = process.argv[2]
    const password = process.argv[3]

    const url =
        `mongodb+srv://${username}:${password}@phonebook.ocxs9.mongodb.net/phonebook?retryWrites=true&w=majority`

    mongoose.set('strictQuery', false)
    mongoose.connect(url)

    //id later
    const newSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    return mongoose.model('Person', newSchema)
}

switch (args) {
    case 4:
        const FindPerson = makeConnection()

        // TODO fix ugly + method
        FindPerson.find({}).then(result => {
            result.forEach(pe => {
                console.log(pe.name + " " + pe.number)
            })
            mongoose.connection.close()
        })
        break
    case 6:
        const name = process.argv[4]
        const number = process.argv[5]

        const Person = makeConnection()
        const person = new Person({
            name: name,
            number: number,
        })
        
        person.save().then(result => {
            console.log(`Added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
        break
    default:
        console.log('give username and password as argument')
        process.exit(1)
}