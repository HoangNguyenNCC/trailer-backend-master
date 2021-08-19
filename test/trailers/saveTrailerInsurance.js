process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';


const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../app');


const Trailer = require('../../app/models/trailers');
const TrailerInsurance = require('../../app/models/trailerInsurance');
const Licensee = require('../../app/models/licensees');
const Employee = require('../../app/models/employees');


const trailerData = require('../testData/trailerData');
const trailerInsuranceData = require('../testData/trailerInsuranceData');
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
        Trailer.remove({}, (err) => {
            TrailerInsurance.remove({}, (err) => {
                Licensee.remove({}, (err) => {
                    Employee.remove({}, (err) => {
                        done();
                    });
                });
            });
        });
    });

    after((done) => {
        Trailer.remove({}, (err) => {
            TrailerInsurance.remove({}, (err) => {
                Licensee.remove({}, (err) => {
                    Employee.remove({}, (err) => {
                        done();
                    });
                });
            });
        });
    });

    describe('POST /insurance ', () => {

        it('it should return 200 response with Trailer Insurance data', (done) => {

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
                                    res.body.should.have.property('trailerObj');

                                    const trailerObj = res.body.trailerObj;

                                    //---------------------------------------------------------

                                    const insuranceObj = trailerInsuranceData.VALID_TRAILER_INSURANCE;
                                    insuranceObj.itemId = trailerObj._id.toString();

                                    // console.log("insuranceObj", insuranceObj)


                                    chai
                                        .request(app)
                                        .post('/insurance')
                                        .set('Cookie', licenseeCookie)
                                        .field('reqBody', JSON.stringify(insuranceObj))
                                        .attach('insuranceDocument', '/home/nimap/Downloads/automobile-insurance.jpg', 'automobile-insurance.jpg')
                                        .end((err, res) => {
                                            if (err) {
                                                console.log('Error', err)
                                            }
                                            // console.log("Response", res.body);

                                            res.should.have.status(200);
                                            res.body.should.have.property('insuranceObj');

                                            done();
                                        });

                                });
                        });
                });

        });

    });

});