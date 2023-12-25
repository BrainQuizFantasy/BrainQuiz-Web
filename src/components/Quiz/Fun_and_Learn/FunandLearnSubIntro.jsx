import React from "react";
import { withTranslation } from "react-i18next";
const FunandLearnSubIntro = ({ data, active, t }) => {
  const imageToShow = data.has_unlocked === "0" && data.is_premium === "1";
  return (
    <div className="subcatintro__sec">
      <div className={`card spandiv ${active}`}>
        <div className="card__name m-auto">
          <p className="text-center  m-auto d-block">{data.subcategory_name}</p>
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

export default withTranslation()(FunandLearnSubIntro);
