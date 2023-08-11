import React, { useEffect, useRef, useContext, useState } from "react";
import { useSubscription, useMutation, gql, useQuery } from "@apollo/client";
import { AuthContext } from "../../context/auth";
import { animateScroll } from "react-scroll";
import { Input, Button, Transition, Modal, Header } from "semantic-ui-react";
import isContentValid from "../../util/ChatValidations";
import isDirectQuestion from "../../util/CheckIsDirect";
import { ErrorBoundary } from "react-error-boundary";
import { openSuccessSnack, openErrorSnack } from "../../components/SnackBar";
import { GET_CHAT_REQUESTS } from "./ChatLobby";
import ErrorFallBackPage from "../ErrorFallBack";
import { useHistory } from "react-router-dom";
import MenuBar from "../../components/MenuBar";
import "./Chat.css";
import { Form } from "semantic-ui-react";
import { useForm } from "../../util/hooks";
import ProfileEditer from "./RegisterProfile";
import axios from "axios";

const maxRound = 27;
// var sendMesCount = 0;

const FIND_CHAT = gql`
  query FindChat($chatId: ID!) {
    findChat(chatId: $chatId) {
      id
      content
      user
    }
  }
`;

const GET_CHAT_ALIAS = gql`
  query GetChatAlias($chatId: ID!) {
    getChatAlias(chatId: $chatId)
  }
`;

const GET_PROFILES = gql`
  query GetProfiles($messageColl_id: ID!) {
    getProfiles(messageColl_id: $messageColl_id) {
      userProfile
      {
        job
        spouseJob
        fatherJob
        motherJob
        name
        age
        gender
        noSiblings
        noSisters
        noBrothers
        noBoys
        noGirls
        noChilren
        mariageStatus
        hobby 
        favBook 
        favFilm 
        favDish 
        resistance
      }
      predictRProfile
      {
        job
        spouseJob
        fatherJob
        motherJob
        name
        age
        gender
        noSiblings
        noSisters
        noBrothers
        noBoys
        noGirls
        noChilren
        mariageStatus
        hobby
        favBook 
        favFilm 
        favDish 
        resistance
      }
      receiverProfile
      {
        job
        spouseJob
        fatherJob
        motherJob
        name
        age
        gender
        noSiblings
        noSisters
        noBrothers
        noBoys
        noGirls
        noChilren
        mariageStatus
        hobby
        favBook 
        favFilm 
        favDish 
        resistance
      }
    }
  }
`;

const GET_MESSAGES_INIT = gql`
  query Message($receiver: String!, $other: String!) {
    messages(receiver: $receiver, other: $other) {
      id
      content
      user
    }
  }
`;

const GET_MESSAGES = gql`
  subscription($receiver: String!, $other: String!) {
    messages_my(receiver: $receiver, other: $other) {
      id
      content
      user
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($user: String!, $receiver: String!, $content: String!, $isDirect: Boolean!) {
    postMessage_my(user: $user, receiver: $receiver, content: $content, isDirect: $isDirect)
  }
`;
const EXIT_CHAT = gql`
  mutation {
    exitChat
  }
`;
const REGISTER_PROFILE = gql`
  mutation($chatId: String!, $job:String!, $name:String!){
    postReceiverProfile(chatId: $chatId, job:$job, name:$name) 
  }
`;
const SET_DIRECT_QUESTION = gql`
  mutation($chatId: ID!){
    plusDirectQNums_msgcollect(chatId:$chatId)
  }
`;

function UserProfile(userProf){//
  var gender = "-"
  const male = "مرد", female = "زن"
  if(userProf.gender!=null){
    gender = (userProf.gender==true? male: female)
  }
  var marriageStatus = "-"
  const single = "مجرد", married = "متاهل"
  if(userProf.mariageStatus!=null){
    marriageStatus = (userProf.mariageStatus=="single"? single: married)
  }
  return (
    <div className="profile">
      <span className="profile-text-title">پروفایل شما</span>
      <span className="profile-text">نام: {userProf.name}</span>
      <span className="profile-text">جنسیت: {gender}</span>
      <span className="profile-text">سن: {(userProf.age!=null?userProf.age:"-")}</span>
      <span className="profile-text">وضعیت تاهل: {marriageStatus}</span>
      <span className="profile-text">شغل خود: {(userProf.job!=null?userProf.job:"-")}</span>
      {/* {marriageStatus=='متاهل' && 
      <span className="profile-text">شغل همسر: {(userProf.spouseJob!=null?userProf.spouseJob:"-")}</span>} */}
      {marriageStatus=='متاهل' && 
      <span className="profile-text">تعداد فرزندان دختر: {(userProf.noGirls!=null?userProf.noGirls:"-")}</span>}
      {marriageStatus=='متاهل' && 
      <span className="profile-text">تعداد فرزندان پسر: {(userProf.noBoys!=null?userProf.noBoys:"-")}</span>}
      <span className="profile-text">تعداد خواهران: {(userProf.noSisters!=null?userProf.noSisters:"-")}</span>
      <span className="profile-text">تعداد برادران: {(userProf.noBrothers!=null?userProf.noBrothers:"-")}</span>
      {/* <span className="profile-text">شغل پدر: {(userProf.fatherJob!=null?userProf.fatherJob:"-")}</span>
      <span className="profile-text">شغل مادر: {(userProf.motherJob!=null?userProf.motherJob:"-")}</span> */}
      <span className="profile-text">علاقه‌مندی کلی: {(userProf.hobby!=null?userProf.hobby:"-")}</span>
      {/* <span className="profile-text">کتاب موردعلاقه: {(userProf.favBook!=null?userProf.favBook:"-")}</span>
      <span className="profile-text">فیلم موردعلاقه: {(userProf.favFilm!=null?userProf.favFilm:"-")}</span>
      <span className="profile-text">غذای موردعلاقه: {(userProf.favDish!=null?userProf.favDish:"-")}</span> */}
      <span className="profile-text">محل سکونت: {(userProf.resistance!=null?userProf.resistance:"-")}</span>
    </div>

  );
}

function ReceiverProfile(receiverProf, chatId){
  const [registerProfile] =useMutation(REGISTER_PROFILE);
  return (
    <div className="profile-receiver">
      <span className="profile-text-title">پروفایل مخاطب</span>
    <Form
      // onSubmit={onSubmit}
      //loading = {registerLoading}
    >
      <Form.Input
        name="name"
        label="نام"
        placeholder="name"
        // onChange={onChange}
        // value={name}//{values.name}
        className="profile-input-field form-field"
        defaultValue = {(receiverProf!=null ? receiverProf.name: "")}
      />
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
        <Form.Button className="form-field" primary>
        ثبت پروفایل
        </Form.Button>
      </Form>
    </div>
  );
}
function RulesModal() {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>
        <p className="modal-text">قوانین چت</p>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>
            <p className="modal-text">
              تشکّر از همکاری شما. برای گرفتن امتیاز، گفت‌و‌گوی شما باید
              در چهارچوب زیر قرار گیرد:
            </p>
          </Header>
          <p className="modal-text">
          ۱. پاسخ شما به سوالات شخصی که در چت از شما می‌شود باید بر اساس اطلاعات تخصیص داده شده در پروفایلتان (سمت چپ) باشد.
          </p>
          <p className="modal-text">
          ۲. سعی کنید پروفایل مخاطب خود را حدس بزنید. هر چه این تخمین به پروفایل واقعی او نزدیکتر باشد امتیاز بیشتری می‌گیرید.
          </p>
          <p className="modal-text">
          ۳. در اول چت و پایان آن نیازی به ردوبدل کردن پیامهای احوال‌پرسی و خداحافظی نیست، در صورت لزوم به یک پیام بسنده کنید.
          </p>
          <p className="modal-text b">
          ۴. تا حد ممکن از پرسیدن سوالات مستقیم پرهیز کنید.
          </p>
          <p className="modal-text b">
          ۵. شما می‌توانید حداکثر ۲۷ پیام به طرف مقابل ارسال کنید.
          </p>
          <p className="modal-text b">۶. حدّاقل باید ۴ پیام از طرف شما در چت موجود باشد.</p>
          <p className="modal-text">
          ۷. پیامتان حاوی کلمات نامناسب نباشد.
          </p>
          <p className="modal-text">۸.هر پیام حدّاقل ۲ کلمه و حدّاکثر ۲۸ کلمه باشد.</p>
          <p className="modal-text">۹.متنوع و با معنی باشد</p>
          <p className="modal-text">
          ۱۰. فارسی باشد (اصطلاحاً فینگلیش نباشد).
          </p>
          <p className="modal-text">
          ۱۱. پیام‌های شما و مخاطبتان یکی در میان باشد.
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="متوجه شدم"
          labelPosition="right"
          icon="checkmark"
          color="blue"
          onClick={() => {
            setOpen(false);
          }}
          className="modal-button"
          primary
        />
      </Modal.Actions>
    </Modal>
  );
}
const Messages = ({ user, other, data, initQuery }) => {
  var sendMesCount = 0
  if (!data && !initQuery.data.findChat) {
    return null;
  }
  const activeData =
    data && data.messages_my && data.messages_my.length > 0 ? data.messages_my : initQuery.data.findChat;
  animateScroll.scrollToBottom({
    containerId: "ContainerElementID",
  });

  if(activeData && activeData.length > 0){
    sendMesCount = Math.floor(activeData.length/2)
    if(activeData.length%2===1 && activeData[activeData.length - 1].user === user){
      sendMesCount +=1
    }
  }else{sendMesCount = 0;}

  return activeData ? (
    <div>
      <div className="chat" id="ContainerElementID">
        {activeData.map(({ id, user: messageUser, content }) => (
          <div class="message-row">
            <div
              class={
                "message message--" + (user === messageUser ? "sent" : "recieved")
              }
            >
              <div class="message-avatar">
                {user === messageUser ? "شما" : "مخاطب"}
              </div>
              <div class="message-bubble">
                <p className="message-text rtl-form-field ">{content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="roundnum rtl-form-field">پیام باقیمانده: {sendMesCount}/{maxRound}</div>
    </div>
    
  ) : (
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
const Chat = ({ otherUser}) => {
  const [postMessage] = useMutation(POST_MESSAGE);
  const [setIsDirectQ] = useMutation(SET_DIRECT_QUESTION);
  const history = useHistory();
  const [exitChat] = useMutation(EXIT_CHAT);

  const other = otherUser.location.state
    ? otherUser.location.state.otherUser
    : "";
  
  const [sendDisable, setSendDis] = useState(false);
  const [userProfile, setUProfile] = React.useState(false);
  const [predictProfile, setRProfile] = React.useState(false);
  const [receiverProfile, setReceProfile] = React.useState(false);
  const [is_direct, setDirect] = React.useState(false);
  const profiles = useQuery(GET_PROFILES,{variables: {messageColl_id: other}, onCompleted: (data) => {
    setUProfile(data.getProfiles.userProfile);
    setRProfile(data.getProfiles.predictRProfile);
    setReceProfile(data.getProfiles.receiverProfile);
    }, 
    fetchPolicy: "no-cache"});
  const userProfileBlock = (userProfile!=false ? UserProfile(userProfile):"");
  let { user } = useContext(AuthContext);
  if (!user) user = { username: "" };
  const [state, stateSet] = React.useState({
    user: user.username,
    receiver: other,
    content: "",
    isDirect: false,
    receiverProfile: null,
    UserProfile: null
  });
  const { data, loading } = useSubscription(GET_MESSAGES, {
    variables: { receiver: user.username, other: other },
    fetchPolicy: "network-only",
  });
  const initQuery = useQuery(FIND_CHAT, {
    variables: { chatId: other },
    fetchPolicy: "network-only",
  }); 
  const openErrorSnackAsync = async (text) => {
    openErrorSnack(text);
  };
  const onSend = () => {
    const activeData =
      data && data.messages_my && data.messages_my.length > 0 ? data.messages_my : initQuery.data.findChat;

    if(activeData.length > 0 && Math.floor(activeData.length/2)>=maxRound){
      setSendDis(true);
      setChatError("تعداد پیامهای مجاز برای ارسال در این چت از حد گذشته است");
      return;
    }else if (
      activeData.length > 0 &&
      activeData[activeData.length - 1].user === user.username
    ) {
      setChatError("نوبت ارسال پیام شما نرسیده است");
      return;
    }else{setChatError("");}

    if (user.username === "") history.push("/chatlobby");
    const error = isContentValid(state.content);
    
    if ((!error)){ 
      // isDirectQuestion(state.content).then(value => { 
      //   setDirect(value);
      //   if (value==true){
      //     // openErrorSnackAsync(" 🤨 قراره سوال مستقیم نپرسی که!");
      //     alert(" 😟 قراره سوال مستقیم نپرسی، امتیازت کم میشه ها!")
      //     // console.log(other)
      //     setIsDirectQ({
      //       variables: {chatId:other},
      //     })
      //   }
      // }).catch(err => { console.log(err) });
      state.isDirect = false;
      postMessage({
        variables: state,
      });
      setChatError("");
    } else {
        setChatError(error);
    }
    stateSet({
      ...state,
      content: "",
    });
  };
  const [chatError, setChatError] = React.useState(null);
  const requestsSub = useSubscription(GET_CHAT_REQUESTS, {
    variables: { receiver: user.username },
  });
  const openSnackAsync = async (text) => {
    openSuccessSnack(text);
  };
  const otherAlias = useQuery(GET_CHAT_ALIAS, {variables:{chatId:other}})
  if (
    requestsSub?.data?.chatRequestSub &&
    requestsSub.data.chatRequestSub !== ""
  ) {
    openSnackAsync("پیام جدید دارید");
  }
  if (other === "") history.push("/chatlobby");
  if (initQuery.loading)
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
  else
        return (
          <>
            <RulesModal />
            <MenuBar />
            {userProfileBlock}
            {profiles.data && <ProfileEditer
            chatId= {other}
            predictProfile= {profiles.data?.getProfiles.predictRProfile}
            receiverProfile = {profiles.data?.getProfiles.receiverProfile}
            />}
      
            <div>
              <div className="chat-header">
              {/* {state.receiver} */}
                <div className="chat-header-username">مخاطب: {(otherAlias.data?otherAlias.data.getChatAlias: '')}</div>
              </div>
              <Messages
                user={state.user}
                other={state.receiver}
                initQuery={initQuery}
                data={data}
              />

              <footer className="chat-footer">
                <Input
                  className="chat-input rtl-form-field"
                  placeholder="چیزی بگو..."
                  value={state.content}
                  onChange={(evt) =>
                    stateSet({
                      ...state,
                      content: evt.target.value,
                    })
                  }
                  onKeyUp={(evt) => {
                    if (evt.keyCode === 13) {
                      onSend();
                    }
                  }}
                />
                <div>
                  <Button className="form-field" primary onClick={() => onSend()} disabled={sendDisable}>
                    ارسال
                  </Button>
                </div>
              </footer>
              <div className="chat-error">{chatError}</div>
              {/* <div className="roundnum rtl-form-field">پیام باقیمانده: {sendMesNum}/{maxRound}</div> */}
            </div>
          </>
        );
};

export default Chat;
