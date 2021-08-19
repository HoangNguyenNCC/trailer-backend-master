function parseHirePeriod(period) {
    let periodInMS = 1;
    period = period.toLowerCase();

    if(period !== "additional days") {
        const periodComp = period.split(" ");
        const periodUnit = getPeriodUnit(periodComp[1]);
        const periodInt = parseInt(periodComp[0]);
        

        if(periodUnit === "hour") {
            periodInMS = periodInt * 60 * 60 * 1000;
        } else if(periodUnit === "day") {
            periodInMS = periodInt * 24 * 60 * 60 * 1000;
        }
    }

    return periodInMS;
}

function getPeriodUnit(periodUnitIn) {
    let periodUnitOut = "hour";
    switch(periodUnitIn) {
        case "hour":
        case "hours":
            periodUnitOut = "hour";
            break;
        case "day":
        case "days":
            periodUnitOut = "day";
            break;
    }
    return periodUnitOut;
}

function parseCharges(chargeIn) {
    return parseInt(chargeIn.replace("$", ""));
}

function getReadableDuration(durationIn) {
    if(durationIn === 1) {
        return -1;
    } 
    const msHours = 60 * 60 * 1000;
    const durationHours = Math.floor(durationIn / msHours);
    if(durationHours <= 36) {
        return `${durationHours} Hours`;
    }
    const durationDays = Math.floor(durationHours/24);
    return `${durationDays} Days`;
}

function getDurationForCalculation(durationIn) {
    if(durationIn === 1) {
        return -1;
    } 
    const msHours = 60 * 60 * 1000;
    const durationHours = Math.floor(durationIn / msHours);
    return durationHours;
}


module.exports = {
    parseHirePeriod: parseHirePeriod,
    getPeriodUnit: getPeriodUnit,
    parseCharges: parseCharges,
    getReadableDuration: getReadableDuration,
    getDurationForCalculation: getDurationForCalculation
};