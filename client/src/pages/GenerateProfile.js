import { readFileSync } from 'fs';

function getRandom(filename){
    var random_elem = "not set"
    var allElems =  readFileSync(filename, 'utf8', function(error, data) {
        if (error){ console.log(JSON.stringify(error)); }
    })
    var allElemsList = allElems.split(/\r?\n/);
    return allElemsList[Math.floor(Math.random()*allElemsList.length)];
}
function getProfile(){
    let gender ,name 
    if(Math.random() < 0.5){
        gender = "female"
        name = getRandom('../profileLists/femaleNameList.txt')
    }else{
        gender = 'male'
        name = getRandom('../profileLists/maleNameList.txt')
    }
    var job = getRandom('../profileLists/jobList.txt')
    var hobby = getRandom('../profileLists/hobbiesList.txt')
    var resistance = getRandom('../profileLists/resistanceList.txt')
    return {'name': name, 'gender': gender, 'job': job, 'hobby': hobby, 'resistance': resistance};
};

