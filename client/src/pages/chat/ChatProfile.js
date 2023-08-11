import { useMutation, gql } from "@apollo/client";
import { useEffect, useContext } from "react";
import { Form, Message } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import MenuBar from "../../components/MenuBar";
import { AuthContext } from "../../context/auth";
import { useForm } from "../../util/hooks";
import React, { Component } from 'react';

const mariageOptions = [
  { key: 'si', value: 'si', text: 'مجرد' },
  { key: 'ma', value: 'ma', text: 'متاهل' },
  ]

class ChatProfileForm extends Component {
  state = {}

  handleChange = (e, { value }) => this.setState({ value })

  render() {
   const { value } = this.state
   return (
	<>
      <MenuBar />
      <div className="form-container">
        <Form
        >
          <h1 className="page-title">پروفایل شما</h1>
          <Form.Input
            name="username"
            label="نام"
            placeholder="name"
            type="text"
            autoComplete="name"
            className="form-field"
          />
		  <Form.Group inline className="form-field">
				<label>جنسیت
				</label>
				<Form.Radio
				   label='مرد'
                   value='ma' 
				   checked={value === 'ma'}
                   onChange={this.handleChange}
                />
                <Form.Radio
                   label='زن'
                   value='fe'
				   checked={value === 'fe'}
                   onChange={this.handleChange}
                 />
				 
          </Form.Group>
          <Form.Input
            name="email"
            label="سن"
            placeholder="age"
            type="text"
            autoComplete="email"
            className="form-field"
          />
		  <Form.Input
            name="jog"
            label="شغل"
            placeholder="occupation"
            type="text"
            autoComplete="occupation"
            className="form-field"
          />
          <Form.Select 
            label='وضعیت تاهل'
            options={mariageOptions}
            placeholder='وضعیت خود را انتخاب کنید'
			className="form-field"
          />
		  <Form.Input
            name="jog"
            label="شغل همسر"
            placeholder="spouse occupation"
            type="text"
            autoComplete="occupation"
            className="form-field"
          />
		  <Form.Group inline className="form-field">
		  <label>تعداد فرزندان</label>
		  <Form.Input
            name="noGirls"
            label="دختر"
            placeholder=""
            type="text"
            className="form-field"
          />
		  <Form.Input
            name="noBoys"
            label="پسر"
            placeholder=""
            type="text"
            className="form-field"
          />
		  </Form.Group>
		  <Form.Group inline className="form-field">
		  <label>تعداد خواهر و برادران</label>
		  
		  <Form.Input
            name="noSisters"
            placeholder=""
            type="text"
			label='خواهر'
          />
		  
		  <Form.Input
            name="noBrothers"
            placeholder=""
            type="text"
			label='برادر'
          />
		  </Form.Group>
		  <Form.Input
            name="hobbies"
            label="علاقه مندی ها"
            placeholder="خواندن کتاب، گوش کردن به موسیقی و..."
            type="text"
            className="form-field"
          />
		  <Form.Input
            name="resistance"
            label="محل زندگی"
            placeholder="تهران"
            type="text"
            className="form-field"
          />
          <Form.Button className="form-field" primary>
            شروع چت
          </Form.Button>
        </Form>
	  </div>
    </>
	)
  }
}


const REGISTERPROFILE = gql`
  mutation registerProfile($name: String!, $age: Int!, $job: String!, $spouseJob: String!) {
    registerProfile(
      registerProfInput: { name: $name, age: $age, job: $job, spouseJob: $spouseJob}
    ) {
      id
      name
      age
      job
      spouseJob
      createdAt
      updatedAt
    }
  }
`;

function Register() {
  const { onChange, onSubmit, values, setValues, errors, setErrors } = useForm(
    registerHoistedFunction,
    {
      name: "",
      age: 0,
      job: "",
      spouseJob: "",
    }
  );

  let history = useHistory();
  let { user } = useContext(AuthContext);

  const [
    registerProf,
    { loading: registerLoading, data: registerData },
  ] = useMutation(REGISTERPROFILE, {
    variables: {
      name: values.name,
      age: Number(values.age),
      job: values.job,
      spouseJob: values.spouseJob,
    },
    onError(error) {
      console.log(JSON.stringify(error, null, 2))
      console.log(values)
      if (!error.graphQLErrors) return;
    setErrors(error&&error.graphQLErrors[0]?error.graphQLErrors[0].extensions.exception.errors:{});
      setValues({
        name: "",
        age: 0,
        job: "",
        spouseJob: "",
      });
    },
    ignoreResults: false,
    onCompleted: (data) => {
      setErrors({});
      setValues({
        name: "",
        age: 0,
        job: "",
        spouseJob: "",
      });
    },
  });
  

  useEffect(() => {
    let interval = null;
    if (registerData) {
      interval = setInterval(() => {
        const other = history.location.state.otherUser
        history.push("/chat", { otherUser: other });
      }, 3000);
    }
    return () => (interval ? clearInterval(interval) : null);
  }, [history, registerData]);

  function registerHoistedFunction() {
    registerProf();
  }
  return (
    <>
      <MenuBar />
      <div className="form-container">
        <Form
          onSubmit={onSubmit}
          loading={registerLoading}
          success={registerData && Object.keys(registerData).length !== 0}
        >
          <h1 className="page-title">پروفایل شما</h1>
          <Form.Input
            name="name"
            label="نام"
            placeholder="name"
            value={values.name}
            type="text"
            autoComplete="proname"
            onChange={onChange}
            error={
              errors.hasOwnProperty("profilname") && {
                content: errors.profilname,
                pointing: "above",
              }
            }
            className="form-field"
          />
          <Form.Input
            name="age"
            label="سن"
            placeholder="age"
            value={values.age}
            type="number"
            autoComplete="age"
            onChange={onChange}
            className="form-field"
          />
          <Form.Input
            name="job"
            label="شغل"
            placeholder="occupation"
            type="text"
            autoComplete="occupation"
            value={values.job}
            onChange={onChange}
            error={
              errors.hasOwnProperty("profiljob") && {
                content: errors.profiljob,
                pointing: "above",
              }
            }
            className="form-field"
          />
          <Form.Select 
            label='وضعیت تاهل'
            options={mariageOptions}
            placeholder='وضعیت خود را انتخاب کنید'
			      className="form-field"
          />
		  <Form.Input
            name="spouseJob"
            label="شغل همسر"
            placeholder="spouse occupation"
            type="text"
            autoComplete="occupation"
            value={values.spouseJob}
            onChange={onChange}
            error={
              errors.hasOwnProperty("profilspjob") && {
                content: errors.profilspjob,
                pointing: "above",
              }
            }
            className="form-field"
          />
		  <Form.Group inline className="form-field">
		  <label>تعداد فرزندان</label>
		  <Form.Input
            name="noGirls"
            label="دختر"
            placeholder=""
            type="text"
            className="form-field"
          />
		  <Form.Input
            name="noBoys"
            label="پسر"
            placeholder=""
            type="text"
            className="form-field"
          />
		  </Form.Group>
		  <Form.Group inline className="form-field">
		  <label>تعداد خواهر و برادران</label>
		  
		  <Form.Input
            name="noSisters"
            placeholder=""
            type="text"
			label='خواهر'
          />
		  
		  <Form.Input
            name="noBrothers"
            placeholder=""
            type="text"
			label='برادر'
          />
		  </Form.Group>
		  <Form.Input
            name="prohob"
            label="علاقه مندی ها"
            placeholder="خواندن کتاب، گوش کردن به موسیقی و..."
            type="text"
            className="form-field"
        />
        <Form.Input
            name="prores"
            label="محل زندگی"
            placeholder="تهران"
            type="text"
            className="form-field"
        />
        {/* {console.log(values)} */}
        {registerData && (
            <Message
              success
              //header={`خوش آمدید!`}
              content={`اطلاعات پروفایل شما با موفقیت در سیستم ثبت شد...`}
              className="form-field"
            />
         )}
        <Form.Button className="form-field" primary>
          شروع چت
        </Form.Button>
      </Form>
    </div>
  </>
  );
}



export default Register;
