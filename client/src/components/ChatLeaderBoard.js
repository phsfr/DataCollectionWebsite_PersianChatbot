import React, { useEffect, useState, useContext } from "react";

import "./styles/ChatLeaderBoard.css";
const ChatLeaderBoad = ({ leaderboardData, username }) => {
  if (!leaderboardData) return <div></div>;
  const userIndex = leaderboardData.findIndex(
    (entry) => entry.username === username
  );

  return (
    <div class="leaderboard-card ">
      <section class="card-info card-section">
        {username && leaderboardData[userIndex] ? (
          <>
            <section class="user row">
              <h1 class="user-header">{username}</h1>
            </section>
            <section class="statistics">
              <article class="statistic">
                <h4 class="statistic-title">امتیاز شما</h4>
                <h3 class="statistic-value">
                  {leaderboardData[userIndex].totalPoints}
                </h3>
              </article>
            </section>
            <div class="dial">
              <h3 class="dial-value">رتبه</h3>
              <h2 class="dial-value">{userIndex + 1}</h2>
            </div>
          </>
        ) : (
          <div className="please-login">برای استفاده از فضای چت وارد شوید</div>
        )}
      </section>
      <section class="card-details card-section">
        <nav class="menu">
          <article class="menu-item menu-item-active">جدول امتیازات</article>
        </nav>

        <dl class="leaderboard">
          {leaderboardData.map((value, index) => {
            return (
              <div className="leaderboard-row">
                <div className="leaderboard-col1">{index + 1}</div>
                <div className="leaderboard-col2">{value.username}</div>
                <div className="leaderboard-col2">{value.totalPoints}</div>
              </div>
            );
          })}
        </dl>
      </section>
    </div>
  );
};
export default ChatLeaderBoad;
