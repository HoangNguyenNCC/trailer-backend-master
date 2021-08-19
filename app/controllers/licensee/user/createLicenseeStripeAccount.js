const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const moment = require('moment');


const createLicenseeStripeAccount = async (licenseeObj, employeeObj, reqIP, test) => {
        const licenseeId = licenseeObj._id;
        const employeeId = employeeObj._id;
    
        const licensee = await Licensee.findById(licenseeId);
        const employee = await Employee.findById(employeeId);
    
        const businessType = 'individual'; // There's unnecessary details
    
        const stripeAccountObj = {
            type: 'custom',
            country: "AU", // we only support AU for now.
            email: licensee.email,
            capabilities: {
              transfers: {
                  requested: true
              },
              card_payments: {
                  requested: true
              }
            },
            business_type: businessType,
            tos_acceptance: {
                date: moment().unix(),
                ip: reqIP
            },
            business_profile: {
                name: licensee.name,
                mcc: licensee.mcc,
                product_description: licensee.productDescription
            },
            default_currency: "AUD", // we only support australia for now.
            external_account: {
                object: 'bank_account',
                country: "AU",
                currency: 'AUD',
                account_number: !test ? licensee.accountNumber : "000123456",
                routing_number: !test ? (licensee.bsbNumber || "110000") : "110000"
            },
            metadata: {
                licenseeId: licenseeId.toString(),
                employeeId: employeeId.toString()
            }
        };
        
        if (businessType === 'individual') {
            const dob = new Date(employee.dob);
            const names = employee.name.split(" ");
            stripeAccountObj.individual = {
                address: {
                    city: employee.address.city,
                    country: "AU",
                    line1: employee.address.text,
                    state: employee.address.state,
                    postal_code: employee.address.pincode
                },
                dob: {
                    day: dob.getDay(),
                    month: dob.getMonth() + 1,
                    year: dob.getFullYear()
                },
                email: employee.email,
                first_name: names[0],
                last_name: names[names.length - 1],
                id_number: employee.driverLicense.card,
                phone: employee.mobile
            }
        } else if (businessType === 'company') {
            stripeAccountObj.company = {
                address: {
                    city: licensee.address.city,
                    country: "AU",
                    line1: licensee.address.text,
                    state: licensee.address.state,
                    postal_code: licensee.address.pincode
                },
                name: licensee.name,
                tax_id: licensee.taxId,
                phone: licensee.mobile
            }
        }

        const account = await stripe.accounts.create(stripeAccountObj);
        console.log({account});
        return account;
};

module.exports = createLicenseeStripeAccount;