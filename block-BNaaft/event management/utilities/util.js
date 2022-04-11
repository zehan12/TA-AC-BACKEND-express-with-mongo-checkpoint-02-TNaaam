
function unique(arr){
    let final = [];
    let result = Object.values(arr.reduce((acc,cv)=>{
    acc[cv] = cv;
    return acc;
    },{}))
    for ( let res in result ){
        final.push(result[res]);
    }
    return final;
}

exports.unique = unique;