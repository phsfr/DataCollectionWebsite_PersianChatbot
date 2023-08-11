import { useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "semantic-ui-react";
import moment from "moment";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import thefLogo from './hacker-opac.png';

function Home() {
  const history = useHistory();
  const onPrizes = () => {
    history.push("chatlobby");
  };
  const onLogin = () => {
    history.push("login");
  };
  const customStyle = {'maxWidth':'80%', 'backgroundImage':`url(${thefLogo})`, 'backgroundRepeat':'no-repeat', 'backgroundPosition':'1% 18%'};
  return (
    <div className="hero-card" style={customStyle}>
      <div className="hero-title">مسابقه «حدس بزن من کی‌ام!»</div>
      <div className="hero-body hero-welcome">
        به مسابقه‌ی آزمایشگاه پردازش زبان‌های طبیعی دانشگاه شهید
        بهشتی خوش آمدید.
      </div>
      <div className="hero-subtitle">چرا؟</div>
      <div className="hero-body">
        هدف ما از برگزاری این مسابقه جمع‌آوری داده برای توسعه و پژوهش در حوزه‌ی
        پردازش متن و گفتار زبان فارسی است.
      </div>
      <div className="hero-subtitle">چگونه؟</div>
      <div className="hero-body">
      در این مسابقه شما به گفتگو با دیگر مسابقه دهندگان در قالب چت می‌پردازید. 
      <br/>
      در آغاز هر گفتگو، به شما و طرف مقابلتان هر یک پروفایلی شامل اطلاعات شخصی نسبت داده می‌شود که باید در حین مکالمه سعی کنید هرچه بیشتر پروفایل مخاطب خود را حدس بزنید.
      <br/> نتیجه حدستان هر چه به پروفایل واقعی او نزدیکتر باشد امتیاز بیشتری دریافت خواهید کرد. 
        <br /> 
        باید در این راستا حتی الامکان از طرح سوال مستقیم خودداری کنید و بیشتر او را ترغیب به دادن اطلاعات نمایید.
      </div>
      <div className="hero-subtitle">چقدر؟</div>
      <div className="hero-body">
        جایزه‌ی نهایی بر حسب مجموع امتیازات کسب شده‌ی افراد محاسبه می‌گردد. برای
        مثال اگر همه‌ی شرکت کنندگان در مجموع ۵ هزار امتیاز جمع‌اوری کنند جایزه
        ۵۰۰ هزار تومان خواهد بود ولی اگر ۱۵ هزار امتیاز جمع‌آوری کنند جایزه ۱
        میلیون تومان خواهد بود.
      </div>
      <div className="hero-button-container">
        <Button className="form-field hero-button" primary onClick={onPrizes}>
          شرکت در مسابقه
        </Button>
      </div>
    </div>
  );
}

export default Home;
