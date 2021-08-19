

const employees_data = {
    "VALID_OWNER": {
        "name": "Neha Kadam",
        "mobile": "9664815262",
        "country": "india",
        "email": "neha1@licenseetrailers.com",
        "password": "aBcd@1234",
        "title": "Owner",
        "dob": "1970-05-15",
        "driverLicense": {
	        "card": "223782weyet",
	        "expiry": "06/23",
	        "state": "NSW",
            "verified": true,
            "accepted": true
        },
        "address": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "coordinates": [-33.8132, 151.2172],
            "city": "Sydney",
            "state": "NSW",
            "country": "Australia"
        }
    },
    "EMPLOYEE_VIEW": {
        "name": "Employee 1",
        "acl": {
            "TRAILER": ["VIEW"],
            "UPSELL": ["VIEW"]
        },
        "mobile": "9876543210",
        "country": "india",
        "isMobileVerified": true,
        "email": "employee1@trailerslicensee.com",
        "password": "aBcd@1234",
        "title": "Manager",
        "dob": "1970-05-15",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "address": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "coordinates": [-33.8132, 151.2172],
            "city": "Sydney",
            "state": "NSW",
            "country": "Australia"
        }
    }
};

module.exports = employees_data;