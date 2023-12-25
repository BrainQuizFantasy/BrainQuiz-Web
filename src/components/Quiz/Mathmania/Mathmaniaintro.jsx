import React from "react";
import { withTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Loadtempdata } from "../../../store/reducers/tempDataSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { UserCoinScoreApi, getusercoinsApi, unlockpremiumcateApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { t } from "i18next";
const MySwal = withReactContent(Swal);

const Mathmaniaintro = ({ data, active, url, categoryall, getAllData }) => {
    const imageToShow = data.has_unlocked === "0" && data.is_premium === "1";
    const router = useNavigate();
    const subdataload = (alldata) => {
        const catfilteredData = categoryall && categoryall.filter((item) => item.id === alldata.maincat_id);
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

        // this is for premium subcategory only
        if (data.has_unlocked === "0" && data.is_premium === "1") {
            getusercoinsApi((res) => {
                if (Number(data.coins) > Number(res.data.coins)) {
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
                        confirmButtonText: `use ${data.coins} coins`,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            unlockpremiumcateApi(
                                data.maincat_id,
                                data.id,
                                (res) => {
                                    getAllData();
                                    UserCoinScoreApi(
                                        "-" + data.coins,
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

        // setTimeout(()=>{
        //  router(url)
        // },2000)
        router(url);
        Loadtempdata(alldata);
    };

    return (
        <div className="subcatintro__sec">
            <div onClick={() => subdataload(data)}>
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

export default withTranslation()(Mathmaniaintro);
