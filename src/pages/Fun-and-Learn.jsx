import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import FunandLearnSlider from "../components/Quiz/Fun_and_Learn/FunandLearnSlider";
import excla from "../assets/images/exclamation.png";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { UserCoinScoreApi, categoriesApi, getfunandlearnApi, getusercoinsApi, subcategoriesApi, unlockpremiumcateApi } from "../store/actions/campaign";
import FunandLearnSubCatSlider from "../components/Quiz/Fun_and_Learn/FunandLearnSubCatSlider";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { updateUserDataInfo } from "../store/reducers/userSlice";

const MySwal = withReactContent(Swal);

const Fun_and_Learn = ({ t }) => {
    const [category, setCategory] = useState({ all: "", selected: "" });

    const [subCategory, setsubCategory] = useState({ all: "", selected: "" });

    const [funandlearn, setFunandLearn] = useState({ all: "", selected: "" });

    const [loading, setLoading] = useState(true);

    const [subloading, setSubLoading] = useState(true);

    const [funandlearningloading, setfunandlearnLoading] = useState(true);

    const getAllData = () => {
        setCategory([]);
        setsubCategory([]);
        setFunandLearn([]);

        // categories api
        categoriesApi(
            2,
            (response) => {
                let categories = response.data;

                setCategory({ ...category, all: categories, selected: categories[0] });
                setLoading(false);
                setSubLoading(false);
                if (categories[0].no_of != "0") {
                    // subcategory api
                    subcategoriesApi(
                        categories[0].id,
                        "",
                        (response) => {
                            let subcategories = response.data;
                            setsubCategory({
                                all: subcategories,
                                selected: subcategories[0],
                            });
                            setSubLoading(false);

                            getfunandlearnApi(
                                "subcategory",
                                subcategories[0].id,
                                (response) => {
                                    let funandlearn_data = response.data;
                                    setFunandLearn({
                                        all: funandlearn_data,
                                        selected: funandlearn_data[0],
                                    });
                                    setfunandlearnLoading(false);
                                },
                                (error) => {
                                    console.log(error);
                                    toast.error(t("No Data found"));
                                }
                            );
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                } else {
                    setfunandlearnLoading(false);

                    getfunandlearnApi(
                        "category",
                        categories[0].id,
                        (response) => {
                            let funandlearn_data = response.data;
                            setFunandLearn({
                                all: funandlearn_data,
                                selected: funandlearn_data[0],
                            });
                            setfunandlearnLoading(false);
                        },
                        (error) => {
                            console.log(error);
                            toast.error(t("No Data found"));
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

    // change category
    const handleChangeCategory = (data) => {
        //  console.log("data: " , data);
        setCategory({ ...category, selected: data });
        setsubCategory([]);
        setFunandLearn([]);

        // this is for premium category only
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
            });
        }

        if (data.no_of !== "0") {
            setSubLoading(true);
            setfunandlearnLoading(true);

            // subcategory api
            subcategoriesApi(
                data.id,
                "",
                (response) => {
                    let subcategories = response.data;
                    if (!response.error && subcategories) {
                        setsubCategory({ all: subcategories, selected: subcategories[0] });
                        setSubLoading(false);

                        getfunandlearnApi(
                            "subcategory",
                            subcategories[0].id,
                            (response) => {
                                let funandlearn_data = response.data;
                                setFunandLearn({
                                    all: funandlearn_data,
                                    selected: funandlearn_data[0],
                                });
                                setfunandlearnLoading(false);
                            },
                            (error) => {
                                console.log(error);
                                toast.error(t("No Data found"));
                                setfunandlearnLoading(false);
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
            setfunandlearnLoading(true);

            getfunandlearnApi(
                "category",
                data.id,
                (response) => {
                    let funandlearn_data = response.data;
                    // setFunandLearn(funandlearn_data);
                    setFunandLearn({
                        all: funandlearn_data,
                        selected: funandlearn_data[0],
                    });
                    setfunandlearnLoading(false);
                },
                (error) => {
                    console.log(error);
                    toast.error(t("No Data found"));
                }
            );
        }
    };

    //handle subcatgory
    const handleChangeSubCategory = (subcategory_data) => {
        const catfilteredData = category.all && category.all.filter((item) => item.id === subcategory_data.maincat_id);
        setsubCategory({ ...subCategory, selected: subcategory_data });
        setSubLoading(false);
        setFunandLearn([]);
        setfunandlearnLoading(true);

        // before subcategory click check category unlock or not
        if (catfilteredData?.[0].has_unlocked === "0" && catfilteredData?.[0].is_premium === "1") {
            MySwal.fire({
                text: t("Please unlock first premium category"),
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: "#ef5488",
                confirmButtonText: `ok`,
                allowOutsideClick: false,
            });
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

        getfunandlearnApi(
            "subcategory",
            subcategory_data.id,
            (response) => {
                let funandlearn_data = response.data;
                // setFunandLearn(funandlearn_data);
                setFunandLearn({
                    all: funandlearn_data,
                    selected: funandlearn_data[0],
                });
                setfunandlearnLoading(false);
            },
            (error) => {
                console.log(error);
                toast.error(t("No Data found"));
            }
        );
    };

    //truncate text
    const truncate = (txtlength) => (txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength);

    useEffect(() => {
        getAllData();
    }, [selectCurrentLanguage]);

    return (
        <Fragment>
            <SEO title={t("Fun and Learn")} />
            <Breadcrumb title={t("Fun and Learn")} content={t("Home")} contentTwo={t("Fun and Learn")} />
            <div className="funandlearn mb-5">
                <div className="container">
                    <div className="row morphisam mb-5">
                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-12 col-12">
                            <div className="left-sec">
                                {/* left category sec*/}
                                <div className="bottom__left">
                                    <div className="cat__Box">
                                        <span className="left-line"></span>
                                        <h3 className="funandlearn__title text-uppercase  font-weight-bold">{t("Categories")}</h3>
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
                                                                <li className="d-flex" key={key} onClick={() => handleChangeCategory(data)}>
                                                                    <div className={`w-100 button ${category.selected && category.selected.id === data.id ? "active-one" : "unactive-one"}`}>
                                                                        <span className="Box__icon">
                                                                            <img src={data.image ? data.image : `${excla}`} alt="image" />
                                                                        </span>
                                                                        <p className="Box__text">{truncate(data.category_name)}</p>
                                                                        {imageToShow ? <img className="ms-2" src={process.env.PUBLIC_URL + "/images/icons/c1.svg"} alt="premium" width={30} height={30} /> : ""}
                                                                    </div>
                                                                </li>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="text-center">
                                                            <p>{t("No Category Data Found")}</p>
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
                                <FunandLearnSubCatSlider data={subCategory.all} selected={subCategory.selected} onClick={handleChangeSubCategory} subloading={subloading} />
                            </div>

                            <div className="right__bottom cat__Box mt-4">
                                <span className="left-line"></span>
                                <h6 className="quizplay__title text-uppercase font-weight-bold">{t("data")}</h6>
                                <span className="right-line"></span>
                            </div>

                            <div className="bottom_card">
                                <FunandLearnSlider
                                    categoryall={category.all}
                                    subcategoryall={subCategory.all}
                                    data={funandlearn.all}
                                    selected={funandlearn.selected}
                                    url={`/quiz-play/fun-and-learn/fun-and-learn-play`}
                                    funandlearningloading={funandlearningloading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default withTranslation()(Fun_and_Learn);
