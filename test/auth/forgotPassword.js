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

    describe('PUT /forgotpassword ', () => {

        it('it should send failure response with "User with Email is not found" error', (done) => {

            const forgotpassword_obj = {
                "email": "user1@gmail.com"
            };

            chai
                .request(app)
                .put('/forgotpassword')
                .send(forgotpassword_obj)
                .end((err, res) => {
                    if (err) {
                        console.log('Error', err)
                    }
                    console.log("Response", res.body);
                    res.should.have.not.status(200);
                    res.body.should.have.property('errorsList').includes('User with Email is not found');
                    done();
                });
        });


    });

});