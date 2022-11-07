require('dotenv').config()
const jwt = require('jsonwebtoken')
const {SECRET} = process.env

//Secret value is reaching into the .env file. 

module.exports = {
    isAuthenticated: (req, res, next) => {
        const headerToken = req.get('Authorization')

        //isAuthenticated is a variable that is checking if we have authorization. 

        if (!headerToken) {
            console.log('ERROR IN auth middleware')
            res.sendStatus(401)
        }

        //If the headertoken is not called properly(we are not authenticated), then there is an error in authenticating the middleware, and we should send a 401 error. 

        let token

        try {
            token = jwt.verify(headerToken, SECRET)
        } catch (err) {
            err.statusCode = 500
            throw err
        }
        //This is in case something goes wrong and it will throw the error as feedback to the user. 

        if (!token) {
            const error = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }
        //This error is in case token doesn't come back as true, and it will throw an error. 
        next()
    }
}
//next is a third argument that will automatically be passed in at any middleware, and it will move on to the next function when invoked. 