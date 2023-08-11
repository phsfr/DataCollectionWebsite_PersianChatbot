import React, {useEffect, useState} from "react";
import {Form, Input, Button} from "semantic-ui-react";
import {gql, useQuery} from "@apollo/client";
import client from "../../ApolloProvider";
import "./Chat.css";
import { openSuccessSnack, openErrorSnack } from "../../components/SnackBar";
import path from 'path';
import {check} from '../chat/CheckProfileItem';

const __dirname = path.resolve();

const REGISTER_PROFILE = gql`
  mutation PostReceiverProfile($chatId: String!, $profilePoint:Int!, $age:Int, $job:String, $spouseJob: String, $fatherJob: String, $motherJob: String, $name:String!
    $gender:Boolean, $noSiblings:Int, $noSisters:Int, $noBrothers:Int, $noChildren:Int, $noGirls:Int, $noBoys:Int, $mariageStatus:String,
    $hobby:String, $favBook:String, $favFilm:String, $favDish:String, $resistance:String){
    postReceiverProfile(chatId: $chatId, profilePoint: $profilePoint, age:$age, job:$job, spouseJob: $spouseJob, fatherJob:$fatherJob, motherJob: $motherJob, name:$name
        gender:$gender, noSiblings:$noSiblings, noSisters:$noSisters, noBrothers:$noBrothers, noChildren:$noChildren, noGirls:$noGirls, noBoys:$noBoys
        , mariageStatus:$mariageStatus, hobby: $hobby, favBook: $favBook, favFilm:$favFilm, favDish:$favDish, resistance:$resistance) 
  }
`;

const GET_PROFILEPOINTS = gql`
  query GetProfilePoint($messageColl_id:ID!){
    getProfilePoint(messageColl_id: $messageColl_id)
  }
`;

const openSnackAsync = async (text) => {
    openSuccessSnack(text);
};
const openSnackError = async (text) =>{
    openErrorSnack(text);
};

function removeSpace(inpTxt) {
    const str = inpTxt.split('');
    str.forEach((item, index) => {
     const charCode = item.charCodeAt(0);
     if (charCode === 32 || charCode === 8204) {
       str[index] = '';
     }
    });
    inpTxt = str.join('');
    return inpTxt;
}

function evaluateProfile(predict, real){
    var points = 0
    if(removeSpace(predict.name) == removeSpace(real.name)) points+=1
    if(predict.age && real.age && predict.age==real.age) points+=1
    if(("gender" in predict) && real.gender!=null && predict.gender==real.gender) points+=1
    if(predict.mariageStatus && real.mariageStatus && predict.mariageStatus.trim()==real.mariageStatus.trim()) points+=1
    if(predict.noChilren && real.noChilren && predict.noChilren==real.noChilren) points+=1
    if(predict.noBoys && real.noBoys && predict.noBoys==real.noBoys) points+=1
    if(predict.noGirls && real.noGirls && predict.noGirls==real.noGirls) points+=1
    if(predict.noSiblings && real.noSiblings && predict.noSiblings==real.noSiblings) points+=1
    if(predict.noSisters && real.noSisters && predict.noSisters==real.noSisters) points+=1
    if(predict.noBrothers && real.noBrothers && predict.noBrothers==real.noBrothers) points+=1
    // if(predict.favBook && real.favBook && removeSpace(predict.favBook.replace('کتاب',''))==removeSpace(real.favBook)) points+=1
    // if(predict.favFilm && real.favFilm && removeSpace(predict.favFilm.replace('فیلم',''))==removeSpace(real.favFilm)) points+=1
    // if(predict.favDish && real.favDish && removeSpace(predict.favDish.replace('غذای',''))==removeSpace(real.favDish)) points+=1
  
    if(predict.job && real.job) {const res=check(real.job, predict.job,'job'); points+=res; }
    // if(predict.spouseJob && real.spouseJob) {const res=check(real.spouseJob, predict.spouseJob,'job'); points+=res;}
    // if(predict.fatherJob && real.fatherJob) {const res=check(real.fatherJob, predict.fatherJob,'job'); points+=res;}
    // if(predict.motherJob && real.motherJob) {const res=check(real.motherJob, predict.motherJob,'job'); points+=res;}
    if(predict.hobby && real.hobby) {const res=check(real.hobby, predict.hobby,'hobby'); points+=res;}
    if(predict.resistance && real.resistance) {const res=check(real.resistance, predict.resistance,'resistance'); points+=res;}//&& removeSpace(predict.resistance)==removeSpace(real.resistance)) points+=1
    return points
}

function ProfileEditer({chatId, predictProfile, receiverProfile}) {
    const maxProfileScore = (receiverProfile.mariageStatus && receiverProfile.mariageStatus=="married"? 13:11)
    const [profilePoint, setprofilePoint] = React.useState(0);
    const pointQuery = useQuery(GET_PROFILEPOINTS, {variables:{messageColl_id: chatId},
      onCompleted: (data) => {
        setprofilePoint(data.getProfilePoint);
      },
      fetchPolicy: "no-cache",
    });

    const [state, setState] = useState({name: '', jobs: [], counts: [], gender:'', mariageStatus: '', favs: [], age:0, resistance: ''});
    const initValues_name = (predictProfile!=null && predictProfile!=false ? predictProfile.name: "")
    const initAge = (predictProfile!=null && predictProfile!=false && predictProfile.age!=null ? predictProfile.age: "")
    const initResist = (predictProfile!=null && predictProfile!=false && predictProfile.resistance!=null ? predictProfile.resistance: "")
    var initValues_gender = "" 
    if(predictProfile!=null && predictProfile!=false){ 
    if(predictProfile.gender==true) {
    initValues_gender="ma"
    }else if(predictProfile.gender==false){
    initValues_gender="fe"
    }
    }
    const initMarigage = (predictProfile!=null && predictProfile!=false && predictProfile.mariageStatus!=null ? predictProfile.mariageStatus: "")
    const initJobs = []
    if(predictProfile!=null && predictProfile.job!=null){ initJobs.push({jobPerson:"job", jobTitle:predictProfile.job}) };
    // if(predictProfile!=null && predictProfile.spouseJob!=null){ initJobs.push({jobPerson:"spouseJob", jobTitle:predictProfile.spouseJob}) };
    // if(predictProfile!=null && predictProfile.fatherJob!=null){ initJobs.push({jobPerson:"fatherJob", jobTitle:predictProfile.fatherJob}) };
    // if(predictProfile!=null && predictProfile.motherJob!=null){ initJobs.push({jobPerson:"motherJob", jobTitle:predictProfile.motherJob}) };
    const initCount = []
    if(predictProfile!=null && predictProfile.noChilren!=null){ initCount.push({countPerson:"noChilren", countVal:predictProfile.noChilren}) };
    if(predictProfile!=null && predictProfile.noGirls!=null){ initCount.push({countPerson:"noGirls", countVal:predictProfile.noGirls}) };
    if(predictProfile!=null && predictProfile.noBoys!=null){ initCount.push({countPerson:"noBoys", countVal:predictProfile.noBoys}) };
    if(predictProfile!=null && predictProfile.noSiblings!=null){ initCount.push({countPerson:"noSiblings", countVal:predictProfile.noSiblings}) };
    if(predictProfile!=null && predictProfile.noSisters!=null){ initCount.push({countPerson:"noSisters", countVal:predictProfile.noSisters}) };
    if(predictProfile!=null && predictProfile.noBrothers!=null){ initCount.push({countPerson:"noBrothers", countVal:predictProfile.noBrothers}) };
    const initFavs = []
    if(predictProfile!=null && predictProfile.hobby!=null){ initFavs.push({favType:"hobby", favVal:predictProfile.hobby}) };
    // if(predictProfile!=null && predictProfile.favBook!=null){ initFavs.push({favType:"favBook", favVal:predictProfile.favBook}) };
    // if(predictProfile!=null && predictProfile.favFilm!=null){ initFavs.push({favType:"favFilm", favVal:predictProfile.favFilm}) };
    // if(predictProfile!=null && predictProfile.favDish!=null){ initFavs.push({favType:"favDish", favVal:predictProfile.favDish}) };
    const [initState, setInitState]=useState({name: initValues_name, jobs: [...initJobs], counts: [...initCount], gender:initValues_gender
                , mariageStatus: initMarigage, favs: [...initFavs], age:initAge, resistance: initResist})

  useEffect(()=>{
      setState(initState)
    }
  ,[initState]);

  let [jobButAbility, setJobBut]= useState(false)
  let [countButAbility, setCountBut]= useState(false)
  let [favButAbility, setFavBut]= useState(false)

  const addJob = (e) =>{
    if(state.jobs.length<1){
    setState((prevState) =>({...prevState,
            jobs: [...prevState.jobs, {jobPerson:"", jobTitle:""}],
      }));
    }else{
        setJobBut(true)
        openSnackError('امکان افزودن عنوان شغلی بیشتر نیست.')
    }
  }
  const addCount = (e) =>{
    if(state.counts.length<6){
        setState((prevState) =>({...prevState,
                counts: [...prevState.counts, {countPerson:"", countVal:""}],
            }));
    }else{
        setCountBut(true)
        openSnackError('امکان افزودن اطلاعات تعداد افراد بیشتر نیست.')
    }
}
const addFav = (e) =>{
    if(state.favs.length<1){
        setState((prevState) =>({
                ...prevState,
                favs:[...prevState.favs, {favType:"", favVal:""}]
            }));
    }else{
        setFavBut(true)
        openSnackError('امکان افزودن اطلاعات علاقه‌مندی بیشتر نیست.')
    }
}
  const handleSelectChange = (e, data) =>{
    if(data.name.startsWith('job')){
        let jobs = [...state.jobs]
        jobs[data["data-id"]]["jobPerson"] = data.value
        setState((prevState) => ({...prevState, jobs}))
    }
    if(data.name.startsWith('count')){
        let counts = [...state.counts]
        counts[data["data-id"]]["countPerson"] = data.value
        setState((prevState) => ({...prevState, counts}))
    }
    if(data.name=="mariageSelect"){
        setState((prevState) => ({...prevState, mariageStatus: data.value}))
    }
    if(data.name.startsWith('fav')){
        let favs = [...state.favs]
        favs[data["data-id"]]["favType"] = data.value
        setState((prevState) => ({...prevState, favs}))
    }
  }
  const handleChange = (e) =>{
      if(["jobTitle"].includes(e.target.classList[0])){
          let jobs = [...state.jobs]
          let counts = [...state.counts]
          let favs = [...state.favs]
          jobs[e.target.dataset.id][e.target.classList[0]] = e.target.value
          setState({jobs, name:state.name, counts, gender:state.gender, mariageStatus: state.mariageStatus, favs,
             age:state.age, resistance: state.resistance})
      }else if(["countVal"].includes(e.target.classList[0])){
        let jobs = [...state.jobs]
        let counts = [...state.counts]
        let favs = [...state.favs]
        counts[e.target.dataset.id][e.target.classList[0]] = e.target.value
        setState({jobs, name:state.name, counts, gender:state.gender, mariageStatus: state.mariageStatus, favs,
            age:state.age, resistance: state.resistance})
      }else if(["favVal"].includes(e.target.classList[0])){
        let jobs = [...state.jobs]
        let counts = [...state.counts]
        let favs = [...state.favs]
        favs[e.target.dataset.id][e.target.classList[0]] = e.target.value
        setState({jobs, name:state.name, counts, gender:state.gender, mariageStatus: state.mariageStatus, favs,
            age:state.age, resistance: state.resistance})
      }else{
          setState({...state,[e.target.name]: e.target.value})
      }
  }
  const myHandleSubmit = async(e) => {
    if(e.nativeEvent.submitter.name=="addJobs" || e.nativeEvent.submitter.name=="addCounts" || e.nativeEvent.submitter.name=="addFavs")
    {
        e.preventDefault()
    }else{
        let mutate_variables = {chatId: chatId, name: state.name, profilePoint:0}
        for (let jobItm of state.jobs) {
            if(jobItm.jobTitle.trim()!=""){mutate_variables[jobItm.jobPerson]=jobItm.jobTitle}
        }
        for (let countItm of state.counts) {
            if(countItm.countVal!=""){mutate_variables[countItm.countPerson]=Number(countItm.countVal)}
        }
        for (let favItm of state.favs) {
            if(favItm.favVal.trim()!=""){mutate_variables[favItm.favType]=favItm.favVal}
        }
        if(state.gender!=null && ["fe", "ma"].includes(state.gender)){
            if(state.gender==="ma"){mutate_variables["gender"]=true}
            if(state.gender==="fe"){mutate_variables["gender"]=false}
        }
        if(state.mariageStatus!=null && (state.mariageStatus=="single" || state.mariageStatus=="married")){mutate_variables["mariageStatus"]=state.mariageStatus}
        if(state.age!=null && state.age!=0 && state.age!=""){mutate_variables["age"]=Number(state.age)}
        if(state.resistance!=null && state.resistance.trim()!=""){mutate_variables["resistance"]=state.resistance}
        const points = evaluateProfile(mutate_variables, receiverProfile)
        mutate_variables["profilePoint"] = points
        await client.mutate({
            variables: mutate_variables,
            mutation: REGISTER_PROFILE,
        });
        var submitMess = "حدس شما از پروفایل مخاطب با موفقیت ثبت شد."
        if(Object.keys(mutate_variables).length==3 && mutate_variables["name"].trim()==""){
            submitMess = 'تو که حدسی نزدی 😐'
        }else if(points>profilePoint) {
            var diff = points - profilePoint
            if(points==maxProfileScore){
                submitMess ='!گل کاشتی 🤩 همه رو درست گفتی'    
            }else if(points>8){submitMess ='ایول خیلی خوب پیش رفتی 😄' }
            else if(points>4){submitMess ='آفرین کارت خیلی خوب بود 😃' }
            else{submitMess ='امتیازت بهتر شد. کارت خوبه 🙂' }   
        }else if(points<profilePoint) {submitMess ='حدست بدتر شد! بیخیال دوباره سعی کن 😬' }
        else if(points==profilePoint) {submitMess ='امتیازت فرقی نکرد 😜' }
        setprofilePoint(points);
        
        openSnackAsync(submitMess);
    }
}
const addButtonStyle={display:"block", margin:"auto", backgroundColor:"#c6e8a6", marginBottom:"5px"}
const jobPersonOptions = [
    { key: 'job', value: 'job', text: 'خود فرد' },
    // { key: 'spouseJob', value: 'spouseJob', text: 'همسر' },
    // { key: 'motherJob', value: 'motherJob', text: 'مادر' },
    // { key: 'fatherJob', value: 'fatherJob', text: 'پدر' },
    ]
const countPersonOptions = [
    { key: 'noSiblings', value: 'noSiblings', text: 'تعداد خواهربرادران' },
    { key: 'noSisters', value: 'noSisters', text: 'تعداد خواهران' },
    { key: 'noBrothers', value: 'noBrothers', text: 'تعداد برادران' },
    { key: 'noChilren', value: 'noChilren', text: 'تعداد فرزندان' },
    { key: 'noGirls', value: 'noGirls', text: 'تعداد فرزند دختر' },
    { key: 'noBoys', value: 'noBoys', text: 'تعداد فرزند پسر' },
    ]
const mariageOptions = [
    { key: 'single', value: 'single', text: 'مجرد' },
    { key: 'married', value: 'married', text: 'متاهل' },
    { key: 'notknow', value: 'notknow', text: 'نمی‌دانم' },
    ]
const favOptions = [
    { key: 'hobby', value: 'hobby', text: 'علاقه‌مندی کلی' },
    // { key: 'favBook', value: 'favBook', text: 'کتاب موردعلاقه' },
    // { key: 'favDish', value: 'favDish', text: 'غذای موردعلاقه' },
    // { key: 'favFilm', value: 'favFilm', text: 'فیلم موردعلاقه' },
    ]
  return (<div className="profile-receiver">
  <span className="profile-text-title">پروفایل مخاطب</span>
  <Form
    onChange={handleChange}
    onSubmit={myHandleSubmit}
  >
    <Form.Input
      name="name"
      label="نام"
      placeholder="name"
      value={state.name}
      className="form-field"
    />
    <Form.Group inline className="form-field">
        <label>جنسیت:</label>
        <input
        value='ma' 
        name="gender"
        type="radio"
        checked={state.gender==='ma'}
        onChange={handleChange}
        className="genderProfile"
        />
        مرد
        <input
        type="radio"
        value='fe'
        name="gender"
        checked={state.gender==='fe'}
        onChange={handleChange}
        className="genderProfile"
        />
        زن
        <input
        type="radio"
        value='und'
        name="gender"
        checked={state.gender==='und'}
        onChange={handleChange}
        className="genderProfile"
        />
        نامشخص
    </Form.Group>
    <Form.Input
      name="age"
      type="number"
      min="1"
      max="100"
      label="سن: "
      placeholder="age"
      value={state.age}
      className="form-field inline"
    />
    <Form.Select 
        label='وضعیت تاهل:  '
        options={mariageOptions}
        placeholder='انتخاب وضع تاهل'
        name = "mariageSelect"
        id = "mariageSelect"
        className="mariageSelect selectProfile inline"
        value={state.mariageStatus}
        onChange={handleSelectChange}
    />
    <Button name="addJobs" style={addButtonStyle} onClick={addJob} disabled={jobButAbility}>اطلاعات شغل +</Button>
    {
        state.jobs.map((val, idx) => {
            let jobPersId = `job-${idx}`, jobTitId = `jobtit-${idx}`
            return( 
            <div key={idx} className="multiPartProfile-div">
                <Form.Select 
                label='شخص شاغل'
                options={jobPersonOptions}
                placeholder='انتخاب شاغل'
                name = {jobPersId}
                data-id = {idx}
                id = {jobPersId}
                className="jobPerson"
                value={(state.jobs[idx].jobPerson!=""? state.jobs[idx].jobPerson:"")}
                onChange={handleSelectChange}
                >
                </Form.Select>
                <div key={`inside-div-${idx}`}>
                <label className="multiPartProfile-label">عنوان شغل</label> 
                <input
                label="عنوان شغل"
                type="text"
                name = {jobTitId}
                data-id = {idx}
                id = {jobTitId}
                className="jobTitle"
                
                value = {state.jobs[idx].jobTitle}
                />
                </div>
            </div>
            )
        })
    }
    <Button name="addCounts" style={addButtonStyle} onClick={addCount} disabled={countButAbility}>اطلاعات تعداد اعضای خانواده +</Button>
    {
        state.counts.map((val, idx) => {
            let countPersId = `count-${idx}`, countTitId = `counttit-${idx}`
            return( 
            <div key={idx} className="multiPartProfile-div">
                <Form.Select 
                label='عضو خانواده'
                options={countPersonOptions}
                placeholder='انتخاب عضو خانواده'
                name = {countPersId}
                data-id = {idx}
                id = {countPersId}
                className="countPerson"
                value={(state.counts[idx].countPerson!=""? state.counts[idx].countPerson:"")}
                onChange={handleSelectChange}
                >
                </Form.Select>
                <div key={`inside-count-div-${idx}`}>
                <label className="multiPartProfile-label">تعداد</label> 
                <input
                type="number"
                min="0"
                name = {countTitId}
                data-id = {idx}
                id = {countTitId}
                className="countVal"
                value = {state.counts[idx].countVal}
                />
                </div>
            </div>
            )
        })
    }
    <Button name="addFavs" style={addButtonStyle} onClick={addFav} disabled={favButAbility}>اطلاعات علاقه‌مندی +</Button>
    {
        state.favs.map((val, idx) => {
            let favTypeId = `fav-${idx}`, favValId = `favVal-${idx}`
            return( 
            <div key={idx} className="multiPartProfile-div">
                <Form.Select 
                label='نوع علاقه‌مندی'
                options={favOptions}
                placeholder='انتخاب نوع علاقه‌مندی'
                name = {favTypeId}
                data-id = {idx}
                id = {favTypeId}
                className="favType"
                value={(state.favs[idx].favType!=""? state.favs[idx].favType:"")}
                onChange={handleSelectChange}
                >
                </Form.Select>
                <div key={`inside-fav-div-${idx}`}>
                <label className="multiPartProfile-label">آیتم علاقه‌مندی</label> 
                <input
                type="text"
                name = {favValId}
                data-id = {idx}
                id = {favValId}
                className="favVal"
                value = {state.favs[idx].favVal}
                />
                </div>
            </div>
            )
        })
    }
      <Form.Input
          name="resistance"
          label="محل زندگی"
          placeholder="شهر یا استان"
          type="text"
          value={state.resistance}
          className="form-field"
      />
      <Form.Button className="form-field" name="mianSubmit" primary>
      ثبت پروفایل
      </Form.Button>
    </Form>
  </div>);
}

export default ProfileEditer;