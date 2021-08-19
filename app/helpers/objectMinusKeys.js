function objectMinusKeys(obj, keys) {
    const objKeys = Object.keys(obj);
    const newObj = {};
    
    objKeys.forEach(key => {
        if(!keys.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}

module.exports = objectMinusKeys;