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
const Licensee = require('../../app/models/licensees');
const Employee = require('../../app/models/employees');


const signupData = require('../testData/signupData');
const invoicesData = require('../testData/invoicesData');
const trailerData = require('../testData/trailerData');
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

    after((done) => {
        User.remove({}, (err) => {
            Trailer.remove({}, (err) => {
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

    describe('POST /rental/approval ', () => {

        it('it should return 200 response with Rental Request Approval - Approved', (done) => {

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
                                                        res.body.should.have.property('success').eq(true);
                                                        res.body.should.have.property('dataObj');
                                                        res.body.dataObj.should.have.property('userObj');
                                                        res.body.dataObj.should.have.property('token');
                                                        expect(res).to.have.cookie('User-Access-Token');


                                                        const userObj = res.body.dataObj.userObj;

                                                        const userCookie = res.headers['set-cookie'][0];

                                                        //----------------------------------------------------------

                                                        // invoicesData.ONLY_RENTAL.rentedItemId = trailerObj._id;
                                                        invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                        invoicesData.ONLY_RENTAL.rentedItems[0].itemId =  trailerObj._id;
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

                                                                const rentalObj = res.body.invoiceObj;

                                                                let revisionObj = rentalObj.revisions.find((revision, revisionIndex) => {
                                                                    if(revision.revisionType === "rental") {
                                                                        return true;
                                                                    }
                                                                });
                                                                const rentalApprovalObj = {
                                                                    rentalId: rentalObj._id.toString(),
                                                                    revisionId: revisionObj._id.toString(),
                                                                    requestType: "rental",
                                                                    approvalStatus: "approved"
                                                                };

                                                                chai
                                                                    .request(app)
                                                                    .post('/rental/approval')
                                                                    .set('Cookie', licenseeCookie)
                                                                    .send(rentalApprovalObj)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            console.log("Error", err);
                                                                        }
                                                                        // console.log("Response", res.body);

                                                                        res.should.have.status(200);
                                                                        res.body.should.have.property('success').eq(true);

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

        it('it should return 200 response with Rental Extension Request Approval - Approved', (done) => {

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
                                                        res.body.should.have.property('success').eq(true);
                                                        res.body.should.have.property('dataObj');
                                                        res.body.dataObj.should.have.property('userObj');
                                                        res.body.dataObj.should.have.property('token');
                                                        expect(res).to.have.cookie('User-Access-Token');


                                                        const userObj = res.body.dataObj.userObj;

                                                        const userCookie = res.headers['set-cookie'][0];

                                                        //----------------------------------------------------------

                                                        invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                        invoicesData.ONLY_RENTAL.rentedItems[0].itemId =  trailerObj._id;
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

                                                                let rentalObj = res.body.invoiceObj;

                                                                let revisionObj = rentalObj.revisions.find((revision, revisionIndex) => {
                                                                    if(revision.revisionType === "rental") {
                                                                        return true;
                                                                    }
                                                                });
                                                                let rentalApprovalObj = {
                                                                    rentalId: rentalObj._id.toString(),
                                                                    revisionId: revisionObj._id.toString(),
                                                                    requestType: "rental",
                                                                    approvalStatus: "approved"
                                                                };

                                                                chai
                                                                    .request(app)
                                                                    .post('/rental/approval')
                                                                    .set('Cookie', licenseeCookie)
                                                                    .send(rentalApprovalObj)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            console.log("Error", err);
                                                                        }
                                                                        // console.log("Response", res.body);

                                                                        res.should.have.status(200);
                                                                        res.body.should.have.property('success').eq(true);
                                                                                                                                               

                                                                        //----------------------------------------------------------

                                                                        const extensionObj = {
                                                                            rentalId: rentalObj._id,
                                                                            extendTill: moment(moment(rentalObj.rentalPeriod.end).valueOf() + 32400000).format("DD MMM, YYYY hh:mm A")
                                                                        };

                                                                        chai
                                                                            .request(app)
                                                                            .post('/rental/extend')
                                                                            .set('Cookie', userCookie)
                                                                            .send(extensionObj)
                                                                            .end((err, res) => {
                                                                                if (err) {
                                                                                    console.log("Error", err);
                                                                                }
                                                                                // console.log("Response", res.body);

                                                                                res.should.have.status(200);
                                                                                res.body.should.have.property('success');
                                                                                res.body.should.have.property('rentalId');
                                                                                res.body.should.have.property('rentalObj');
                                                                                res.body.should.have.property('extensionObject');

                                                                                rentalObj = res.body.rentalObj;

                                                                                //----------------------------------------------------------
                                                                            
                                                                                revisionObj = rentalObj.revisions.find((revision, revisionIndex) => {
                                                                                    if(revision.revisionType === "extension" && revision.isApproved === 0) {
                                                                                        return true;
                                                                                    }
                                                                                });

                                                                                rentalApprovalObj = {
                                                                                    rentalId: rentalObj._id.toString(),
                                                                                    revisionId: revisionObj._id.toString(),
                                                                                    requestType: "extension",
                                                                                    approvalStatus: "approved"
                                                                                };

                                                                                chai
                                                                                    .request(app)
                                                                                    .post('/rental/approval')
                                                                                    .set('Cookie', licenseeCookie)
                                                                                    .send(rentalApprovalObj)
                                                                                    .end((err, res) => {
                                                                                        if (err) {
                                                                                            console.log("Error", err);
                                                                                        }
                                                                                        // console.log("Response", res.body);

                                                                                        res.should.have.status(200);
                                                                                        res.body.should.have.property('success').eq(true);

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
        
        it('it should return 200 response with Rental Reschedule Request Approval - Approved', (done) => {

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
                                                        res.body.should.have.property('success').eq(true);
                                                        res.body.should.have.property('dataObj');
                                                        res.body.dataObj.should.have.property('userObj');
                                                        res.body.dataObj.should.have.property('token');
                                                        expect(res).to.have.cookie('User-Access-Token');


                                                        const userObj = res.body.dataObj.userObj;

                                                        const userCookie = res.headers['set-cookie'][0];

                                                        //----------------------------------------------------------

                                                        invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                        invoicesData.ONLY_RENTAL.rentedItems[0].itemId =  trailerObj._id;
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

                                                                let rentalObj = res.body.invoiceObj;

                                                                let reschedulingObj = {
                                                                    rentalId: rentalObj._id,
                                                                    start: moment().add(7, "days").format("YYYY-MM-DD HH:mm"),
                                                                    end: moment().add(8, "days").format("YYYY-MM-DD HH:mm")
                                                                };

                                                                chai
                                                                    .request(app)
                                                                    .post('/rental/reschedule')
                                                                    .set('Cookie', userCookie)
                                                                    .send(reschedulingObj)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            console.log("Error", err);
                                                                        }
                                                                        // console.log("Response", res.body);

                                                                        res.should.have.status(200);
                                                                        res.body.should.have.property('success');
                                                                        res.body.should.have.property('rentalObj');
                                                                        res.body.should.have.property('scheduleObject');

                                                                        rentalObj = res.body.rentalObj;

                                                                        //----------------------------------------------------------

                                                                        revisionObj = rentalObj.revisions.find((revision, revisionIndex) => {
                                                                            if(revision.revisionType === "reschedule" && revision.isApproved === 0) {
                                                                                return true;
                                                                            }
                                                                        });

                                                                        const rentalApprovalObj = {
                                                                            rentalId: rentalObj._id.toString(),
                                                                            revisionId: revisionObj._id.toString(),
                                                                            requestType: "reschedule",
                                                                            approvalStatus: "approved"
                                                                        };


                                                                        chai
                                                                            .request(app)
                                                                            .post('/rental/approval')
                                                                            .set('Cookie', licenseeCookie)
                                                                            .send(rentalApprovalObj)
                                                                            .end((err, res) => {
                                                                                if (err) {
                                                                                    console.log("Error", err);
                                                                                }
                                                                                // console.log("Response", res.body);

                                                                                res.should.have.status(200);
                                                                                res.body.should.have.property('success').eq(true);

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

        it('it should return 200 response with Rental Request Approval - Rejected', (done) => {

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
                                                        res.body.should.have.property('success').eq(true);
                                                        res.body.should.have.property('dataObj');
                                                        res.body.dataObj.should.have.property('userObj');
                                                        res.body.dataObj.should.have.property('token');
                                                        expect(res).to.have.cookie('User-Access-Token');


                                                        const userObj = res.body.dataObj.userObj;

                                                        const userCookie = res.headers['set-cookie'][0];

                                                        //----------------------------------------------------------

                                                        // invoicesData.ONLY_RENTAL.rentedItemId = trailerObj._id;
                                                        invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                        invoicesData.ONLY_RENTAL.rentedItems[0].itemId =  trailerObj._id;
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

                                                                const rentalObj = res.body.invoiceObj;

                                                                let revisionObj = rentalObj.revisions.find((revision, revisionIndex) => {
                                                                    if(revision.revisionType === "rental") {
                                                                        return true;
                                                                    }
                                                                });
                                                                const rentalApprovalObj = {
                                                                    rentalId: rentalObj._id.toString(),
                                                                    revisionId: revisionObj._id.toString(),
                                                                    requestType: "rental",
                                                                    approvalStatus: "rejected"
                                                                };

                                                                chai
                                                                    .request(app)
                                                                    .post('/rental/approval')
                                                                    .set('Cookie', licenseeCookie)
                                                                    .send(rentalApprovalObj)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            console.log("Error", err);
                                                                        }
                                                                        // console.log("Response", res.body);

                                                                        res.should.have.status(200);
                                                                        res.body.should.have.property('success').eq(true);

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

        it('it should return 200 response with Rental Extension Request Approval - Rejected', (done) => {

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
                                                        res.body.should.have.property('success').eq(true);
                                                        res.body.should.have.property('dataObj');
                                                        res.body.dataObj.should.have.property('userObj');
                                                        res.body.dataObj.should.have.property('token');
                                                        expect(res).to.have.cookie('User-Access-Token');


                                                        const userObj = res.body.dataObj.userObj;

                                                        const userCookie = res.headers['set-cookie'][0];

                                                        //----------------------------------------------------------

                                                        invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                        invoicesData.ONLY_RENTAL.rentedItems[0].itemId =  trailerObj._id;
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

                                                                let rentalObj = res.body.invoiceObj;

                                                                let revisionObj = rentalObj.revisions.find((revision, revisionIndex) => {
                                                                    if(revision.revisionType === "rental") {
                                                                        return true;
                                                                    }
                                                                });
                                                                let rentalApprovalObj = {
                                                                    rentalId: rentalObj._id.toString(),
                                                                    revisionId: revisionObj._id.toString(),
                                                                    requestType: "rental",
                                                                    approvalStatus: "approved"
                                                                };

                                                                chai
                                                                    .request(app)
                                                                    .post('/rental/approval')
                                                                    .set('Cookie', licenseeCookie)
                                                                    .send(rentalApprovalObj)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            console.log("Error", err);
                                                                        }
                                                                        // console.log("Response", res.body);

                                                                        res.should.have.status(200);
                                                                        res.body.should.have.property('success').eq(true);
                                                                                                                                               

                                                                        //----------------------------------------------------------

                                                                        const extensionObj = {
                                                                            rentalId: rentalObj._id,
                                                                            extendTill: moment(moment(rentalObj.rentalPeriod.end).valueOf() + 32400000).format("DD MMM, YYYY hh:mm A")
                                                                        };

                                                                        chai
                                                                            .request(app)
                                                                            .post('/rental/extend')
                                                                            .set('Cookie', userCookie)
                                                                            .send(extensionObj)
                                                                            .end((err, res) => {
                                                                                if (err) {
                                                                                    console.log("Error", err);
                                                                                }
                                                                                // console.log("Response", res.body);

                                                                                res.should.have.status(200);
                                                                                res.body.should.have.property('success');
                                                                                res.body.should.have.property('rentalId');
                                                                                res.body.should.have.property('rentalObj');
                                                                                res.body.should.have.property('extensionObject');

                                                                                rentalObj = res.body.rentalObj;

                                                                                //----------------------------------------------------------
                                                                            
                                                                                revisionObj = rentalObj.revisions.find((revision, revisionIndex) => {
                                                                                    if(revision.revisionType === "extension" && revision.isApproved === 0) {
                                                                                        return true;
                                                                                    }
                                                                                });

                                                                                rentalApprovalObj = {
                                                                                    rentalId: rentalObj._id.toString(),
                                                                                    revisionId: revisionObj._id.toString(),
                                                                                    requestType: "extension",
                                                                                    approvalStatus: "rejected"
                                                                                };

                                                                                chai
                                                                                    .request(app)
                                                                                    .post('/rental/approval')
                                                                                    .set('Cookie', licenseeCookie)
                                                                                    .send(rentalApprovalObj)
                                                                                    .end((err, res) => {
                                                                                        if (err) {
                                                                                            console.log("Error", err);
                                                                                        }
                                                                                        // console.log("Response", res.body);

                                                                                        res.should.have.status(200);
                                                                                        res.body.should.have.property('success').eq(true);

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

        it('it should return 200 response with Rental Reschedule Request Approval - Rejected', (done) => {

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
                                                        res.body.should.have.property('success').eq(true);
                                                        res.body.should.have.property('dataObj');
                                                        res.body.dataObj.should.have.property('userObj');
                                                        res.body.dataObj.should.have.property('token');
                                                        expect(res).to.have.cookie('User-Access-Token');


                                                        const userObj = res.body.dataObj.userObj;

                                                        const userCookie = res.headers['set-cookie'][0];

                                                        //----------------------------------------------------------

                                                        invoicesData.ONLY_RENTAL.licenseeId = licenseeObj._id;
                                                        invoicesData.ONLY_RENTAL.rentedItems[0].itemId =  trailerObj._id;
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

                                                                let rentalObj = res.body.invoiceObj;

                                                                let reschedulingObj = {
                                                                    rentalId: rentalObj._id,
                                                                    start: moment().add(7, "days").format("YYYY-MM-DD HH:mm"),
                                                                    end: moment().add(8, "days").format("YYYY-MM-DD HH:mm")
                                                                };

                                                                chai
                                                                    .request(app)
                                                                    .post('/rental/reschedule')
                                                                    .set('Cookie', userCookie)
                                                                    .send(reschedulingObj)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            console.log("Error", err);
                                                                        }
                                                                        // console.log("Response", res.body);

                                                                        res.should.have.status(200);
                                                                        res.body.should.have.property('success');
                                                                        res.body.should.have.property('rentalObj');
                                                                        res.body.should.have.property('scheduleObject');

                                                                        rentalObj = res.body.rentalObj;

                                                                        //----------------------------------------------------------

                                                                        revisionObj = rentalObj.revisions.find((revision, revisionIndex) => {
                                                                            if(revision.revisionType === "reschedule" && revision.isApproved === 0) {
                                                                                return true;
                                                                            }
                                                                        });

                                                                        const rentalApprovalObj = {
                                                                            rentalId: rentalObj._id.toString(),
                                                                            revisionId: revisionObj._id.toString(),
                                                                            requestType: "reschedule",
                                                                            approvalStatus: "rejected"
                                                                        };


                                                                        chai
                                                                            .request(app)
                                                                            .post('/rental/approval')
                                                                            .set('Cookie', licenseeCookie)
                                                                            .send(rentalApprovalObj)
                                                                            .end((err, res) => {
                                                                                if (err) {
                                                                                    console.log("Error", err);
                                                                                }
                                                                                // console.log("Response", res.body);

                                                                                res.should.have.status(200);
                                                                                res.body.should.have.property('success').eq(true);

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