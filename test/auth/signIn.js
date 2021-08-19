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

    describe('POST /signin ', () => {

        it('it should send failure response with "Credentials are invalid" error', (done) => {

            const signin_obj = {
                "email": "user1@gmail.com",
                "password": "abcd"
            };

            chai
                .request(app)
                .post('/signin')
                .send(signin_obj)
                .end((err, res) => {
                    if (err) {
                        console.log('Error', err)
                    }
                    console.log("Response", res.status, res.body);
                    res.should.not.have.status(200);
                    res.body.should.have.property('errorsList').includes('Credentials are invalid');
                    done();
                });
        });

        it('it should send success response with user data and token', (done) => {

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
                            done();
                        });
                });
        });

    });

});