const { Package } = require('../models');
const ApiError = require('../utils/ApiError');

class PackageService {
    async getPackages(num) {
        let packages;

        if (num) {
            packages = await Package.find().limit(num);
        } else {
            packages = await Package.find();
        }

        return packages;
    }

    async createPackage(package) {
        return await Package.create(package);
    }

    async getPackageById(id) {
        return await Package.findById(id);
    }

    async updatePackage(id, updateBody) {
        const package = await Package.findById(id).lean();

        if (!package) {
            throw new ApiError(404, 'Package not found');
        }

        return await Package.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deletePackage(id) {
        const package = await Package.findById(id);

        if (!package) {
            throw new ApiError(404, 'Package not found');
        }

        await package.remove();
    }
}

module.exports = new PackageService;
