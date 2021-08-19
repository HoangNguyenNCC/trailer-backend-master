process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';


const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;


const app = require('../../app');


const User = require('../../app/models/users');
const Rating = require('../../app/models/trailerRatings');


const signupData = require('../testData/signupData');
const ratingData = require('../testData/ratingData');


describe('Trailer Ratings', () => {

    beforeEach((done) => {
        User.remove({}, (err) => {
            Rating.remove({}, (err) => {
                done();
            });
        });
    });

    after((done) => {
        User.remove({}, (err) => {
            Rating.remove({}, (err) => {
                done();
            });
        });
    });

    describe('POST /rating ', () => {

        it('it should return 200 response with ratings data', (done) => {

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

                                chai
                                    .request(app)
                                    .post('/rating')
                                    .set('Cookie', userCookie)
                                    .send(ratingData.VALID_RATING)
                                    .end((err, res) => {
                                        if (err) {
                                            console.log("Error", err);
                                        }
                                        // console.log("Response", res.body);

                                        res.should.have.status(200);
                                        done();
                                    });
                            });
                    });
                });
        });

    });

});