import React from "react";
import Chart from "./Chart";
import styles from "./GamePage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const GamePage = () => {
  return (
    <div className={cx("game-page")}>
      <div className={cx("content")}>
        <Chart />
      </div>
    </div>
  );
};

export default GamePage;
