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

chai.use(chaiHttp);


//Our parent block
describe('Users', () => {

    //Before each test we empty the database
    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    describe('PUT /resetpassword ', () => {

        it('it should send failure response with "Invalid Password Reset Token" error', (done) => {

            const resetpassword_obj = {
                "token": "aajsajsd",
                "password": "123456789"
            };

            chai
                .request(app)
                .put('/resetpassword')
                .send(resetpassword_obj)
                .end((err, res) => {
                    if (err) {
                        console.log('Error', err)
                    }
                    console.log("Response", res.status, res.body);
                    res.should.not.have.status(200);
                    res.body.should.have.property('errorsList').includes('Invalid Password Reset Token');
                    done();
                });
        });

        it('it should send failure response with "Invalid Password Reset Token" error', (done) => {

            const resetpassword_obj = {
                "token": "",
                "password": "123456789"
            };

            chai
                .request(app)
                .put('/resetpassword')
                .send(resetpassword_obj)
                .end((err, res) => {
                    if (err) {
                        console.log('Error', err)
                    }
                    // console.log("Response", res.body);
                    res.should.not.have.status(200);
                    res.body.should.have.property('errorsList').includes('Invalid Password Reset Token');
                    done();
                });
        });

    });

});