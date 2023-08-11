import { useMutation, gql } from "@apollo/client";
import { useEffect, useContext } from "react";
import { Form, Message } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(
      registerInput: { username: $username, email: $email, password: $password }
    ) {
      id
      username
      token
      points
      createdAt
      updatedAt
    }
  }
`;

function Register() {
  const context = useContext(AuthContext);

  const { onChange, onSubmit, values, setValues, errors, setErrors } = useForm(
    registerHoistedFunction,
    {
      username: "",
      email: "",
      password: "",
    }
  );

  let history = useHistory();

  const [
    register,
    { loading: registerLoading, data: registerData },
  ] = useMutation(REGISTER, {
    variables: {
      username: values.username,
      email: values.email,
      password: values.password,
    },
    onError(error) {
      if (!error.graphQLErrors) return;
	  setErrors(error&&error.graphQLErrors[0]?error.graphQLErrors[0].extensions.exception.errors:{});
      setValues({
        username: "",
        email: "",
        password: "",
      });
    },
    ignoreResults: false,
    onCompleted: (data) => {
      setErrors({});
      setValues({
        username: "",
        email: "",
        password: "",
      });
      context.login(data.register);
    },
  });

  useEffect(() => {
    let interval = null;
    if (registerData) {
      interval = setInterval(() => {
        window.location.href = "/chatlobby";
      }, 3000);
    }
    return () => (interval ? clearInterval(interval) : null);
  }, [history, registerData]);

  function registerHoistedFunction() {
    register();
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
          <h1 className="page-title">ثبت‌نام</h1>
          <Form.Input
            name="username"
            label="نام کاربری"
            placeholder="Username"
            value={values.username}
            type="text"
            autoComplete="username"
            onChange={onChange}
            error={
              errors.hasOwnProperty("username") && {
                content: errors.username,
                pointing: "above",
              }
            }
            className="form-field"
          />
          <Form.Input
            name="email"
            label="ایمیل"
            placeholder="email"
            value={values.email}
            type="email"
            autoComplete="email"
            onChange={onChange}
            error={
              errors.hasOwnProperty("email") && {
                content: errors.email,
                pointing: "above",
              }
            }
            className="form-field"
          />
          <Form.Input
            name="password"
            label="گذرواژه"
            placeholder="Password"
            value={values.password}
            type="password"
            autoComplete="current-password"
            onChange={onChange}
            error={
              errors.hasOwnProperty("password") && {
                content: errors.password,
                pointing: "above",
              }
            }
            className="form-field"
          />
          {registerData && (
            <Message
              success
              header={`خوش آمدید!`}
              content={`کاربر با نام کاربری ${registerData.register.username} در سایت ثبت‌نام شد. تا چند ثانیه‌ی دیگر به خانه منتقل می‌شوید...`}
              className="form-field"
            />
          )}
          <Form.Button className="form-field" primary>
            ثبت‌نام
          </Form.Button>
        </Form>
      </div>
    </>
  );
}

export default Register;
