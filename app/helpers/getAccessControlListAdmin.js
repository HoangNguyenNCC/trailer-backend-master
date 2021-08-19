/* const accessControlListAdmin = [
    "VIEW_TRAILER",
    "VIEW_UPSELL_ITEM",
    "VIEW_RENTALS",
    "VIEW_RENTAL_REQUESTS",
    "VIEW_ALL_ADMIN_EMPLOYEES",
    "VIEW_INSURANCE",
    "VIEW_SERVICING",
    "VIEW_LICENSEES",
    "VIEW_CUSTOMERS",
    "VIEW_LICENSEE_PAYOUTS",
    "VIEW_CUSTOMER_PAYMENTS",
    "VIEW_FINANCIALS",

    "ADD_TRAILER",
    "ADD_UPSELL_ITEM",
    "ADD_ADMIN_EMPLOYEE",

    "UPDATE_TRAILER",
    "UPDATE_UPSELL_ITEM",
    "UPDATE_ADMIN_EMPLOYEE",
    "UPDATE_ADMIN_EMPLOYEE_PRIVILEGES",
    "UPDATE_INSURANCE",
    "UPDATE_SERVICING",
    "UPDATE_PROOF_OF_INCORPORATION",
    "UPDATE_CUSTOMERS",
    "UPDATE_RENTAL_REQUESTS"
]; */

const accessControlListAdminApps = {
    "ADD": [
        "TRAILER",
        "UPSELL_ITEM",
        "ADMIN_EMPLOYEE"
    ],
    "VIEW": [
        "TRAILER",
        "UPSELL_ITEM",
        "RENTALS",
        "RENTAL_REQUESTS",
        "ALL_ADMIN_EMPLOYEES",
        "INSURANCE",
        "SERVICING",
        "LICENSEES",
        "CUSTOMERS"
    ],
    "UPDATE": [
        "TRAILER",
        "UPSELL_ITEM",
        "ADMIN_EMPLOYEE",
        "ADMIN_EMPLOYEE_PRIVILEGES",
        "INSURANCE",
        "SERVICING",
        "PROOF_OF_INCORPORATION",
        "CUSTOMERS",
        "RENTAL_REQUESTS"
    ],
    "DELETE": []
};

const accessControlListAdmin = {
    "ADMINEMPLOYEE": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "LICENSEE": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "LICENSEEEMPLOYEE": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "TRAILER": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "UPSELL": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "INSURANCE": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "SERVICING": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "REMINDERS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "FINANCIALS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "PAYMENTS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "DOCUMENTS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "RENTALSTATUS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "BLOCK": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "RENTALS": ["ADD", "VIEW", "UPDATE", "DELETE"],
    "CUSTOMERS": ["ADD", "VIEW", "UPDATE", "DELETE"]
};

// {"ADMINEMPLOYEE":["ADD","VIEW","UPDATE","DELETE"],"LICENSEE":["ADD","VIEW","UPDATE","DELETE"],"LICENSEEEMPLOYEE":["ADD","VIEW","UPDATE","DELETE"],"TRAILER":["ADD","VIEW","UPDATE","DELETE"],"UPSELL":["ADD","VIEW","UPDATE","DELETE"],"INSURANCE":["ADD","VIEW","UPDATE","DELETE"],"SERVICING":["ADD","VIEW","UPDATE","DELETE"],"REMINDERS":["ADD","VIEW","UPDATE","DELETE"],"FINANCIALS":["ADD","VIEW","UPDATE","DELETE"],"PAYMENTS": ["ADD", "VIEW", "UPDATE", "DELETE"],"DOCUMENTS":["ADD","VIEW","UPDATE","DELETE"],"RENTALSTATUS":["ADD","VIEW","UPDATE","DELETE"],"BLOCK":["ADD","VIEW","UPDATE","DELETE"],"RENTALS":["ADD","VIEW","UPDATE","DELETE"],"CUSTOMERS":["ADD","VIEW","UPDATE","DELETE"]}



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
    accessControlListAdmin: accessControlListAdmin,
    accessControlListAdminApps: accessControlListAdminApps,
    validateACL: validateACL
};