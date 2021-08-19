//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/upsellitem_test';

const User = require('../../app/models/users');
const Trailer = require('../../app/models/trailers');
const UpsellItem = require('../../app/models/upsellItems');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../../app');

const signupData = require('../testData/signupData');
const trailerData = require('../testData/trailerData');
const upsellItemData = require('../testData/upsellItemData');

chai.use(chaiHttp);


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
                    done();
                });
            });
        });
    });

    after((done) => {
        User.remove({}, (err) => {
            Trailer.remove({}, (err) => {
                UpsellItem.remove({}, (err) => {
                    done();
                });
            });
        });
    });

    describe('GET /upsellitem ', () => {

        it('it should send failure response with "Upsell Item ID is undefined" error', (done) => {

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

                            const getRoute = `/upsellitem`

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
                                    res.should.not.have.status(200);
                                    res.body.should.have.property('errorsList').includes('Upsell Item ID is undefined');
                                    done();
                                });
                            });
                    });
        });

        it('it should send failure response with "Upsell Item ID is undefined" error', (done) => {

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


                            const getRoute = `/upsellitem?id=`

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
                                    res.should.not.have.status(200);
                                    res.body.should.have.property('errorsList').includes('Upsell Item ID is undefined');
                                    done();
                                });
                });
            });
        });

        it('it should send failure response with "Upsell Item is not found" error', (done) => {
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

                            const getRoute = `/upsellitem?id=5e41314d603c2159b3e45678`

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
                                    res.should.not.have.status(200);
                                    res.body.should.have.property('errorsList').includes('Upsell Item is not found');
                                    done();
                                });
                        });
                });

        });


    });

});