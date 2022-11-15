const categoryService = require('../services/categoryService')
const accountService = require('../services/accountService')
const { calTotalPages } = require('../utils/page')


class CategoryController{
    async createCategory(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            // check admin
            /* const account = await accountService.getAccountByUserId(req.userId)

            if (account == null || account.role != 'Admin'){
                return res.status(400).json({
                    success: false,
                    message: "You are not Admin"
                })
            } */

            const newCategory = await categoryService.createCategory(req.body)

            return res.status(200).json({
                success: true,
                message: "Create Category Successfully",
                category: newCategory
            })

        }
        catch(error){
            console.log(error)
            return res.status(400).json({
                success: false,
                message: "Internal Error Server"
            })
        }
    }

    async getCategories(req, res){
        try{
            var {num, page} = req.query

    
            const categories = await categoryService.getCategories(num, page)
    
            const length = await categoryService.getNumOfCategories()
    
            return res.status(200).json({
                categories,
                length,
                totalPages: calTotalPages(num, length)
            })
        }
        catch(error){
            console.log(error)
            return res.status(400).json({
                message: "Internal Error Server"
            })
        }
    }
}


module.exports = new CategoryController