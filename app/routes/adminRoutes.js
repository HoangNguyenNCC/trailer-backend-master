const express = require("express");
const router = express.Router();

const {
    adminCustomerController,
    adminTrailerController,
    adminLicenseeController,
    adminUserController
} = require('./../controllers');

const authMiddleware = require('../middlewares/authenticateAdmin');
const uploadSetup = require('../helpers/uploadSetup');
const paymentsController = require('../controllers/admin/licensees/paymentsController');

const postCustomerMW = uploadSetup.fields([{ name: 'photo', maxCount: 1 }, { name: 'driverLicenseScan', maxCount: 1 }]);
const postLicenseeMW = uploadSetup.fields([{ name: 'licenseeLogo', maxCount: 1 }, { name: 'licenseeProofOfIncorporation', maxCount: 1 }, { name: 'employeePhoto', maxCount: 1 }, { name: 'employeeDriverLicenseScan', maxCount: 1 }, { name: 'employeeAdditionalDocumentScan', maxCount: 1 }]);
const putLicenseeMW = uploadSetup.fields([{ name: 'licenseeLogo', maxCount: 1 }, { name: 'licenseeProofOfIncorporation', maxCount: 1 }]);
const putEmployeeMW = uploadSetup.fields([{ name: 'employeePhoto', maxCount: 1 }, { name: 'employeeDriverLicenseScan', maxCount: 1 }, { name: 'employeeAdditionalDocumentScan', maxCount: 1 }]);
const postTrailerMW = uploadSetup.fields([{ name: 'photos', maxCount: 2 }, { name: 'insuranceDocument', maxCount: 1 }, { name: 'servicingDocument', maxCount: 1 }]);
const postUpsellItemMW = uploadSetup.fields([{ name: 'photos', maxCount: 2 }]);
const postTrailerMW1 = uploadSetup.fields([{ name: 'photos', maxCount: 2 }, { name: 'rates', maxCount: 1 }]);

// ======== START - ADMIN CUSTOMER RELATED ROUTES ========== //
router.get('/admin/customers', authMiddleware, adminCustomerController.getCustomers);  

router.get('/admin/customer', authMiddleware, adminCustomerController.getCustomer);

router.post('/admin/customer', authMiddleware, postCustomerMW, adminCustomerController.addCustomer);

router.put('/admin/customer', authMiddleware, postCustomerMW, adminCustomerController.updateCustomer);

router.put('/admin/customer/password/change', authMiddleware, adminCustomerController.changePassword);

router.put('/admin/customer/password/forgot', authMiddleware, adminCustomerController.forgotPassword);

router.put('/admin/customer/password/reset', adminCustomerController.forgotPassword);

router.post('/admin/customer/otp/resend', authMiddleware, adminCustomerController.sendOTPVerification);

router.post('/admin/customer/otp/verify', authMiddleware, adminCustomerController.verifyOTP);

router.post('/admin/customer/email/verify/resend', authMiddleware, adminCustomerController.sendEmailVerification);

router.put('/admin/customer/verify/driverlicense', authMiddleware, adminCustomerController.verifyCustomerDriverLicense);

// ======== END - ADMIN CUSTOMER RELATED ROUTES ========== //

//======== START - ADMIN LICENSEE && ADMIN LICENSEE-TRAILER && ADMIN LICENSEE-UPSELLITEMS  RELATED ROUTES ==========//

router.get('/admin/licensees', authMiddleware, adminLicenseeController.getLicensees);

router.post('/admin/licensee', authMiddleware, postLicenseeMW, adminLicenseeController.saveLicensee);

router.put('/admin/licensee', authMiddleware, putLicenseeMW, adminLicenseeController.updateLicensee);

router.get('/admin/licensee', authMiddleware, adminLicenseeController.getLicenseeEmployee);

router.get('/admin/licensee/payouts', authMiddleware, adminTrailerController.getLicenseePayouts);

router.get('/admin/licensee/insurance', authMiddleware, adminLicenseeController.getTrailerInsurance);

router.get('/admin/licensee/servicing', authMiddleware, adminLicenseeController.getTrailerServicing);

router.put('/admin/licensee/verify/proofOfIncorporation', authMiddleware, adminLicenseeController.verifyLicenseeDocument);

router.put('/admin/licensee/verify/insurance', authMiddleware, adminLicenseeController.verifyInsuranceDocument);

router.put('/admin/licensee/verify/servicing', authMiddleware, adminLicenseeController.verifyServicingDocument);

router.get('/admin/licensee/trailer',authMiddleware,adminLicenseeController.getLicenseeTrailer);

router.get('/admin/licensee/upsellitem',authMiddleware,adminLicenseeController.getLicenseeUpsellItem);

router.post('/admin/licensee/trailer/setAvailability',authMiddleware,adminLicenseeController.setTrailerAvailability);

router.post('/admin/licensee/trailer', authMiddleware, postTrailerMW, adminLicenseeController.addLicenseeTrailer);

router.post('/admin/licensee/upsellitem',authMiddleware,postUpsellItemMW,adminLicenseeController.addLicenseeUpsellItem);

router.post('/admin/licensee/upsellitem/setAvailability',authMiddleware,adminLicenseeController.setUpsellItemAvailability);

router.post('/admin/licensee/trailer/delete',authMiddleware,adminLicenseeController.deleteLicenseeTrailer);

router.post('/admin/licensee/upsellitem/delete',authMiddleware,adminLicenseeController.deleteLicenseeUpsellItem);

router.get('/admin/pendingCustomerRefunds', authMiddleware, paymentsController.getPendingCustomerRefunds)

router.post('/admin/refundCustomer', authMiddleware, paymentsController.refundCustomer);

// ======= END - ADMIN LICENSEE && ADMIN LICENSEE-TRAILER && ADMIN LICENSEE-UPSELLITEMS  RELATED ROUTES ========== //

// ======= START - ADMIN LICENSEE EMPLOYEES RELATED ROUTES ========== //

router.post('/admin/licensee/employee/otp/resend',authMiddleware,adminLicenseeController.resendOTP);

router.post('/admin/licensee/employee/otp/verify',authMiddleware,adminLicenseeController.verifyOTP);

router.post('/admin/licensee/employee/email/resend',authMiddleware,adminLicenseeController.resendEmailVerification);

router.post('/admin/licensee/employee/email/forgotpassword',authMiddleware,adminLicenseeController.forgotPasswordMail);

router.post('/admin/licensee/employee/email/resendinvite',authMiddleware,adminLicenseeController.resendInvite);

router.post('/admin/licensee/employee/delete',authMiddleware,adminLicenseeController.deleteLicenseeEmployee);

router.put('/admin/licensee/employee/profile', authMiddleware, putEmployeeMW, adminLicenseeController.updateEmployee);

router.get('/admin/licensee/employees', authMiddleware, adminLicenseeController.getLicenseeEmployees);

router.get('/admin/licensee/employee',authMiddleware,adminLicenseeController.getLicenseeSingleEmployee);

router.post('/admin/inviteLicenseeEmployee', authMiddleware, adminLicenseeController.inviteLicenseeEmployee);

// ======= END - ADMIN LICENSEE RELATED ROUTES ========== //

// ======= START - ADMIN LICENSEE FINANCIAL RELATED ROUTES ========== //

router.post('/admin/licenseePayout', authMiddleware, paymentsController.payoutLicensee);

router.get('/commissions', adminTrailerController.getCommissions);

router.post('/commission', adminTrailerController.saveCommission);

router.get('/admin/rentals', authMiddleware, adminTrailerController.getRentals);

router.put('/admin/rental/approval', authMiddleware, adminTrailerController.manageRentalApproval);

router.get('/admin/financial',authMiddleware , adminTrailerController.getFinancials)

router.get('/admin/financial/trailer', authMiddleware, adminTrailerController.getFinancialsTrailer);

router.get('/admin/financial/licensee', authMiddleware, adminTrailerController.getFinancialsLicensee);

router.get('/admin/rentalitemtypes', authMiddleware, adminTrailerController.getRentalItemTypes);

router.get('/admin/rentalitemtype', authMiddleware, adminTrailerController.getRentalItemType);

router.post('/admin/rentalitemtype', authMiddleware, adminTrailerController.saveRentalItemType);

router.get('/admin/getDeliveredRentals', authMiddleware, adminTrailerController.getAllDeliveredRentals);

// ======= END - ADMIN LICENSEE FINANCIAL RELATED ROUTES ========== //

// ======= START- ADMIN TRAILERS && UPSELLITEMS RELATED ROUTES ========== //

router.get('/admin/trailers', authMiddleware, adminTrailerController.getTrailers);  

router.get('/admin/trailer', authMiddleware, adminTrailerController.getTrailer);  

router.get('/admin/upsellitems', authMiddleware, adminTrailerController.getUpsellItems);

router.get('/admin/upsellitem', authMiddleware, adminTrailerController.getUpsellItem);

router.post('/admin/trailer', authMiddleware, postTrailerMW1, adminTrailerController.saveTrailer); //works with only one image

router.post('/admin/upsellitem', authMiddleware, postTrailerMW1, adminTrailerController.saveUpsellItem);

router.get('/admin/featured', authMiddleware, adminTrailerController.getFeatured);

router.get('/admin/licenseeTrailers', authMiddleware, adminTrailerController.getLicenseeTrailers);

router.get('/admin/licenseeUpsellItems', authMiddleware, adminTrailerController.getLicenseeUpsellItems);

// ======= END- ADMIN TRAILERS && UPSELLITEMS RELATED ROUTES ========== //

// ======= START - ADMIN USERS RELATED ROUTES ========== //

router.get('/admin/employee/acl',  adminUserController.getAccessControlList);  //TODO test this 

router.post('/admin/employee/signin', adminUserController.signIn);  

router.post('/admin/employee/invite', authMiddleware, adminUserController.inviteEmployee); 

router.post('/admin/employee/invite/resend',authMiddleware,adminUserController.resendinvite); 

router.post('/admin/employee/invite/accept', adminUserController.saveEmployee);

router.get('/admin/employees', authMiddleware, adminUserController.getEmployees);

router.get('/admin/employee/profile', authMiddleware, adminUserController.getEmployee);

router.put('/admin/employee/profile', authMiddleware, adminUserController.updateEmployee);

router.put('/admin/employee/profile/admin', authMiddleware, adminUserController.updateEmployeeByAdmin);

router.put('/admin/employee/forgotpassword', adminUserController.forgotPassword); //TODO test this

router.put('/admin/employee/resetpassword', adminUserController.resetPassword);  //TODO test this

router.post('/admin/employee/generateotp', adminUserController.generateOTP);

router.post('/admin/employee/verifyotp', adminUserController.verifyOTP);   //TODO test this

router.post('/admin/employee/resend/email', adminUserController.resendEmailverification)

router.get('/admin/employee/email/verify', adminUserController.verifyEmail)

router.get('/admin/all',authMiddleware,adminUserController.getAllAdmins);
// ======= END - ADMIN USERS RELATED ROUTES ========== //

module.exports = router;