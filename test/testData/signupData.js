
const signup_data = {
    "EMAIL_UNDEFINED": {
        "mobile": "919876543210",
        "name": "user 1",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "EMAIL_INVALID": {
        "email": "user1@gmail",
        "mobile": "919876543210",
        "name": "user 1",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "MOBILE_UNDEFINED": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "MOBILE_INVALID": {
        "email": "user1@gmail.com",
        "mobile": "9196",
        "name": "user 1",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "NAME_UNDEFINED": {
        "email": "user1@gmail.com",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "ADDRESS_UNDEFINED": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "ADDRESS_STRING": {
        "email": "user1@gmail.com",
        "mobile": "919876543210",
        "name": "user 1",
        "mobile": "9664815262",
        "address": "Mumbai, India",
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "ADDRESS_LOCATION_INVALID": {
        "email": "user1@gmail.com",
        "mobile": "919876543210",
        "name": "{\"firstName\":\"raj\",\"lastName\":\"raj\"}",
        "address": "{\"text\":\"rrrrr\",\"pincode\":\"400067\",\"location\":\"{\\\"type\\\":\\\"point\\\"}\"}",
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "ADDRESS_BLANK": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "ADDRESS_PINCODE_BLANK": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",

        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "ADDRESS_COORDINATES_BLANK": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "location": { "type": "Point", "coordinates": [] }
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "ADDRESS_COORDINATES_INVALID": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "location": { "type": "Point", "coordinates": [151.2172] }
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "DOB_UNDEFINED": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "DOB_BLANK": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "DOB_INVALID_FORMAT": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "abcd",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "LICENSE_UNDEFINED": {
        "email": "user1@gmail.com",
        "name": "user 1",
        "mobile": "9664815262",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",
        "password": "aBcd@1234",
        "isEmailVerified": true
    },
    "SIGNUP_SUCCESS": {
        "email": "user1@gmail.com",
        "mobile": "919876543210",
        "name": "user 1",
        "address": {
            "country": "India",
            "text": "Mumbai, India",
            "pincode": "1560",
            "coordinates": [19.075984, 72.877656]
        },
        "dob": "1975-01-20",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "MH",
            "verified": true,
            "accepted": true
        },
        "password": "aBcd@1234",
        "isEmailVerified": true
    }
};

module.exports = signup_data;