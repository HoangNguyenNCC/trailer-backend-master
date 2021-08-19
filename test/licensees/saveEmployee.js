process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';

const Licensee = require('../../app/models/licensees');
const Employee = require('../../app/models/employees');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../../app');

const licenseeData = require('../testData/licenseeData');
const employeeData = require('../testData/employeesData');

chai.use(chaiHttp);


describe('Licensee', () => {

    //Before each test we empty the database
    beforeEach((done) => {
        Licensee.remove({}, (err) => {
            Employee.remove({}, (err) => {
                done();
            });
        });
    });

    after((done) => {
        Licensee.remove({}, (err) => {
            Employee.remove({}, (err) => {
                done();
            });
        });
    });

    describe('POST /employee/invite/accept ', () => {

        it('it should return 200 response for Accepting Invitation as an Employee', (done) => {

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
                                .post('/employee/invite')
                                .set('Cookie', licenseeCookie)
                                .send({
                                    email: employeeData.EMPLOYEE_VIEW.email,
                                    acl: employeeData.EMPLOYEE_VIEW.acl
                                })
                                .end((err, res) => {
                                    if (err) {
                                        console.log("Error", err);
                                    }
                                    // console.log("/employee/invite Response", res.body);

                                    res.should.have.status(200);
                                    res.body.should.have.property('success').eq(true);

                                    const inviteToken = res.body.token;

                                    //----------------------------------------------------------

                                    const employeeInviteAcceptObj = {
                                        token: inviteToken,
                                        password: "aBc$5627327",
                                        mobile: employeeData.EMPLOYEE_VIEW.mobile,
                                        country: employeeData.EMPLOYEE_VIEW.country,
                                        name: employeeData.EMPLOYEE_VIEW.name,
                                        driverLicense: employeeData.EMPLOYEE_VIEW.driverLicense,
                                        dob: employeeData.EMPLOYEE_VIEW.dob,
                                    };

                                    chai
                                        .request(app)
                                        .post('/employee/invite/accept')
                                        .field('reqBody', JSON.stringify(employeeInviteAcceptObj))
                                        .attach('employeePhoto', '/home/nimap/Downloads/user.png', 'user.png')
                                        .attach('employeeDriverLicenseScan', '/home/nimap/Downloads/driver_license_sample.jpeg', 'driver_license_sample.jpeg')
                                        .attach('employeeAdditionalDocumentScan', '/home/nimap/Downloads/Australian_ePassports.jpeg', 'Australian_ePassports.jpeg')
                                        .end((err, res) => {
                                            if (err) {
                                                console.log("Error", err);
                                            }
                                            // console.log("/employee/invite/accept Response", res.body);

                                            res.should.have.status(200);
                                            res.body.should.have.property('success').eq(true);

                                            done();
                                        });
                                });
                        });
                });
        });

        it('it should return 200 response for Updating Employee data', (done) => {

            console.log("it should return 200 response for Updating Employee data");

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

                    console.log("Licensee Signup");

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

                            const employeeReqUpdateBodyObj = {
                                name: "Licensee Employee 1"
                            };
                            console.log("employeeReqUpdateBodyObj", employeeReqUpdateBodyObj);
                        
                            chai
                                .request(app)
                                .put('/employee/profile')
                                .set('Cookie', licenseeCookie)
                                .field('reqBody', JSON.stringify(employeeReqUpdateBodyObj))
                                // .attach('licenseeLogo', '/home/nimap/Downloads/company_logo.jpeg', 'company_logo.jpeg')
                                // .attach('licenseeProofOfIncorporation', '/home/nimap/Downloads/proofOfIncorporation.png', 'proofOfIncorporation.png')
                                .attach('employeePhoto', '/home/nimap/Downloads/user.png', 'user.png')
                                // .attach('employeeDriverLicenseScan', '/home/nimap/Downloads/driver_license_sample.jpeg', 'driver_license_sample.jpeg')
                                // .attach('employeeAdditionalDocumentScan', '/home/nimap/Downloads/Australian_ePassports.jpeg', 'Australian_ePassports.jpeg')
                                .end((err, res) => {
                                    if (err) {
                                        console.log("Error", err);
                                    }
                
                                    // console.log("/licensee Response", res.body);
                
                                    res.should.have.status(200);

                                    done();
                                });
                        });
                });
        });

    });

});