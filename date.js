// 1. module.exports.getDate = getDate;
module.exports.getDate = function(){
    let today = new Date();
    
    let options = {
        weekday: "long",
        day: "numeric",
        month:"long",
        //year: "numeric"
    }
    return today.toLocaleDateString("en-US",options);
}

exports.getDay = function (){
    let today = new Date();
    
    let options = {
        weekday: "long",
    }
    return today.toLocaleDateString("en-US",options);
}
