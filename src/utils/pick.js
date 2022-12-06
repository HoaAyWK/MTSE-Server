/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
 const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            if (key === 'name') {
                console.log(object[key])
                if (object[key]) {
                    obj[key] = {
                        $regex: object[key],
                        $options: 'i',
                    };
                }
            } else if (key.includes('price')) {
                let priceStr = JSON.stringify(object[key]);
                priceStr = priceStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
                obj[key] = JSON.parse(priceStr);
            } else {
              obj[key] = object[key];
            }
        }
        return obj;
    }, {});
};

module.exports = pick;
