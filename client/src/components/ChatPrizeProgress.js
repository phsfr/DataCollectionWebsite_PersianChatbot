import React, { useEffect, useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../context/auth";
import "./styles/PrizeBar.css";
const BarCard = ({ totalPoints, remaining, prize }) => {
  return (
    <div class="timeline__cards">
      <div class="timeline__card card">
        <header class="card__header">
          <time class="time" dateTime="2008-09-01">
            <span class="time__month">اکنون</span>
          </time>
          <h3 class="card__title r-title">
            <p>{prize} </p>
          </h3>
        </header>
        <div class="card__content">
          <p>{remaining} : امتیاز مانده تا جایزه‌ی بعدی</p>
        </div>
      </div>
    </div>
  );
};
const PrizesBar = ({ totalPoints }) => {
  const { user, logout } = useContext(AuthContext);
  const getRemainingPontsToNext = () => {
    return parseInt(5000 - (totalPoints % 5000));
  };

  const getPrizeIndex = () => {
    return parseInt(totalPoints / 5000);
  };
  const prizeIndex = getPrizeIndex();
  return (
    <div class="timeline__page">
      <div className="timeline__title">
        {" "}
        {totalPoints} :مجموع امتیازات کاربران
      </div>
      {prizeIndex === 4 && (
        <BarCard
          totalPoints={totalPoints}
          remaining={getRemainingPontsToNext()}
          prize={"۱ ميليون و ۵۰۰ هزار تومان"}
        />
      )}
      <div class="timeline">
        <div class="timeline__group">
          <div class="timeline__year time" aria-hidden="true">
            <span className="year__upper">{"۱ ميليون و ۵۰۰ هزار تومان"}</span>
            <br />
            <span className="year__lower">{"۲۰ هزار امتیاز"}</span>
          </div>
          {prizeIndex === 3 && (
            <BarCard
              totalPoints={totalPoints}
              remaining={getRemainingPontsToNext()}
              prize={"۱ ميليون تومان"}
            />
          )}
        </div>
        <div class="timeline__group">
          <div class="timeline__year time" aria-hidden="true">
            <span className="year__upper">{"۱ ميليون تومان"}</span>
            <br />
            <span className="year__lower"> {"۱۵ هزار امتیاز"}</span>
          </div>

          {prizeIndex === 2 && (
            <BarCard
              totalPoints={totalPoints}
              remaining={getRemainingPontsToNext()}
              prize={"۷۰۰ هزار تومان"}
            />
          )}
        </div>
        <div class="timeline__group">
          <div class="timeline__year time" aria-hidden="true">
            <span className="year__upper">{"۷۰۰ هزار تومان"}</span>
            <br />
            <span className="year__lower"> {"۱۰ هزار امتیاز"}</span>
          </div>

          {prizeIndex === 1 && (
            <BarCard
              totalPoints={totalPoints}
              remaining={getRemainingPontsToNext()}
              prize={"۵۰۰ هزار تومان"}
            />
          )}
        </div>
        <div class="timeline__group">
          <div class="timeline__year time" aria-hidden="true">
            <span className="year__upper">{"۵۰۰ هزار تومان"}</span>
            <br />
            <span className="year__lower"> {"۵ هزار امتیاز"}</span>
          </div>

          {prizeIndex === 0 && (
            <BarCard
              totalPoints={totalPoints}
              remaining={getRemainingPontsToNext()}
              prize={"۲۰۰ هزار تومان"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizesBar;
