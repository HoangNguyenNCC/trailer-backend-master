function embeddedParser(inputObj, keys) {
    console.log("keys", keys);
    try {
        let outputObj = {...inputObj };
        keys.forEach((key) => {
            const keyComp = key.split(".");
            if ((keyComp.length === 1) && outputObj[key]) {
                outputObj[key] = updateObjProp(outputObj, key);
            } else if (outputObj[keyComp[0]]) {
                outputObj[key] = updateObjProp(outputObj, key);
            }
        });
        return outputObj;
    } catch (err) {
        return false;
    }
}

function updateObjProp(obj, propPath) {
    const [head, ...rest] = propPath.split('.');

    if (typeof obj[head] === "string") {
        obj[head] = JSON.parse(obj[head]);
    }

    if (rest.length === 0) {
        return obj[head];
    } else {
        updateObjProp(obj[head], rest.join("."));
    }
}

module.exports = embeddedParser;