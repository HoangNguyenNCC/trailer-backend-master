const yup = require('yup');

let personSchema = yup.object().shape({
    email : yup.string().email(),
    mobile : yup.number().test('len', 'Must be exactly 8 characters', val => val && val.toString().length === 8 )
})

let customerSearchFilter = yup.object().shape({
    emailVerified : yup.bool(), 
    mobileVerified : yup.bool(),
    dlVerified : yup.bool(),
    state : yup.string(),
    email : yup.string().email(),
    mobile : yup.number().test('len', 'Must be exactly 8 characters', val => val && val.toString().length === 8 )
})

let licenseeFilter = yup.object().shape({
    emailVerified : yup.bool().required(), 
    mobileVerified : yup.bool().required(),
    businessType : yup.string().required(),
    state : yup.string().required(),
    proofOfIncorporationVerified : yup.bool().required(),
    acl : yup.object().required()
})

let licenseeTrailerFilter = yup.object().shape({
    isFeatured : yup.bool(),
    availability : yup.bool(),
    type : yup.string(),
    trailerModel : yup.number().positive()
})

const validatePersonSchema = async function(query){
    let mobile ;
    query.mobile?(mobile = query.mobile):(mobile = false)
    let email;
    query.email?(email = query.email):(email = false)

    if(mobile){
        try{
            await personSchema.validate({mobile})
        }catch(err){
            throw new Error('VALIDATION - Mobile is Invalid')
        }
    }else{
        try{
            await personSchema.validate({email})
        }catch(err){
            throw new Error('VALIDATION - Email Id is Invalid')
        }
    }

}

const validateCustomerSearchFilter = async function(query){
    try{
        await customerSearchFilter.validate(query)
    }catch(err){
        console.log(err)
        throw new Error('VALIDATION - Invalid Request Body')
    }
}

const validateLicenseeFilter = async function(query){
    try{
        await licenseeFilter.validate(query)
    }catch(err){
        throw new Error('VALIDATION - Invalid Request Body')
    }
}

const validateLicenseeTrailerFilter = async function(query){
    try{
        await licenseeTrailerFilter.validate(query)
    }catch(err){
        throw new Error('VALIDATION - Invalid Request Body')
    }
}

module.exports = {
    validatePersonSchema,
    validateCustomerSearchFilter,
    validateLicenseeFilter,
    validateLicenseeTrailerFilter
};