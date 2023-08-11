import React, { useEffect, useRef, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQuery, gql, useSubscription, useMutation } from "@apollo/client";
import ErrorFallBackPage from "../ErrorFallBack";
import { AuthContext } from "../../context/auth";
import { animateScroll } from "react-scroll";
import { Button, Dropdown, Header, Modal } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import PrizesBar from "../../components/ChatPrizeProgress";
import ChatLeaderBoad from "../../components/ChatLeaderBoard";
import { openSuccessSnack } from "../../components/SnackBar";
import MenuBar from "../../components/MenuBar";

const CREAT_CHAT = gql`
  mutation($user: String!, $receiver: String!) {
    registerChat(user: $user, receiver: $receiver)
  }
`;

export const GET_CHAT_REQUESTS = gql`
  subscription($receiver: String!) {
    chatRequestSub(receiver: $receiver)
  }
`;

const SEND_CHAT_REQUESTS = gql`
  mutation($user: String!, $receiver: String!) {
    chatRequest(user: $user, receiver: $receiver)
  }
`;
const GET_CHAT_REQUESTS_ANSWER = gql`
  subscription($receiver: String!) {
    chatRequestAnswerSub(receiver: $receiver)
  }
`;
const SEND_CHAT_REQUEST_ANSWER = gql`
  mutation($user: String!, $receiver: String!) {
    chatRequestAnswer(user: $user, receiver: $receiver)
  }
`;

const GET_ONLINE_USERS = gql`
  subscription {
    onlineUsers {
      username
      alias
      isOnline
    }
  }
`;

const GET_ONLINE_USERS_INIT = gql`
  {
    onlineUsersInit {
      username
      alias
      isOnline
    }
  }
`;
const ALL_CHAT_POINTS = gql`
  {
    allChatPoints
  }
`;
const GET_CHAT_LEADERBOARD = gql`
  {
    topChatUsers_my {
      username
      totalPoints
    }
  }
`;

function RequestModal({ open, setOpen, user, onAccept }) {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>
        <p className="modal-text">درخواست چت</p>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>
            <p className="modal-text">از طرف ‌{user}</p>
          </Header>
          <p className="modal-text">کاربر {user} می‌خواهد با شما وارد چت شود</p>
          <p className="modal-text">موافقید؟</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="red"
          className="modal-button"
          onClick={() => setOpen(false)}
        >
          خیر
        </Button>
        <Button
          content="بلی"
          labelPosition="right"
          icon="checkmark"
          color="blue"
          onClick={() => {
            setOpen(false);
            onAccept(user);
          }}
          className="modal-button"
          primary
        />
      </Modal.Actions>
    </Modal>
  );
}
const sentRequest = {
  to: "",
  didSend: false,
};
const ChatCard = ({
  user,
  usersList,
  onDropdownChange,
  other,
  usernameError,
  submit,
  error,
}) => {
  return user.username !== "" ? (
    <div className="chat-lobby-card">
      <div className="form-field">
        نام کاربری کاربر مورد نظرتان را پیدا کنید
      </div>

      <Dropdown
        button
        floating
        labeled
        options={usersList}
        search
        placeholder="Username:"
        className="chat-input-margined"
        onChange={onDropdownChange}
      />
      {usernameError && (
        <div className="form-field chat-field-error">
          {usernameError
            ? usernameError
            : "" + "\n" + (error ? "خطایی رخ داد" : "")}
        </div>
      )}
      <Button
        className="form-field chat-field-submit "
        primary
        onClick={submit}
      >
        چت
      </Button>
    </div>
  ) : (
    <div></div>
  );
};
const ChatLobby = () => {
  let { user } = useContext(AuthContext);
  if (!user) user = { username: "" };
  const history = useHistory();

  const [modalOpen, setModalOpen] = React.useState(false);
  const closeModalWithCallBack = () => {
    setModalOpen(false);
    requestsSub.data.chatRequestSub = "";
  };
  const [allPoints, setAllPoints] = React.useState(0);
  const pointQuery = useQuery(ALL_CHAT_POINTS, {
    onCompleted: (data) => {
      setAllPoints(data.allChatPoints);
    },
    fetchPolicy: "no-cache",
  });


  const leaderboardQuery = useQuery(GET_CHAT_LEADERBOARD, {
    fetchPolicy: "no-cache",
  });

  const onlineInitQuery = useQuery(GET_ONLINE_USERS_INIT, {
    fetchPolicy: "network-only",
  });

  const onlinesSub = useSubscription(GET_ONLINE_USERS, {
    fetchPolicy: "network-only",
  });
  const requestsSub = useSubscription(GET_CHAT_REQUESTS, {
    variables: { receiver: user.username },
  });

  const openSnackAsync = async (text) => {
    openSuccessSnack(text);
  };
  if (
    requestsSub?.data?.chatRequestSub &&
    requestsSub.data.chatRequestSub !== ""
  ) {
    openSnackAsync("پیام جدید دارید");
  }
  const [other, setOther] = React.useState("");

  const getOnlineUsers = () => {
    let onLineList = [];
    if (onlineInitQuery.data) onLineList = onlineInitQuery.data.onlineUsersInit;
    if (onlinesSub.data) onLineList = onlinesSub.data.onlineUsers;
    return onLineList
      .filter((u) => u.username !== user.username)
      .sort(function (a, b) {
        return b.isOnline - a.isOnline;
      })
      .map((u) => {
        return {
          key: u.username,
          text: u.alias,
          value: u.username,
          label: {
            color: u.isOnline ? "green" : "white",
            empty: true,
            circular: true,
          },
        };
      });
  };

  const getErrors = () => {
    let error = {};
    if (onlineInitQuery.error) error = onlineInitQuery.error;
    return error;
  };

  const error = getErrors();
  const usersList = getOnlineUsers();
  const [usernameError, setUsernameError] = React.useState(null);

  const onDropdownChange = (e, data) => {
    setOther(data.value);
  };
  const [registerchat, {loading, data: registerdchat}] = useMutation(CREAT_CHAT, {variables:{user: user.username, receiver: other}});
  const submit = () => {
    if (!usersList.map((item) => item.value).includes(other))
      setUsernameError(
        "کاربر مورد نظر در لیست آنلاین‌ها نمی‌یابید؟ صفحه را رفرش کنید."
      );
    else {
      registerchat()
    }
  };
  useEffect(() => {
    if (registerdchat){
      history.push("/chat", { otherUser: registerdchat.registerChat});//other });
    }
  });
  const isLoading = () => {
    return (
      leaderboardQuery.loading || onlineInitQuery.loading || pointQuery.loading
    );
  };

  return !isLoading() ? (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallBackPage}>
        <MenuBar />
        <div className="chat-lobby-container ">
          <div className="lobby-container-left">
            <ChatCard
              user={user}
              usersList={usersList}
              onDropdownChange={onDropdownChange}
              other={other}
              usernameError={usernameError}
              submit={submit}
              error={error}
            />
            <ChatLeaderBoad
              leaderboardData={leaderboardQuery.data?.topChatUsers_my}
              username={user.username}
            />
          </div>
          <PrizesBar totalPoints={allPoints}></PrizesBar>
        </div>
      </ErrorBoundary>
    </>
  ) : (
    <>
      <MenuBar />
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  );
};

export default ChatLobby;
