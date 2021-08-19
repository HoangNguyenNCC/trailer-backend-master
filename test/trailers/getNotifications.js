//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';


const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;


const app = require('../../app');

const User = require('../../app/models/users');

const signupData = require('../testData/signupData');


describe('Rental Notifications', () => {

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

    describe('GET /rental/notifications ', () => {

        it('it should send success response with notificationsList', (done) => {

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

                                const getRoute = `/rental/notifications`

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
                                        res.body.should.have.property('notificationsList');

                                        done();
                                    });
                            });
                    });
                });

        });

    });

});