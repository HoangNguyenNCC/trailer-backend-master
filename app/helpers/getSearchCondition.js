const getSearchCondition = async function(query,search,filter){
    try{
        if(!query || Object.keys(query).length == 0){
            return {}
        }
        if (!search || !search.length || !filter || !filter.length){
            return {}
        };
        let filterCondition = {};
        let searchCondition = {}
        search.forEach(condition => {
            if (`${condition.condition}` in query) {
                searchCondition = {[condition.search]: query[condition.condition] }
            }
        });
        filter.forEach(condition => {
            if (`${condition.filter}` in query) {
                if(query[condition.filter] == 'true' || query[condition.filter] == 'false' ){
                    query[condition.filter] = JSON.parse(query[condition.filter].toLowerCase())
                }
                filterCondition[condition.search] = query[condition.filter];
            }
        })
        return {
            ...filterCondition,
            ...searchCondition
        }
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getSearchCondition
}