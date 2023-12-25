import React from "react";
import { withTranslation } from "react-i18next";
const SubCatIntro = ({ data, active, t }) => {
  // console.log("data", data);
  const imageToShow = data.has_unlocked === "0" && data.is_premium === "1";
  return (
    <div className="subcatintro__sec">
      <div className={`card spandiv ${active}`}>
        <div className="card__name m-auto">
          <p className="text-center  m-auto d-block">{data.subcategory_name}</p>
          <p className="text-center m-auto d-block fun_learn_hide">
            {t("Questions")} : {data.no_of_que}
          </p>
          {imageToShow ? (
            <img
              src={process.env.PUBLIC_URL + "/images/icons/c1.svg"}
              alt="premium"
              width={30}
              height={30}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(SubCatIntro);
