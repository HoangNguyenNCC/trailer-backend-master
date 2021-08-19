process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'mongodb://localhost:27017/trailer_test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);


const app = require('../../app');

const Licensee = require('../../app/models/licensees');
const Employee = require('../../app/models/employees');

const licenseeData = require('../testData/licenseeData');
const employeeData = require('../testData/employeesData');


describe('Licensees Tests', () => {

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

    describe('PUT /licensee/status ', () => {

        it('it should return 200 response with success message for Licensee Status Change Request', (done) => {

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
                    res.body.should.have.property('licenseeObj');

                    const licenseeObj = res.body.licenseeObj;
                
                    // -----------------------------------------------------------

                    const licenseeStatusUpdateObj = {
                        licenseeId: licenseeObj._id.toString(),
                        availability: false
                    };

                    chai
                        .request(app)
                        .put('/licensee/status')
                        .send(licenseeStatusUpdateObj)
                        .end((err, res) => {
                            if (err) {
                                console.log("Error", err);
                            }
                            // console.log("Licensee Response", res.body);

                            res.should.have.status(200);
                            res.body.should.have.property('success').eq(true);

                            done();
                        });
                });
        
        });

    });

});