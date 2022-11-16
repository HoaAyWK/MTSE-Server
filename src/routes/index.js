const freelancerRouter = require('./routers/freelancer')
const accountRouter = require('./routers/account')
const employerRouter = require('./routers/employer')
const packageRouter = require('./routers/package');
const categoryRouter = require('./routers/category');
const skillRouter = require('./routers/skill');
const checkoutRouter = require('./routers/checkout');
const jobRouter = require('./routers/job')
const appliedRouter = require('./routers/applied')
const commentRouter = require('./routers/comment')
const userRouter = require('./routers/user');
const transactionHistoryRouter = require('./routers/transactionHistory');

const route = (app) => {
    app.use('/api/v1/freelancer', freelancerRouter)
    app.use('/api/v1/account', accountRouter)
    app.use('/api/v1/employer', employerRouter)
    app.use('/api/v1/comment', commentRouter)
    app.use('/api/v1/job', jobRouter)
    app.use('/api/v1/applied', appliedRouter)
    app.use('/api/v1/packages', packageRouter);
    app.use('/api/v1/categories', categoryRouter);
    app.use('/api/v1/skills', skillRouter);
    app.use('/api/v1/checkout', checkoutRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/transactions', transactionHistoryRouter);
}

module.exports = route