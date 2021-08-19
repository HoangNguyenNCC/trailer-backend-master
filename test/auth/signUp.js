//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';

const mongoose = require('mongoose');
const User = require('../../app/models/users');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const app = require('../../app');
const signupData = require('../testData/signupData');

chai.use(chaiHttp);


//Our parent block
describe('Users', () => {

    //Before each test we empty the database
    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    after((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    /*
     * Test the POST /signup route
     */
    describe('POST /signup ', () => {

        it('it should send success response', (done) => {

            User.find().then((users) => {
                console.log(users);
            });

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
                    done();
                });
        });

        it('it should send failure response with "Email is empty" error', (done) => {

            const signup_obj = signupData.EMAIL_UNDEFINED;

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
                    res.should.not.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('errorsList').includes('Email is empty');
                    done();
                });
        });

        it('it should send failure response with "Email is in Invalid format" error', (done) => {

            const signup_obj = signupData.EMAIL_INVALID;

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
                    res.should.not.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('errorsList').includes('Email is in Invalid format');
                    done();
                });
        });


        it('it should send failure response with "Mobile Number is empty" error', (done) => {

            const signup_obj = signupData.MOBILE_UNDEFINED;

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
                    res.should.not.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('errorsList').includes('Mobile Number is empty');
                    done();
                });
        });

        it('it should send failure response with "Mobile Number is in Invalid Format" error', (done) => {

            const signup_obj = signupData.MOBILE_INVALID;

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
                    res.should.not.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('errorsList').includes('Mobile Number is in Invalid Format');
                    done();
                });
        });


        it('it should send failure response with "Name is empty" error', (done) => {

            const signup_obj = signupData.NAME_UNDEFINED;

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
                    res.should.not.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('errorsList').includes('Name is empty');
                    done();
                });
        });

        it('it should send failure response with "Address is required" error', (done) => {

            const signup_obj = signupData.ADDRESS_UNDEFINED;

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
                    res.should.not.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    // res.body.should.have.property('message').includes('Address is required');
                    // res.body.should.have.property('errorsList').includes('Error occurred while parsing SignUp data');
                    done();
                });
        });
/* 
        it('it should send success response when address is a string', (done) => {

            const signup_obj = signupData.ADDRESS_STRING;

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

                    done();
                });
        });

        it('it should send failure response with "`point` is not a valid enum value for path `type`." error', (done) => {

            const signup_obj = signupData.ADDRESS_LOCATION_INVALID;

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
                    // res.body.should.have.property('errorsList').to.match(/(?:`point` is not a valid enum value for path `type`)/);
                    done();
                });
        });
 */
        it('it should send failure response with "Date of Birth is required" error', (done) => {

            const signup_obj = signupData.DOB_UNDEFINED;

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
                    res.should.not.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('errorsList').includes('Date of Birth is required');
                    done();
                });
        });

        it('it should send failure response with "Driving License is required" error', (done) => {

            const signup_obj = signupData.LICENSE_UNDEFINED;

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
                    res.should.not.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('errorsList').includes('Driving License is required');
                    done();
                });
        });


        it('it should send failure response with "Account with Email already exists" error', (done) => {

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
                            res.should.not.have.status(200);
                            res.body.should.have.property('success').eq(false);
                            res.body.should.have.property('errorsList').includes('Account with Email already exists');
                            done();
                        });
                });
        });


    });
});