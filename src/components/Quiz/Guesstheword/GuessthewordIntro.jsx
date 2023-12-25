import React from "react";
import { withTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Loadtempdata } from "../../../store/reducers/tempDataSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { UserCoinScoreApi, getusercoinsApi, unlockpremiumcateApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { t } from "i18next";

const MySwal = withReactContent(Swal);
const GuessthewordIntro = ({ data, active, url, getAllData, categoryall }) => {
    const imageToShow = data.has_unlocked === "0" && data.is_premium === "1";
    const router = useNavigate();
    const handleSubcategory = (subdata) => {
        const catfilteredData = categoryall && categoryall.filter((item) => item.id === subdata.maincat_id);
        if (catfilteredData?.[0].has_unlocked === "0" && catfilteredData?.[0].is_premium === "1") {
            MySwal.fire({
                text: "Please unlock first premium category",
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: "#ef5488",
                allowOutsideClick: false,
            });
            return false;
        }

        // this is for premium sub category only
        if (subdata.has_unlocked === "0" && subdata.is_premium === "1") {
            getusercoinsApi((res) => {
                if (Number(subdata.coins) > Number(res.data.coins)) {
                    MySwal.fire({
                        text: t("You Don't have enough coins"),
                        icon: "warning",
                        showCancelButton: false,
                        confirmButtonColor: "#ef5488",
                        confirmButtonText: `OK`,
                        allowOutsideClick: false,
                    });
                } else {
                    MySwal.fire({
                        text: t("Double your Coins and achieve a higher Score."),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#ef5488",
                        confirmButtonText: `${subdata.coins} coins`,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            unlockpremiumcateApi(
                                subdata.maincat_id,
                                subdata.id,
                                (res) => {
                                    getAllData();
                                    UserCoinScoreApi(
                                        "-" + subdata.coins,
                                        null,
                                        null,
                                        "Premium SubCategories",
                                        "1",
                                        (response) => {
                                            getusercoinsApi(
                                                (responseData) => {
                                                    updateUserDataInfo(responseData.data);
                                                },
                                                (error) => {
                                                    console.log(error);
                                                }
                                            );
                                        },
                                        (error) => {
                                            console.log(error);
                                        }
                                    );
                                },
                                (err) => console.log(err)
                            );
                        }
                    });
                }
            });
            return false;
        }
        router(url);
        Loadtempdata(subdata);
    };

    return (
        <div className="subcatintro__sec">
            <div onClick={() => handleSubcategory(data)}>
                <div className={`card spandiv ${active}`}>
                    <div className="card__name m-auto">
                        <p className="text-center m-auto d-block">{data.subcategory_name}</p>
                        {imageToShow ? <img src={process.env.PUBLIC_URL + "/images/icons/c1.svg"} alt="premium" width={30} height={30} /> : ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(GuessthewordIntro);
