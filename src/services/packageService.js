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

    async createPackage(pkg) {
        return await Package.create(pkg);
    }

    async getPackageById(id) {
        return await Package.findById(id);
    }

    async updatePackage(id, updateBody) {
        const pkg = await Package.findById(id).lean();

        if (!pkg) {
            throw new ApiError(404, 'Package not found');
        }

        return await Package.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deletePackage(id) {
        const pkg = await Package.findById(id);

        if (!pkg) {
            throw new ApiError(404, 'Package not found');
        }

        await pkg.remove();
    }
}

module.exports = new PackageService;
