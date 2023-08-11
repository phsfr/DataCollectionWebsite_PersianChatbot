import { Message } from "semantic-ui-react";
import React, { useEffect, useRef, useContext, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQuery, gql, useSubscription, useMutation } from "@apollo/client";
import ErrorFallBackPage from "./ErrorFallBack";
import { AuthContext } from "../context/auth";
import { openSuccessSnack } from "../components/SnackBar";
import { GET_CHAT_REQUESTS } from "./chat/ChatLobby";
import { useHistory } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import "./Profile.css";

const maxRound = 27;

const CHAT_HISTORY_QUERY = gql`
  {
    myChats_my {
      id
      user
      alias
      messages{
        receiver
        content
        createdAt
      }
      createdAt
      updatedAt
    }
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
function Profile() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const history = useHistory();
  const historyQuery = useQuery(CHAT_HISTORY_QUERY, {
    onCompleted: (data) => {
      setChats(data.myChats_my);
    },
    onError: (err) => {
      console.error(JSON.stringify(err, null, 2));
    },fetchPolicy:"no-cache",
  });

  const onlineInitQuery = useQuery(GET_ONLINE_USERS_INIT, {
    fetchPolicy: "network-only",
  });

  const onlinesSub = useSubscription(GET_ONLINE_USERS, {
    fetchPolicy: "network-only",
  });
  const getOnlineUsers = () => {
    let onLineList = [];
    if (onlineInitQuery.data) onLineList = onlineInitQuery.data.onlineUsersInit;
    if (onlinesSub.data) onLineList = onlinesSub.data.onlineUsers;
    return onLineList;
  };
  const onlineList = getOnlineUsers();
  const onItemClick = (otherUserName) => {
    return () => {
      history.push("/chat", { otherUser: otherUserName});
    };
  };
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
    openSnackAsync("پیام جدید! صفحه را رفرش کنید تا در بالای لیست چت‌ها بیاید");
  }
  if (!user)
    return (
      <>
        <MenuBar />
        <Message
          error
          header="Action Forbidden"
          content="You can only sign up for an account once with a given e-mail address."
        />
      </>
    );
  else if (chats.length > 0 && !onlineInitQuery.loading) {
    
    const sortedChat = [...chats].sort(function (a, b) {
      return b.updatedAt - a.updatedAt;
    });
    return (
      <>
        <MenuBar />

        <ul className="task-items">
          {sortedChat.map((c, index) => {
            var notifMess = "چیزی بگو"
            var colorClassStyle = {}
            var roundNum = 0
            if(c.messages.length>0){
              roundNum = Math.floor(c.messages.length/2)
              if(c.messages.length%2===1 && c.messages[c.messages.length - 1].user === user.username){
                roundNum +=1
              }
            }
            if(roundNum>=maxRound){colorClassStyle={"backgroundColor":"#efdddd"}; notifMess="تمام شد"}
            const otherUser = onlineList.find((u) => u.username === c.user);
            return (
              <li
                className={"item type5 col " + Math.floor(Math.random() * 8)}
                onClick={onItemClick(c.id)}
                style={colorClassStyle}
              >
                <div className="task">
                  <div className="name">
                    {c.alias}
                    <span
                      className={
                        " online-badge " +
                        (otherUser.isOnline ? "online" : "not-online")
                      }
                    />
                  </div>
                </div>
                <div className="dates">
                  <div className="bar">
                    
                    {(c.messages.length > 0 ? c.messages[c.messages.length-1].content: "هنوز پیامی رد و بدل نشده")} 
                    <br />
                    <span className="subDate">
                      {new Date(c.updatedAt).toLocaleString()}
                    </span>
                    {(c.messages.length==0 || c.messages[c.messages.length-1].receiver==user.username || (roundNum>=maxRound)) && 
                      <div className="ctrl"><span className="nortification">{notifMess}</span></div>
                    }
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  } else if (historyQuery.loading || onlineInitQuery.loading) {
    return (
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
  } else
    return (
      <>
        <MenuBar />
        <div className="null-chat">شما هنوز با کسی وارد گفت و گو نشده‌اید.</div>
      </>
    );
}

export default Profile;
