const freelancerRouter = require('./routers/freelancer')
const accountRouter = require('./routers/account')
const employerRouter = require('./routers/employer')

const route = (app) => {
    app.use('/api/v1/freelancer', freelancerRouter)
    app.use('/api/v1/account', accountRouter)
    app.use('/api/v1/employer', employerRouter)
}

module.exports = route