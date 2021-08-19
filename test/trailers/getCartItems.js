//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
chai.use(chaiHttp);
const expect = chai.expect;


const app = require('../../app');

const User = require('../../app/models/users');
const Invoice = require('../../app/models/invoices');
const Trailer = require('../../app/models/trailers');
const Commission = require('../../app/models/commissions');
const Discount = require('../../app/models/discounts');
const Licensee = require('../../app/models/licensees');
const Employee = require('../../app/models/employees');


const signupData = require('../testData/signupData');
const invoicesData = require('../testData/invoicesData');
const trailerData = require('../testData/trailerData');
const commissionData = require('../testData/commissionData');
const discountData = require('../testData/discountData');
const licenseeData = require('../testData/licenseeData');
const employeeData = require('../testData/employeesData');


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
                                    done();
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
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe('GET /rental ', () => {

        it('it should return 200 status code with blank rentalsList array', (done) => {

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
                            res.body.should.have.property('success').eq(true);
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
                                    res.body.should.have.property('success').eq(true);
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
                                            res.body.should.have.property('success').eq(true);
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
                                                    res.body.should.have.property('success').eq(true);
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
                                                            res.body.should.have.property('success').eq(true);

                                                            // ------------------------------------------------------------

                                                            console.log("Finding email record", signup_obj.email);

                                                            User.findOne({}).then((userObject) => {
                                                                // console.log("Updated User", userObject);

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
                                                                        res.body.should.have.property('success').eq(true);
                                                                        res.body.should.have.property('dataObj');
                                                                        res.body.dataObj.should.have.property('userObj');
                                                                        res.body.dataObj.should.have.property('token');
                                                                        expect(res).to.have.cookie('User-Access-Token');


                                                                        const userObj = res.body.dataObj.userObj;

                                                                        const userCookie = res.headers['set-cookie'][0];

                                                                        //----------------------------------------------------------

                                                                        invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                                        invoicesData.ONLY_RENTAL.rentedItems[0].itemId = trailerObj._id;
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
                                                                                res.body.should.have.property('success').eq(true);
                                                                                res.body.should.have.property('invoiceObj');

                                                                                //----------------------------------------------------------
                                                                                
                                                                                const getRoute = `/rentals`

                                                                                chai
                                                                                    .request(app)
                                                                                    .get(getRoute)
                                                                                    .set('Cookie', userCookie)
                                                                                    .send()
                                                                                    .end((err, res) => {
                                                                                        if (err) {
                                                                                            console.log('Error', err)
                                                                                        }
                                                                                        console.log("Response", res.body);
                                                                                        
                                                                                        res.should.have.status(200);
                                                                                        res.body.should.have.property('success').eq(true);
                                                                                        res.body.should.have.property('rentalsList');
                                                                                        // res.body.should.have.property('rentalsList').to.be.empty;
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