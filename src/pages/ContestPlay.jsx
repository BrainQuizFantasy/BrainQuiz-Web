import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Live from "../components/Quiz/ContestPlay/Live";
import Past from "../components/Quiz/ContestPlay/Past";
import Upcoming from "../components/Quiz/ContestPlay/Upcoming";
import SEO from "../components/SEO";
import { t } from "i18next";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { ContestPlayApi, UserCoinScoreApi } from "../store/actions/campaign";
import {
  LoadcontestLeaderboard,
  Loadtempdata,
} from "../store/reducers/tempDataSlice";
import { updateUserDataInfo } from "../store/reducers/userSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ContestPlay = () => {
  //states
  const [livecontest, setLiveContest] = useState();

  const [pastcontest, setPastContest] = useState();

  const [upcoming, setUpComing] = useState();

   // store data get
   const userData = useSelector((state) => state.User);

  const navigate = useNavigate();

  const AllData = () => {
    ContestPlayApi(
      (response) => {
        let liveData = response.live_contest.data;
        setLiveContest(liveData);

        let pastData = response.past_contest.data;
        setPastContest(pastData);

        let upcomingData = response.upcoming_contest.data;
        setUpComing(upcomingData);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  //live play btn
  const playBtn = (contestid, entrycoin) => {
    if(Number(entrycoin) > Number(userData.data.coins)){
      toast.error("you dont have enough coins")
      return false;
    }
    navigate({ pathname: "/quiz-play/contest-play/contest-play-board" });
    let data = { contest_id: contestid, entry_coin: entrycoin };
    Loadtempdata(data);
    
    UserCoinScoreApi(
      `-${entrycoin}`,
      null,
      null,
      "Contest Entry Point",
      "1",
      (response) => {
        updateUserDataInfo(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  //past leaderboard btn
  const LeaderBoard = (contest_id) => {
    navigate({ pathname: "/quiz-play/contest-play/contest-leaderboard" });
    let data = { past_id: contest_id };
    LoadcontestLeaderboard(data);
  };

  useEffect(() => {
    AllData();
  }, [selectCurrentLanguage]);

  return (
    <Fragment>
      <SEO title={t("Contest Play")} />
      <Breadcrumb
        title={t("Contest Play")}
        content={t("Home")}
        contentTwo={t("Contest Play")}
      />
      <div className="contestPlay mb-5">
        <div className="container">
          <div className="row morphisam mb-5">
            <div className="col-md-12 col-12">
              <div className="contest_tab_contest">
                <Tabs
                  defaultActiveKey="live"
                  id="fill-tab-example"
                  className="mb-3"
                  fill
                >
                  <Tab eventKey="past" title={t("Past")}>
                    <Past data={pastcontest} onClick={LeaderBoard} />
                  </Tab>
                  <Tab eventKey="live" title={t("Live")}>
                    <Live data={livecontest} onClick={playBtn} />
                  </Tab>
                  <Tab eventKey="upcoming" title={t("Upcoming")}>
                    <Upcoming data={upcoming} />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ContestPlay;
