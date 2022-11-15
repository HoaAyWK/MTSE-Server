const freelancerRouter = require('./routers/freelancer')
const accountRouter = require('./routers/account')
const employerRouter = require('./routers/employer')
const jobRouter = require('./routers/job')
const appliedRouter = require('./routers/applied')
const categoryRouter = require('./routers/category')
const skillRouter = require('./routers/skill')
const commentRouter = require('./routers/comment')

const route = (app) => {
    app.use('/api/v1/freelancer', freelancerRouter)
    app.use('/api/v1/account', accountRouter)
    app.use('/api/v1/employer', employerRouter)
    app.use('/api/v1/job', jobRouter)
    app.use('/api/v1/applied', appliedRouter)
    app.use('/api/v1/category', categoryRouter)
    app.use('/api/v1/skill', skillRouter)
    app.use('/api/v1/comment', commentRouter)
}

module.exports = route