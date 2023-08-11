import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBackPage from "./pages/ErrorFallBack";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Chat from "./pages/chat/Chat";
import ChatLobby from "./pages/chat/ChatLobby";
import ChatProfile from "./pages/chat/ChatProfile";
import Register from "./pages/Register";
import { SnackBar } from "./components/SnackBar";

function App() {
  return (
    <AuthProvider>
      {/* <ErrorBoundary FallbackComponent={ErrorFallBackPage}> */}

      <Router>
        <Container>
          <Switch>
            <Route component={Profile} path="/profile" />
            <Route component={About} path="/help" />
            <AuthRoute component={Register} path="/register" />
            <AuthRoute component={Login} path="/login" />
            <Route component={ChatLobby} path="/chatlobby" />
			<Route component={ChatProfile} path="/chatprofile" />
            <Route
              exact
              path="/chat"
              render={(otherUser) => {
                return <Chat otherUser={otherUser} />;
              }}
            />

            <Route component={ErrorFallBackPage} path="/error" />
            <Route component={Home} path="/" />
          </Switch>

          <SnackBar />
        </Container>
      </Router>
      {/* </ErrorBoundary> */}
    </AuthProvider>
  );
}

export default App;
