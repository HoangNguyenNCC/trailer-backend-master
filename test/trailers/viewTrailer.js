process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';


const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../app');


const User = require('../../app/models/users');
const Invoice = require('../../app/models/invoices');
const Trailer = require('../../app/models/trailers');
const Commission = require('../../app/models/commissions');
const Discount = require('../../app/models/discounts');
const Licensee = require('../../app/models/licensees');
const Employee = require('../../app/models/employees');
const TrailerInsurance = require('../../app/models/trailerInsurance');
const TrailerServicing = require('../../app/models/trailerServicing');


const signupData = require('../testData/signupData');
const invoicesData = require('../testData/invoicesData');
const trailerData = require('../testData/trailerData');
const upsellItemData = require('../testData/upsellItemData');
const commissionData = require('../testData/commissionData');
const discountData = require('../testData/discountData');
const licenseeData = require('../testData/licenseeData');
const employeeData = require('../testData/employeesData');
const trailerInsuranceData = require('../testData/trailerInsuranceData');
const trailerServicingData = require('../testData/trailerServicingData');


let trailerDataObj = {};

describe('Trailer Rentals', () => {

    before((done) => {
        trailerDataObj = {
            ...trailerData.VALID_TRAILER
        };

        done();
    });

    //Before each test we empty the database
    beforeEach((done) => {
        User.remove({}, (err) => {
            Trailer.remove({}, (err) => {
                Commission.remove({}, (err) => {
                    Discount.remove({}, (err) => {
                        Invoice.remove({}, (err) => {
                            Licensee.remove({}, (err) => {
                                Employee.remove({}, (err) => {
                                    TrailerInsurance.remove({}, (err) => {
                                        TrailerServicing.remove({}, (err) => {
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    after((done) => {
        User.remove({}, (err) => {
            Trailer.remove({}, (err) => {
                Commission.remove({}, (err) => {
                    Discount.remove({}, (err) => {
                        Invoice.remove({}, (err) => {
                            Licensee.remove({}, (err) => {
                                Employee.remove({}, (err) => {
                                    TrailerInsurance.remove({}, (err) => {
                                        TrailerServicing.remove({}, (err) => {
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe('POST /trailer/view ', () => {

        it('it should return 200 response with trailerObj, upsellItemsList and licenseeObj', (done) => {

            const licenseeReqBodyObj = {
                licensee: licenseeData.VALID_LICENSEE,
                employee: employeeData.VALID_OWNER
            };

            chai
                .request(app)
                .post('/licensee')
                .field('reqBody', JSON.stringify(licenseeReqBodyObj))
                .attach('licenseeLogo', '/home/nimap/Downloads/company_logo.jpeg', 'company_logo.jpeg')
                .attach('licenseeProofOfIncorporation', '/home/nimap/Downloads/proofOfIncorporation.png', 'proofOfIncorporation.png')
                .attach('employeePhoto', '/home/nimap/Downloads/user.png', 'user.png')
                .attach('employeeDriverLicenseScan', '/home/nimap/Downloads/driver_license_sample.jpeg', 'driver_license_sample.jpeg')
                .attach('employeeAdditionalDocumentScan', '/home/nimap/Downloads/Australian_ePassports.jpeg', 'Australian_ePassports.jpeg')
                .end((err, res) => {
                    if (err) {
                        console.log("Error", err);
                    }
                    // console.log("/licensee Response", res.body);

                    res.should.have.status(200);
                    res.body.should.have.property('licenseeObj');

                    const licenseeObj = res.body.licenseeObj;

                    // -----------------------------------------------------------

                    chai
                        .request(app)
                        .post('/employee/signin')
                        .send({
                            email: employeeData.VALID_OWNER.email,
                            password: employeeData.VALID_OWNER.password
                        })
                        .end((err, res) => {
                            if (err) {
                                console.log("Error", err);
                            }
                            // console.log("/employee/signin Response", res.body);

                            res.should.have.status(200);
                            res.body.should.have.property('employeeObj');
                            res.body.should.have.property('token');
                            expect(res).to.have.cookie('Licensee-Access-Token');


                            const employeeObj = res.body.employeeObj;

                            const licenseeCookie = res.headers['set-cookie'][0];

                            //----------------------------------------------------------

                            chai
                                .request(app)
                                .post('/trailer')
                                .set('Cookie', licenseeCookie)
                                .field('reqBody', JSON.stringify(trailerDataObj))
                                .attach('photos', '/home/nimap/Downloads/3500kg_car_trailer.jpg', '3500kg_car_trailer.jpg')
                                .attach('photos', '/home/nimap/Downloads/2000kg_car_trailer.jpg', '2000kg_car_trailer.jpg')
                                .end((err, res) => {
                                    if (err) {
                                        console.log("Error", err);
                                    }
                                    // console.log("POST /trailer Response", res.body);


                                    res.should.have.status(200);
                                    res.body.should.have.property('trailerObj');

                                    const trailerObj = res.body.trailerObj;

                                    //---------------------------------------------------------

                                    const servicingObj = trailerServicingData.VALID_TRAILER_SERVICING;
                                    servicingObj.itemId = trailerObj._id.toString();

                                    // console.log("servicingObj", servicingObj)


                                    chai
                                        .request(app)
                                        .post('/servicing')
                                        .set('Cookie', licenseeCookie)
                                        .field('reqBody', JSON.stringify(servicingObj))
                                        .attach('servicingDocument', '/home/nimap/Downloads/automobile-servicing.jpg', 'automobile-servicing.jpg')
                                        .end((err, res) => {
                                            if (err) {
                                                console.log('Error', err)
                                            }
                                            // console.log("Response", res.body);

                                            res.should.have.status(200);
                                            res.body.should.have.property('servicingObj');

                                            //---------------------------------------------------------

                                            const insuranceObj = trailerInsuranceData.VALID_TRAILER_INSURANCE;
                                            insuranceObj.itemId = trailerObj._id.toString();

                                            // console.log("insuranceObj", insuranceObj)


                                            chai
                                                .request(app)
                                                .post('/insurance')
                                                .set('Cookie', licenseeCookie)
                                                .field('reqBody', JSON.stringify(insuranceObj))
                                                .attach('insuranceDocument', '/home/nimap/Downloads/automobile-insurance.jpg', 'automobile-insurance.jpg')
                                                .end((err, res) => {
                                                    if (err) {
                                                        console.log('Error', err)
                                                    }
                                                    // console.log("Response", res.body);

                                                    res.should.have.status(200);
                                                    res.body.should.have.property('insuranceObj');

                                                    //---------------------------------------------------------

                                                    const commissionObj = commissionData.VALID_COMMISION_FLAT;
                                                    commissionObj.itemId = trailerObj.adminRentalItemId.toString();

                                                    // console.log("commissionObj", commissionObj)

                                                    chai
                                                        .request(app)
                                                        .post('/commission')
                                                        .send(commissionObj)
                                                        .end((err, res) => {
                                                            if (err) {
                                                                console.log('Error', err)
                                                            }
                                                            // console.log("Response", res.body);

                                                            res.should.have.status(200);
                                                            res.body.should.have.property('commissionObj');

                                                            //---------------------------------------------------------

                                                            const discountObj = discountData.VALID_DISCOUNT_FLAT;
                                                            discountObj.itemId = trailerObj.adminRentalItemId.toString();

                                                            // console.log("discountObj", discountObj)


                                                            chai
                                                                .request(app)
                                                                .post('/discount')
                                                                .send(discountObj)
                                                                .end((err, res) => {
                                                                    if (err) {
                                                                        console.log('Error', err)
                                                                    }
                                                                    // console.log("Response", res.body);

                                                                    res.should.have.status(200);
                                                                    res.body.should.have.property('discountObj');


                                                                    //---------------------------------------------------------

                                                                    const upsellItemObj = {
                                                                        ...upsellItemData.VALID_UPSELL_ITEM,
                                                                        trailerId: trailerObj._id.toString()
                                                                    };

                                                                    chai
                                                                        .request(app)
                                                                        .post('/upsellitem')
                                                                        .set('Cookie', licenseeCookie)
                                                                        .field('reqBody', JSON.stringify(upsellItemObj))
                                                                        .attach('photos', '/home/nimap/Downloads/aluminium_folding_ramps.jpg', 'aluminium_folding_ramps.jpg')
                                                                        .end((err, res) => {
                                                                            if (err) {
                                                                                console.log("Error", err);
                                                                            }
                                                                            // console.log("Response", res.body);

                                                                            res.should.have.status(200);
                                                                            
                                                                            const savedUpsellItemId = res.body.upsellItemObj._id;

                                                                            //---------------------------------------------------------

                                                                            const signup_obj = signupData.SIGNUP_SUCCESS;

                                                                            chai
                                                                                .request(app)
                                                                                .post('/signup')
                                                                                .field('reqBody', JSON.stringify(signup_obj))
                                                                                .attach('photo', '/home/nimap/Downloads/user.png', 'user.png')
                                                                                .attach('driverLicenseScan', '/home/nimap/Downloads/driver_license_sample.jpeg', 'driver_license_sample.jpeg')
                                                                                .end((err, res) => {
                                                                                    if (err) {
                                                                                        console.log('Error', err)
                                                                                    }
                                                                                    // console.log("Response", res.body);

                                                                                    res.should.have.status(200);
                                                                                
                                                                                    // ------------------------------------------------------------

                                                                                    console.log("Finding email record", signup_obj.email);

                                                                                    User.findOne({}).then((userObject) => {
                                                                                        console.log("Updated User", userObject);

                                                                                        const signin_obj = {
                                                                                            "email": signupData.SIGNUP_SUCCESS.email,
                                                                                            "password": signupData.SIGNUP_SUCCESS.password
                                                                                        };

                                                                                        // POST /signin
                                                                                        chai
                                                                                            .request(app)
                                                                                            .post('/signin')
                                                                                            .send(signin_obj)
                                                                                            .end((err, res) => {
                                                                                                if (err) {
                                                                                                    console.log('Error', err)
                                                                                                }
                                                                                                // console.log(res);
                                                                                                // console.log("Response", res.body);

                                                                                                res.should.have.status(200);
                                                                                                res.body.should.have.property('dataObj');
                                                                                                res.body.dataObj.should.have.property('userObj');
                                                                                                res.body.dataObj.should.have.property('token');
                                                                                                expect(res).to.have.cookie('User-Access-Token');


                                                                                                const userObj = res.body.dataObj.userObj;

                                                                                                const userCookie = res.headers['set-cookie'][0];

                                                                                                //----------------------------------------------------------

                                                                                                invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                                                                invoicesData.ONLY_RENTAL.rentedItems[0].itemId = trailerObj._id;
                                                                                                invoicesData.ONLY_RENTAL.rentedItems[1] = {
                                                                                                    itemType: "upsellitem",
                                                                                                    itemId: savedUpsellItemId
                                                                                                }
                                                                                                invoicesData.ONLY_RENTAL.bookedByUserId = userObj._id;

                                                                                                chai
                                                                                                    .request(app)
                                                                                                    .post('/invoice')
                                                                                                    .set('Cookie', userCookie)
                                                                                                    .send(invoicesData.ONLY_RENTAL)
                                                                                                    .end((err, res) => {
                                                                                                        if (err) {
                                                                                                            console.log("Error", err);
                                                                                                        }
                                                                                                        // console.log("Response", res.body);

                                                                                                        res.should.have.status(200);
                                                                                                        res.body.should.have.property('invoiceObj');

                                                                                                        //-----------------------------------------------

                                                                                                        invoicesData.ONLY_RENTAL.rentedItems.pop();

                                                                                                        //-----------------------------------------------
                                                                                                        const startDate = moment().add(5, "days").format("DD MMM, YYYY");
                                                                                                        const endDate = moment().add(7, "days").format("DD MMM, YYYY");
                                                                                                        const viewTrailerReq = {
                                                                                                            "id": trailerObj._id,
                                                                                                            "location": licenseeData.VALID_LICENSEE.address.coordinates,
                                                                                                            "dates": [startDate, endDate],
                                                                                                            "times": ["11:00 AM", "12:00 PM"]
                                                                                                        };

                                                                                                        chai
                                                                                                        .request(app)
                                                                                                        .post('/trailer/view')
                                                                                                        .set('Cookie', userCookie)
                                                                                                        .send(viewTrailerReq)
                                                                                                        .end((err, res) => {
                                                                                                            if (err) {
                                                                                                                console.log("Error", err);
                                                                                                            }
                                                                                                            // console.log("Response", res.body);

                                                                                                            res.should.have.status(200);
                                                                                                            res.body.should.have.property('trailerObj');
                                                                                                            res.body.should.have.property('upsellItemsList');
                                                                                                            res.body.should.have.property('licenseeObj');

                                                                                                            //-----------------------------------------------



                                                                                                            done();
                                                                                                        });
                                                                                                    });
                                                                                            });
                                                                                    });
                                                                                });
                                                                        });

                                                                });

                                                        });
                                                });
                                        });

                                });
                        });
                });
        });

    });

});