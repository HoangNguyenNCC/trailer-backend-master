const Finance = require('../models/financials');

const getFinanceStats = async function(object){
    try{
        const id = object.id;
        const userType = object.userType;
        let financeRecord;
        if(userType == 'licensee'){
            financeRecord = await Finance.find({licenseeId:id}).lean()
        }
        else{
            financeRecord = await Finance.find({customerId:id}).lean()
        }
        if(!financeRecord){
            throw new Error('No Finance Records Found with the provided details')
        }
        return financeRecord
    }catch(err){
        console.log(err)
    }
}

module.exports = getFinanceStats;