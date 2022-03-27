module.exports = getDay;

function getDay(){
    var today = new Date();
    var options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    };
    var day = today.toLocaleDateString("en-US",options);
    console.log(day);
    return day;
}