const freelancerRouter = require('./routers/freelancer')
const accountRouter = require('./routers/account')
const employerRouter = require('./routers/employer')
const packageRouter = require('./routers/package');
const categoryRouter = require('./routers/category');
const skillRouter = require('./routers/skill');

const route = (app) => {
    app.use('/api/v1/freelancer', freelancerRouter)
    app.use('/api/v1/account', accountRouter)
    app.use('/api/v1/employer', employerRouter)
    app.use('/api/v1/packages', packageRouter);
    app.use('/api/v1/categories', categoryRouter);
    app.use('/api/v1/skills', skillRouter);
}

module.exports = route