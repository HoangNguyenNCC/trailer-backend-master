//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';


const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);


const app = require('../../app');


const User = require('../../app/models/users');
const Trailer = require('../../app/models/trailers');
const UpsellItem = require('../../app/models/upsellItems');
const Commission = require('../../app/models/commissions');
const Discount = require('../../app/models/discounts');
const Invoice = require('../../app/models/invoices');
const Licensee = require('../../app/models/licensees');
const Employee = require('../../app/models/employees');


const signupData = require('../testData/signupData');
const trailerData = require('../testData/trailerData');
const upsellItemData = require('../testData/upsellItemData');
const licenseeData = require('../testData/licenseeData');
const commissionData = require('../testData/commissionData');
const discountData = require('../testData/discountData');
const invoicesData = require('../testData/invoicesData');
const employeeData = require('../testData/employeesData');


let trailerDataObj = {};

describe('Trailers', () => {

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
                UpsellItem.remove({}, (err) => {
                    Licensee.remove({}, (err) => {
                        Employee.remove({}, (err) => {
                            Invoice.remove({}, (err) => {
                                done();
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
                UpsellItem.remove({}, (err) => {
                    Licensee.remove({}, (err) => {
                        Employee.remove({}, (err) => {
                            Invoice.remove({}, (err) => {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('GET /user/reminders ', () => {

        it('it should return 200 status code with array of reminders', (done) => {

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

                                                            const signin_obj = {
                                                                "email": signupData.SIGNUP_SUCCESS.email,
                                                                "password": signupData.SIGNUP_SUCCESS.password
                                                            };

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

                                                                    const userCookie = res.headers['set-cookie'][0];

                                                                    const userObj = res.body.dataObj.userObj;

                                                                    // ------------------------------------------------------------

                                                                    // trailerDataObj.bookedByUserId = userObj._id;

                                                                    // console.log("trailerDataObj", trailerDataObj);

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

                                                                            //----------------------------------------------------------

                                                                            const upsellItemObj = {
                                                                                ...upsellItemData.VALID_UPSELL_ITEM,
                                                                                trailerId: trailerObj._id.toString(),
                                                                                bookedByUserId: trailerDataObj.bookedByUserId
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
                                                                                    // console.log("POST /upsellitem Response", res.body);

                                                                                    res.should.have.status(200);
                                                                                    res.body.should.have.property('upsellItemObj');

                                                                                    const upsellItemObj = res.body.upsellItemObj;

                                                                                    //---------------------------------------------------------

                                                                                    invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                                                    invoicesData.ONLY_RENTAL.rentedItems[0].itemId = trailerObj._id;
                                                                                    invoicesData.ONLY_RENTAL.rentedItems[1] = {
                                                                                        itemType: "upsellitem",
                                                                                        itemId: upsellItemObj._id
                                                                                    };
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
                                                                                            // console.log("POST /rental Response", res.body);

                                                                                            res.should.have.status(200);
                                                                                            res.body.should.have.property('invoiceObj');


                                                                                            invoicesData.ONLY_RENTAL.rentedItems.pop();

                                                                                            //---------------------------------------------------------

                                                                                            chai
                                                                                                .request(app)
                                                                                                .get('/user/reminders')
                                                                                                .set('Cookie', userCookie)
                                                                                                .send()
                                                                                                .end((err, res) => {
                                                                                                    if (err) {
                                                                                                        console.log('Error', err)
                                                                                                    }
                                                                                                    // console.log("Response", res.body);

                                                                                                    res.should.have.status(200);
                                                                                                    res.body.should.have.property('remindersList');
                                                                                                    // res.body.should.have.property('remindersList').not.to.be.empty;
                                                                                                    res.body.should.have.property('remindersList').to.be.empty;

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