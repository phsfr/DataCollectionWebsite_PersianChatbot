const fsModule = require('fs');
const path = require('path');

function getRandom (filename){
    var allElems =  fsModule.readFileSync(filename, 'utf8', function(error, data) {
        if (error){ console.log(JSON.stringify(error)); }
    })
    var allElemsList = allElems.split(/\r?\n/);
    return allElemsList[Math.floor(Math.random()*allElemsList.length)];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }


function getProfile(){
    const jobList_male_path = path.join(__dirname, '..', 'chat', 'profileLists', 'jobList_male.txt')
    const jobList_female_path = path.join(__dirname, '..', 'chat', 'profileLists', 'jobList_female.txt')
    const hobbyList_male_path = path.join(__dirname, '..', 'chat', 'profileLists', 'hobbiesList_male.txt')
    const hobbyList_female_path = path.join(__dirname, '..', 'chat', 'profileLists', 'hobbiesList_female.txt')
    const resistList_path = path.join(__dirname, '..', 'chat', 'profileLists', 'resistanceList.txt')
    const maleName_path = path.join(__dirname, '..', 'chat', 'profileLists', 'maleNameList.txt')
    const femName_path = path.join(__dirname, '..', 'chat', 'profileLists', 'femaleNameList.txt')
    const favBook_path = path.join(__dirname, '..', 'chat', 'profileLists', 'favBookList.txt')
    const favDish_path = path.join(__dirname, '..', 'chat', 'profileLists', 'favDishList.txt')
    const favFilm_path = path.join(__dirname, '..', 'chat', 'profileLists', 'favFilmList.txt')
    const minAge = 10, maxAge = 65;
    const minSib = 0, maxSib = 7;
    const minKid = 0, maxKid = 6;
    let gender ,name, job, hobby
    if(Math.random() < 0.5){
        gender = false//"female"
        name = getRandom(femName_path)
        job = getRandom(jobList_female_path)
        hobby = getRandom(hobbyList_female_path)
    }else{
        gender = true//'male'
        name = getRandom(maleName_path)
        job = getRandom(jobList_male_path)
        hobby = getRandom(hobbyList_male_path)
    }
    
    var resistance = getRandom(resistList_path)
    var age = getRandomInt(minAge, maxAge)
    var marriageStatus = (Math.random()>0.5? "married":"single")
    if(age<17 && marriageStatus=="married"){marriageStatus="single"}
    if(age<19 && age>8){job="دانش‌آموز"}
    var motherJob = getRandom(jobList_female_path)
    var fatherJob = getRandom(jobList_male_path)

    var favBook = getRandom(favBook_path)
    var favDish = getRandom(favDish_path)
    var favFilm = getRandom(favFilm_path)
    
    var noSiblings = getRandomInt(minSib, maxSib)
    var noBrothers = getRandomInt(0, noSiblings)
    var noSisters = noSiblings - noBrothers

    var noChildren = -1
    var noGirls = -1
    var noBoys = -1

    var spouseJob = ''

    if(marriageStatus=="married"){
        spouseJob = getRandom(jobList_male_path)
        noChildren = getRandomInt(minKid, maxKid)
        noGirls = getRandomInt(0, noChildren)
        noBoys = noChildren - noGirls
    }
    return {'name': name, 'age': age, 'gender': gender, 'job': job, 'spouseJob': spouseJob, 'hobby': hobby, 'resistance': resistance
            ,'motherJob':motherJob, 'fatherJob':fatherJob, 'marriageStatus': marriageStatus, 'noSiblings':noSiblings
            ,'noBothers':noBrothers, 'noSisters':noSisters, 'noChildren': noChildren, 'noBoys': noBoys, 'noGirls': noGirls
            ,'favBook':favBook, 'favDish':favDish, 'favFilm':favFilm };
}


module.exports = {getProfile};