//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';


const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);


const app = require('../../app');


const User = require('../../app/models/users');
const Trailer = require('../../app/models/trailers');
const UpsellItem = require('../../app/models/upsellItems');
const Licensee = require('../../app/models/licensees');
const Employee = require('../../app/models/employees');


const signupData = require('../testData/signupData');
const trailerData = require('../testData/trailerData');
const upsellItemData = require('../testData/upsellItemData');
const licenseeData = require('../testData/licenseeData');
const employeeData = require('../testData/employeesData');


let trailerDataObj = {};

describe('Upsell Items', () => {

    before((done) => {
        trailerDataObj = {
            ...trailerData.VALID_TRAILER
        };

        done();
    });

    beforeEach((done) => {
        User.remove({}, (err) => {
            Trailer.remove({}, (err) => {
                UpsellItem.remove({}, (err) => {
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
                UpsellItem.remove({}, (err) => {
                    Licensee.remove({}, (err) => {
                        Employee.remove({}, (err) => {
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('GET /upsellitems ', () => {

        it('it should return 200 status code with array of Upsell Items', (done) => {

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

                            // console.log("Response", res.body);
                            res.should.have.status(200);
                            res.body.should.have.property('success').eq(true);
                            res.body.should.have.property('dataObj');
                            res.body.dataObj.should.have.property('userObj');
                            res.body.dataObj.should.have.property('token');
                            expect(res).to.have.cookie('User-Access-Token');

                            const userCookie = res.headers['set-cookie'][0];

                            // ------------------------------------------------------------

                            chai
                                .request(app)
                                .get(`/upsellitems`)
                                .set('Cookie', userCookie)
                                .send()
                                .end((err, res) => {
                                    if (err) {
                                        console.log('Error', err)
                                    }
                                    // console.log("Response", res.body);
                                    res.should.have.status(200);
                                    res.body.should.have.property('success').eq(true);

                                    res.body.should.have.property('upsellItemsList');
                                    res.body.should.have.property('upsellItemsList').to.be.empty;

                                    done();
                                });
                            });
                    });

        });

        it('it should return 200 status code with array with 1 element of Upsell Items', (done) => {

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
                                            res.body.should.have.property('success').eq(true);

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

                                                            // console.log("Response", res.body);
                                                            res.should.have.status(200);
                                                            res.body.should.have.property('success').eq(true);
                                                            res.body.should.have.property('dataObj');
                                                            res.body.dataObj.should.have.property('userObj');
                                                            res.body.dataObj.should.have.property('token');
                                                            expect(res).to.have.cookie('User-Access-Token');

                                                            const userCookie = res.headers['set-cookie'][0];

                                                            // ------------------------------------------------------------

                                                            const getRoute = `/upsellitems`

                                                            chai
                                                                .request(app)
                                                                .get(getRoute)
                                                                .set('Cookie', userCookie)
                                                                .send()
                                                                .end((err, res) => {
                                                                    if (err) {
                                                                        console.log('Error', err)
                                                                    }
                                                                    // console.log("Response", res.body);
                                                                    res.should.have.status(200);
                                                                    res.body.should.have.property('success').eq(true);
                                                                    res.body.should.have.property('upsellItemsList');
                                                                    res.body.should.have.property('upsellItemsList').not.to.be.empty;

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