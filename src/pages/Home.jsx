import React, { Fragment, useEffect } from "react";
import SEO from "../components/SEO";
import ScrollToTop from "../components/ScrollToTop";
import { getAndUpdateBookmarkData, isLogin } from "../utils";
import { t } from "i18next";
import ChooseUS from "../components/home/Chooseus/ChooseUS";
import IntroSlider from "../components/home/IntroSlider/IntroSlider";
import Feature from "../components/home/feature/Feature";
import Process from "../components/home/process/Process";
import { websettingsData } from "../store/reducers/webSettings";
import { useSelector } from "react-redux";

const Home = () => {
  useEffect(() => {
    if (isLogin()) {
      getAndUpdateBookmarkData();
    }
  }, []);
  const websettingsdata = useSelector(websettingsData);

  const toogleweb = websettingsdata && websettingsdata.toggle_web_home_settings;
  
  // toggle_web_home_settings
  return (
    <Fragment>
      <SEO title={t("Home")} />
      <IntroSlider />
      {toogleweb === "1" ? (
        <>
          <ChooseUS />
          <Feature />
          <Process />
        </>
      ) : null}
      <ScrollToTop />
    </Fragment>
  );
};

export default Home;
