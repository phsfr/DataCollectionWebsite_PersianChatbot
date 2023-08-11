import { useMutation, gql } from "@apollo/client";
import { useEffect, useContext } from "react";
import { Form, Message } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import MenuBar from "../components/MenuBar";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(loginInput: { username: $username, password: $password }) {
      id
      username
      token
      requests
      points
      createdAt
      updatedAt
    }
  }
`;

function Login() {
  const context = useContext(AuthContext);

  const { onChange, onSubmit, values, setValues, errors, setErrors } = useForm(
    loginHoistedFunction,
    {
      username: "",
      password: "",
    }
  );

  let history = useHistory();

  const [login, { loading: loginLoading, data: loginData }] = useMutation(
    LOGIN,
    {
      variables:
        values.username === ""
          ? {
              username: values.username,
              password: values.password,
            }
          : values,
      onError(error) {
        alert(JSON.stringify(error, null, 2));
        setErrors(error.graphQLErrors[0].extensions.exception.errors);
        setValues({
          username: "",
          password: "",
        });
      },
      ignoreResults: false,
      onCompleted: ({ login: userData }) => {
        setErrors({});
        setValues({
          username: "",
          password: "",
        });
        context.login(userData);
      },
    }
  );

  useEffect(() => {
    let interval = null;
    if (loginData) {
      interval = setInterval(() => {
        window.location.href = "/chatlobby";
      }, 3000);
    }
    return () => (interval ? clearInterval(interval) : null);
  }, [history, loginData]);

  function loginHoistedFunction() {
    login();
  }

  return (
    <>
      <MenuBar />
      <div className="form-container">
        <Form
          onSubmit={onSubmit}
          loading={loginLoading}
          success={loginData && Object.keys(loginData).length !== 0}
        >
          <h1 className="page-title">ورود</h1>
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

          {errors.general && (
            <Message
              error
              visible
              header={`خطا!`}
              content={`نام کاربری یا گذرواژه نادرست است.`}
              className="form-field"
            />
          )}

          {loginData && (
            <Message
              success
              header={`خوش آمدید!`}
              content={`تا چند ثانیه‌ی دیگر به خانه منتقل می‌شوید...`}
              className="form-field"
            />
          )}
          <Form.Button className="form-field" primary>
            ورود
          </Form.Button>
        </Form>
      </div>
    </>
  );
}

export default Login;
