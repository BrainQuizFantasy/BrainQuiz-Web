import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import SubCatslider from "../components/Quiz/subcat/SubCatslider";
import UnlockLevel from "../components/Quiz/subcat/UnlockLevel";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { scrollhandler } from "../utils";
import excla from "../assets/images/exclamation.png";
import { t } from "i18next";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { UserCoinScoreApi, categoriesApi, getusercoinsApi, levelDataApi, subcategoriesApi, unlockpremiumcateApi } from "../store/actions/campaign";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import withReactContent from "sweetalert2-react-content";
import { updateUserDataInfo } from "../store/reducers/userSlice";

const MySwal = withReactContent(Swal);

const QuizZone = () => {
    const [category, setCategory] = useState({ all: "", selected: "" });
    const [subCategory, setsubCategory] = useState({ all: "", selected: "" });
    const [level, setLevel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subloading, setSubLoading] = useState(true);
    const [levelloading, setLevelLoading] = useState(true);
    const selectcurrentLanguage = useSelector(selectCurrentLanguage);

    const getAllData = () => {
        setCategory([]);
        setsubCategory([]);
        setLevel([]);

        // categories api
        categoriesApi(
            1,
            (response) => {
                let categories = response.data;

                setCategory({ ...category, all: categories, selected: categories[0] });
                setLoading(false);
                setSubLoading(false);
                setLevelLoading(false);
                if (categories[0].no_of !== "0") {
                    // subcategory api
                    subcategoriesApi(
                        categories[0].id,
                        "",
                        (response) => {
                            let subcategories = response.data;
                            if (!response.error && subcategories) {
                                setsubCategory({
                                    all: subcategories,
                                    selected: subcategories[0],
                                });
                                setSubLoading(false);

                                // level data api
                                levelDataApi(
                                    categories[0].id,
                                    subcategories[0].id,
                                    (response) => {
                                        let level = response.data;
                                        setLevel({
                                            count: subcategories[0].maxlevel,
                                            unlockedLevel: level.level,
                                        });
                                        setLevelLoading(false);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                            }
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                } else {
                    setLevelLoading(false);

                    // level data api
                    levelDataApi(
                        categories[0].id,
                        "",
                        (response) => {
                            let level = response.data;
                            setLevel({
                                count: categories[0].maxlevel,
                                unlockedLevel: level.level,
                            });
                            setLevelLoading(false);
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                }
            },
            (error) => {
                console.log(error);
                toast.error(t("No Data found"));
            }
        );
    };

    //handle category
    const handleChangeCategory = (data) => {
        // console.log("data: " , data);

        // this is for premium category only
        if (data.has_unlocked === "0" && data.is_premium === "1") {
            getusercoinsApi(
                (res) => {
                    // console.log(typeof data.coins, data.coins, typeof res.data.coins, res.data.coins);
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
                                    data.id,
                                    "",
                                    (res) => {
                                        getAllData();
                                        UserCoinScoreApi(
                                            "-" + data.coins,
                                            null,
                                            null,
                                            "Premium Categories",
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
                },
                (err) => {
                    console.log(err);
                }
            );
        }

        setCategory({ ...category, selected: data });
        setsubCategory([]);
        setLevel([]);

        if (data.no_of !== "0") {
            setSubLoading(true);
            setLevelLoading(true);

            // subcategory api
            subcategoriesApi(
                data.id,
                "",
                (response) => {
                    // console.log("res",response)

                    let subcategories = response.data;
                    if (!response.error && subcategories) {
                        setsubCategory({ all: subcategories, selected: subcategories[0] });
                        setSubLoading(false);

                        // level data api
                        levelDataApi(
                            data.id,
                            subcategories[0].id,
                            (response) => {
                                let level = response.data;
                                if (!level.error && level) {
                                    setLevel({
                                        count: subcategories[0].maxlevel,
                                        unlockedLevel: level.level,
                                    });
                                    setLevelLoading(false);
                                } else {
                                    toast.error(t("No Unlocked Levels Found"));
                                }
                            },
                            (error) => {
                                console.log(error);
                            }
                        );
                    } else {
                        toast.error(t("No Subcategories Found"));
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            setLevelLoading(true);

            // level data api
            levelDataApi(
                data.id,
                "",
                (response) => {
                    let level = response.data;
                    setLevel({
                        count: data.maxlevel,
                        unlockedLevel: level.level,
                    });
                    setLevelLoading(false);
                },
                (error) => {
                    console.log(error);
                }
            );
        }

        //mobile device scroll handle
        scrollhandler(500);
    };

    //handle subcatgory
    const handleChangeSubCategory = (subcategory_data) => {
        const catfilteredData = category.all.filter((item) => item.id === subcategory_data.maincat_id);
        // console.log(catfilteredData)

        setsubCategory({ ...subCategory, selected: subcategory_data });
        setSubLoading(false);
        setLevel([]);
        setLevelLoading(true);

        // before subcategory click check category unlock or not
        if (catfilteredData[0].has_unlocked === "0" && catfilteredData[0].is_premium === "1") {
            MySwal.fire({
                text: t("Please unlock first premium category"),
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: "#ef5488",
                confirmButtonText: `ok`,
                allowOutsideClick: false,
            });
            return false;
        }
        // this is for premium subcategory only
        if (subcategory_data.has_unlocked === "0" && subcategory_data.is_premium === "1") {
            getusercoinsApi((res) => {
                if (Number(subcategory_data.coins) > Number(res.data.coins)) {
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
                        confirmButtonText: `use ${subcategory_data.coins} coins`,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            unlockpremiumcateApi(
                                subcategory_data.maincat_id,
                                subcategory_data.id,
                                (res) => {
                                    getAllData();
                                    UserCoinScoreApi(
                                        "-" + subcategory_data.coins,
                                        null,
                                        null,
                                        "Premium Subcategories",
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
        }

        // level data api
        levelDataApi(
            category.selected.id,
            subcategory_data.id,
            (response) => {
                let level = response.data;
                if (!response.error && level) {
                    setLevel({
                        count: subcategory_data.maxlevel,
                        unlockedLevel: level.level,
                    });
                    setLevelLoading(false);
                } else {
                    toast.error(t("No Unlocked Levels Found"));
                }
            },
            (error) => {
                console.log(error);
            }
        );

        scrollhandler(700);
    };

    //truncate text
    const truncate = (txtlength) => (txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength);

    useEffect(() => {
        getAllData();
    }, [selectcurrentLanguage]);

    return (
        <React.Fragment>
            <SEO title={t("QuizPlay")} />
            <Breadcrumb title={t("Quiz Zone")} content={t("Home")} contentTwo={t("Quiz Zone")} />
            <div className="quizplay mb-5">
                <div className="container">
                    <div className="row morphisam mb-5">
                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-12 col-12">
                            <div className="left-sec">
                                {/* left category sec*/}
                                <div className="bottom__left">
                                    <div className="cat__Box">
                                        <span className="left-line"></span>
                                        <h3 className="quizplay__title text-uppercase font-weight-bold">{t("Categories")}</h3>
                                        <span className="right-line"></span>
                                    </div>
                                    <div className="bottom__cat__box">
                                        <ul className="inner__Cat__box">
                                            {loading ? (
                                                <div className="text-center">
                                                    <Skeleton count={5} />
                                                </div>
                                            ) : (
                                                <>
                                                    {category.all ? (
                                                        category.all.map((data, key) => {
                                                            const imageToShow = data.has_unlocked === "0" && data.is_premium === "1";
                                                            return (
                                                                <li className="d-flex" key={key} onClick={(e) => handleChangeCategory(data)}>
                                                                    <div className={`w-100 button ${category.selected && category.selected.id === data.id ? "active-one" : "unactive-one"}`}>
                                                                        <span className="Box__icon">
                                                                            <img src={data.image ? data.image : `${excla}`} alt="image" />
                                                                        </span>
                                                                        <p className="Box__text ">{truncate(data.category_name)}</p>
                                                                        {imageToShow ? <img className="ms-2" src={process.env.PUBLIC_URL + "/images/icons/c1.svg"} alt="premium" width={30} height={30} /> : ""}
                                                                    </div>
                                                                </li>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="text-center">
                                                            <p className="text-dark">{t("No Category Data Found")}</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* sub category middle sec */}
                        <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-12 col-12">
                            <div className="right-sec">
                                <SubCatslider data={subCategory.all} selected={subCategory.selected} onClick={handleChangeSubCategory} subloading={subloading} />
                            </div>

                            <div className="right__bottom cat__Box mt-4">
                                <span className="left-line"></span>
                                <h6 className="quizplay__title text-uppercase font-weight-bold">{t("levels")}</h6>
                                <span className="right-line"></span>
                            </div>

                            {/* levels sec */}
                            <div className="row custom_row">
                                <UnlockLevel count={level.count} category={category.selected} subcategory={subCategory.selected} unlockedLevel={level.unlockedLevel} url={`/quiz-play/quiz-zone/dashboard-play`} levelLoading={levelloading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(QuizZone);
