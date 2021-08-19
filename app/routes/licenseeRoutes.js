const express = require("express");
const router = express.Router();

const {
    licenseeTrailerController,
    licenseeUserController
} = require('./../controllers');

const authMiddleware = require('../middlewares/authenticateLicensee');
const uploadSetup = require('../helpers/uploadSetup');

const postLicenseeMW = uploadSetup.fields([{ name: 'licenseeLogo', maxCount: 1 }, { name: 'licenseeProofOfIncorporation', maxCount: 1 }, { name: 'employeePhoto', maxCount: 1 }, { name: 'employeeDriverLicenseScan', maxCount: 1 }, { name: 'employeeAdditionalDocumentScan', maxCount: 1 }]);
const putLicenseeMW = uploadSetup.fields([{ name: 'licenseeLogo', maxCount: 1 }, { name: 'licenseeProofOfIncorporation', maxCount: 1 }]);
const postEmployeeMW = uploadSetup.fields([{ name: 'employeePhoto', maxCount: 1 }, { name: 'employeeDriverLicenseScan', maxCount: 1 }, { name: 'employeeAdditionalDocumentScan', maxCount: 1 }]);
const putEmployeeMW = uploadSetup.fields([{ name: 'employeePhoto', maxCount: 1 }, { name: 'employeeDriverLicenseScan', maxCount: 1 }, { name: 'employeeAdditionalDocumentScan', maxCount: 1 }]);
const postTrailerMW = uploadSetup.fields([{ name: 'photos', maxCount: 2 }, { name: 'insuranceDocument', maxCount: 1 }, { name: 'servicingDocument', maxCount: 1 }]);
const postUpsellItemMW = uploadSetup.fields([{ name: 'photos', maxCount: 2 }]);
const postServicingMW = uploadSetup.fields([{ name: 'servicingDocument', maxCount: 1 }]);
const postInsuranceMW = uploadSetup.fields([{ name: 'insuranceDocument', maxCount: 1 }]);
const postRentalStatusMW = uploadSetup.fields([{ name: 'driverLicenseScan', maxCount: 1 }]);
const postRentalLocationTrackMW = uploadSetup.fields([{ name: 'driverLicenseScan', maxCount: 1 }]);

// ======== START - LICENSEE RELATED ROUTES ========== //

router.get('/licensee/employee/acl', licenseeUserController.getAccessControlList);

router.post('/licensee', postLicenseeMW, licenseeUserController.saveLicensee);

router.put('/licensee', authMiddleware, putLicenseeMW, licenseeUserController.updateLicensee);

router.post('/licensee/email/verify/resend', licenseeUserController.sendEmailVerification);

router.get('/licensee/email/verify', licenseeUserController.verifyEmail);

router.post('/licensee/otp/resend', licenseeUserController.sendOTPVerification);

router.post('/licensee/otp/verify', licenseeUserController.verifyOTP);

router.put('/licensee/status', licenseeUserController.setLicenseeStatus);

router.get('/licensee/state', authMiddleware, licenseeUserController.getLicenseeState);

// ======== END - LICENSEE RELATED ROUTES ========== //

// ======== START - LICENSEE EMPLOYEE RELATED ROUTES ========== //

router.get('/employee/email/verify', licenseeUserController.verifyEmailEmployee);

router.post('/employee/signin', licenseeUserController.signIn);

router.post('/employee/invite', authMiddleware, licenseeUserController.inviteEmployee);

router.post('/employee/invite/accept', postEmployeeMW, licenseeUserController.saveEmployee);

router.get('/employees', authMiddleware, licenseeUserController.getEmployees);

router.get('/employee/profile', authMiddleware, licenseeUserController.getEmployee);

router.delete('/employee', authMiddleware, licenseeUserController.deleteEmployee); 

router.put('/employee/profile', authMiddleware, putEmployeeMW, licenseeUserController.updateEmployee); 

router.get('/employee/profile/licensee', authMiddleware, licenseeUserController.getLicensee);

router.put('/employee/password/change', authMiddleware, licenseeUserController.changePassword);

router.put('/employee/forgotpassword', licenseeUserController.forgotPassword);

router.put('/employee/resetpassword', licenseeUserController.resetPassword);

// ======== END - LICENSEE EMPLOYEE RELATED ROUTES ========== //

// ======== START - LICENSEE STRIPE RELATED ROUTES ========== //

router.get('/stripe/details', authMiddleware, licenseeUserController.getStripeDetails);

router.post('/stripe/account', authMiddleware, licenseeUserController.createStripeAccount);

// ======== END - LICENSEE STRIPE RELATED ROUTES ========== //

// ======== START - LICENSEE TRAILERS RELATED ROUTES ========== //

router.get('/licensee/trailers', authMiddleware, licenseeTrailerController.getTrailers);

router.get('/licensee/trailer', authMiddleware, licenseeTrailerController.getTrailerDetails);

router.get('/licensee/trailers/admin', authMiddleware, licenseeTrailerController.getAdminTrailers);

router.get('/servicing', authMiddleware, licenseeTrailerController.getTrailerServicing);

router.get('/insurance', authMiddleware, licenseeTrailerController.getTrailerInsurance);

router.post('/trailer/block', authMiddleware, licenseeTrailerController.saveTrailerBlocking);

router.post('/trailer', authMiddleware, postTrailerMW, licenseeTrailerController.saveTrailer); 

router.post('/servicing', authMiddleware, postServicingMW, licenseeTrailerController.saveTrailerServicing);

router.post('/insurance', authMiddleware, postInsuranceMW, licenseeTrailerController.saveTrailerInsurance);

router.delete('/trailer', authMiddleware, licenseeTrailerController.deleteTrailer);

router.post('/user/rating', authMiddleware, licenseeTrailerController.setUserProfileRating);

// ======== END - LICENSEE TRAILER RELATED ROUTES ========== //

// ======== START - LICENSEE UPSELLITEM RELATED ROUTES ========== //

router.get('/licensee/upsellitems', authMiddleware, licenseeTrailerController.getUpsellItems);

router.get('/licensee/upsellitem', authMiddleware, licenseeTrailerController.getUpsellItemDetails);

router.get('/licensee/upsellitems/admin', authMiddleware, licenseeTrailerController.getAdminUpsellItems);

router.post('/upsellitem', authMiddleware, postUpsellItemMW, licenseeTrailerController.saveUpsellItem);

router.delete('/upsellitem', authMiddleware, licenseeTrailerController.deleteUpsellItem);

// ======== END - LICENSEE UPSELLITEM RELATED ROUTES ========== //

// ======== START - LICENSEE RENTAL RELATED ROUTES ========== //
router.post('/discount', licenseeTrailerController.saveDiscount);

router.post('/rental/approval', authMiddleware, licenseeTrailerController.manageRentalApproval);

router.post('/rental/status', authMiddleware, postRentalStatusMW, licenseeTrailerController.manageRentalStatus);

router.get('/rental/requests', authMiddleware, licenseeTrailerController.getRentalRequests);

router.get('/rental/details', authMiddleware, licenseeTrailerController.getRentalDetails);

router.get('/rentals/list', authMiddleware, licenseeTrailerController.getRentalsList);

router.post('/rental/location/track', authMiddleware, postRentalLocationTrackMW, licenseeTrailerController.saveRentalItemLocationStartTracking);

router.post('/rental/location', authMiddleware, licenseeTrailerController.saveRentalItemLocation);

router.get('/rental/locations', authMiddleware, licenseeTrailerController.getRentalItemLocation);

router.get('/reminders', authMiddleware, licenseeTrailerController.getReminders);

router.get('/licensee/financial', authMiddleware, licenseeTrailerController.getFinancials);

router.get('/licensee/docs', authMiddleware, licenseeTrailerController.getDocumentsList);

// ======== END - LICENSEE RENTAL RELATED ROUTES ========== //

module.exports = router