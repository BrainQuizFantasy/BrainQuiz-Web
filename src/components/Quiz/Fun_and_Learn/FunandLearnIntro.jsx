import React from "react";
import { withTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Loadtempdata } from "../../../store/reducers/tempDataSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const FunandLearnIntro = ({ data, active, t, url,categoryall,subcategoryall }) => {
 
  // console.log("data",subcategoryall,categoryall)
  const router = useNavigate()
  const handleSubcategory = (subdata) => {
    const subcatfilteredData = subcategoryall && subcategoryall.filter(item => item.id === subdata.subcategory);
    const catfilteredData = categoryall && categoryall.filter(item => item.id === subdata.category);
    // console.log("sub",catfilteredData)
    if((catfilteredData?.[0].has_unlocked === "0" && catfilteredData?.[0].is_premium === "1")){
      MySwal.fire({
          text: (("Please unlock first premium category")),
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "#ef5488",
          allowOutsideClick: false,
      })
      return false
   }

   if((subcatfilteredData?.[0].has_unlocked === "0" && subcatfilteredData?.[0].is_premium === "1")){
    MySwal.fire({
        text: (("Please unlock first premium subcategory")),
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#ef5488",
        allowOutsideClick: false,
    })
    return false
 }
   router(url)
    Loadtempdata(subdata);
  }

  return (
    <div className="subcatintro__sec">
      <div onClick={() => handleSubcategory(data)}>
        <div className={`card spandiv ${active}`}>
          <div className="card__name m-auto">
            <p className="text-center m-auto d-block">
              {data.title}
            </p>
            <p className="text-center m-auto d-block fun_learn_hide">
              {t("Questions")} : {data.no_of_que}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(FunandLearnIntro);
