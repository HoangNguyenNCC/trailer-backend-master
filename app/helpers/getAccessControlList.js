const accessControlListApps = {
    "EMPLOYEES": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "TRAILER": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "UPSELL": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "INSURANCE": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "SERVICING": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "REMINDERS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "FINANCIALS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "DOCUMENTS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "RENTALSTATUS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "BLOCK": ["ADD", "VIEW", "UPDATE", "DELETE"]
};


// {"EMPLOYEES":["ADD","VIEW","UPDATE","DELETE"],"TRAILER":["ADD","VIEW","UPDATE","DELETE"],"UPSELL":["ADD","VIEW","UPDATE","DELETE"],"INSURANCE":["ADD", "VIEW", "UPDATE", "DELETE"],"SERVICING":["ADD", "VIEW", "UPDATE", "DELETE"],"REMINDERS":["ADD", "VIEW", "UPDATE", "DELETE"],"FINANCIALS":["ADD", "VIEW", "UPDATE", "DELETE"],"DOCUMENTS":["ADD", "VIEW", "UPDATE", "DELETE"],"RENTALSTATUS":["ADD", "VIEW", "UPDATE", "DELETE"],"BLOCK": ["ADD", "VIEW", "UPDATE", "DELETE"]}

function validateACL(acl, resource, permission) {
    if(acl && acl[resource]) {
        let condition = false;
        if(typeof permission === "string") {
            condition = acl[resource].includes(permission);
        } else if(typeof permission === "object" && permission.length > 0) {
            const commonPermissions = acl[resource].filter(key => permission.includes(key));
            condition = (commonPermissions.length === permission.length);
        }
        return condition;
    }
    return false;
}

module.exports = {
    accessControlListApps: accessControlListApps,
    validateACL: validateACL
};