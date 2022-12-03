const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const ApiError = require('../utils/ApiError');
const { packageService } = require('../services');
const transactionHistoryService = require("../services/transactionHistoryService");
const employerService = require('../services/employerService')

class CheckoutController {
    async checkoutWithStripe(req, res, next) {
        try {
            const packageId = req.query.package;
            const pkg = await packageService.getPackageById(packageId); 
            
            if (!pkg) {
                throw new ApiError(400, 'Package not found');
            }

            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                success_url: process.env.PAYMENT_SUCCESS_URL,
                cancel_url: process.env.PAYMENT_CANCEL_URL,
                payment_method_types: ['card'],
                line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: pkg.description
                            },
                            unit_amount: pkg.price * 100,
                        },
                        quantity: 1
                    }
                ],
                metadata: {
                    'user_id': req.userId,
                    'package_id': packageId
                }
            });

            res.status(200).json({
                success: true,
                url: session.url
            })
        } catch (error) {
            next(error);
        }
    }

    async stripeWebhook(req, res, next) {
        try {            
            let event = req.body;

            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (webhookSecret) {
                const signature = req.headers["stripe-signature"];
                try {
                    event = stripe.webhooks.constructEvent(
                        req.body,
                        signature,
                        webhookSecret
                    );
        
                } catch (error) {
                    console.log(`⚠️  Webhook signature verification failed.`, error.message);
                    throw new ApiError(500, error.message);
                }
            }
        
            switch (event.type) {
                case "checkout.session.completed":
                    try{
                        const { user_id, package_id } = event.data.object.metadata;  
                        const employer = await employerService.getEmployerByUserId(user_id)
                        //console.log(employer)
                        if (!employer){
                            console.log("employer bug")
                        }
                        const pkg = await packageService.getPackageById(package_id)   
                        //console.log(pkg)

                        if (!pkg){
                            console.log("package bug")
                        }
                        await employerService.handlePost(employer, true, pkg.canPost)
                        await transactionHistoryService.createTransactionHistory({ user: user_id, package: package_id });
    
                    }
                    catch(error){
                        console.log(error)
                    }
                    
                    break;
                default:
                    //console.log(`Unhandled event type ${event.type}.`);
            }


            res.status(200).json({
                message: 'Receive stripe webhook event'
            })
        } catch (error) {
            next(error);
        }
    }

    async checkoutSuccess(req, res) {
        res.status(200).json({
            success: true,
            message: 'Checkout success'
        });
    }

    async checkoutCancel(req, res) {
        res.status(200).json({
            success: true,
            message: 'Checkout cancel'
        });
    }
}

module.exports = new CheckoutController;