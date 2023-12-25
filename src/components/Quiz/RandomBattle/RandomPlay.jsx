import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../../SEO";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ShowScore from "./ShowScore";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import config from "../../../utils/config";
import RandomQuestions from "./RandomQuestions";
import RandomReviewAnswer from "./RandomReviewAnswer";
import { useSelector } from "react-redux";
import { settingsData, sysConfigdata } from "../../../store/reducers/settingsSlice";
import { RandomQuestionsApi, UserCoinScoreApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import { useRef } from "react";

const MySwal = withReactContent(Swal);

const RandomPlay = ({ t }) => {
    const navigate = useNavigate();

    let getData = useSelector(selecttempdata);

    const selectdata = useSelector(settingsData);

    const review_answers_deduct_coin = selectdata && selectdata.filter((item) => item.type == "review_answers_deduct_coin");

    const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

    const [showScore, setShowScore] = useState(false);

    const [score, setScore] = useState(0);

    const [reviewCoins, setReviewCoins] = useState(false);

    const [reviewAnswers, setReviewAnswers] = useState(false);

    const [quizScore, setQuizScore] = useState(0);

    const [coins, setCoins] = useState(0);

    // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    const random_battle_seconds = selectdata && selectdata.filter((item) => item.type == "random_battle_seconds");

    const TIMER_SECONDS = Number(random_battle_seconds[0].message);

    useEffect(() => {
        if (getData) {
            getNewQuestions(getData.room_id, getData.category_id, getData.destroy_match);
        }
    }, []);

    //use Mathjax to remove unused data from data
    function Latex({ children }) {
        const node = useRef(null);

        useEffect(() => {
            renderMath();
        }, [children]);

        const renderMath = () => {
            // Replace newline characters with <br> tags before rendering
            const textWithLineBreaks = children.replace(/\r?\n/g, "<br/>");
            node.current.innerHTML = textWithLineBreaks;
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, node.current]);
        };
        return (
            <span ref={node} className="latex">
                {children}
            </span>
        );
    }

    const getNewQuestions = (match_id, category, destroy_match) => {
        if (systemconfig.battle_random_category_mode == "1") {
            RandomQuestionsApi(
                match_id,
                category,
                destroy_match,
                (response) => {
                    let questions = response.data.map((data) => {
                        let isBookmark = false;
                        if (questions_ids.indexOf(data.id) >= 0) {
                            isBookmark = true;
                        } else {
                            isBookmark = false;
                        }

                        let questionText = data.question
                            ? data.question
                                  .replace(/<[^>]+>/g, "")
                                  .replace(/&(?:nbsp);/g, "")
                                  .trim()
                            : "";

                        // Use \n to represent line breaks in the data
                        let questionTextWithLineBreaks = questionText.replace(/\n/g, "<br/>");

                        let question = <Latex>{questionTextWithLineBreaks}</Latex>;

                        let options = {
                            optiona: data.optiona ? (
                                <Latex>
                                    {data.optiona
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                            optionb: data.optionb ? (
                                <Latex>
                                    {data.optionb
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                            optionc: data.optionc ? (
                                <Latex>
                                    {data.optionc
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                            optiond: data.optiond ? (
                                <Latex>
                                    {data.optiond
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                            optione: data.optione ? (
                                <Latex>
                                    {data.optione
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                        };

                        return {
                            ...data,
                            ...options,
                            question: question,
                            isBookmarked: isBookmark,
                            selected_answer: "",
                            isAnswered: false,
                        };
                    });
                    // console.log("que",questions)
                    setQuestions(questions);
                    setShowScore(false);
                    setReviewAnswers(false);
                    setScore(0);
                },
                (error) => {
                    toast.error(t("No Questions Found"));
                    navigate("/quiz-play");
                    console.log(error);
                }
            );
        } else {
            RandomQuestionsApi(
                match_id,
                "",
                destroy_match,
                (response) => {
                    let questions = response.data.map((data) => {
                        let isBookmark = false;
                        if (questions_ids.indexOf(data.id) >= 0) {
                            isBookmark = true;
                        } else {
                            isBookmark = false;
                        }

                        let questionText = data.question
                            ? data.question
                                  .replace(/<[^>]+>/g, "")
                                  .replace(/&(?:nbsp);/g, "")
                                  .trim()
                            : "";

                        // Use \n to represent line breaks in the data
                        let questionTextWithLineBreaks = questionText.replace(/\n/g, "<br/>");

                        let question = <Latex>{questionTextWithLineBreaks}</Latex>;

                        let options = {
                            optiona: data.optiona ? (
                                <Latex>
                                    {data.optiona
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                            optionb: data.optionb ? (
                                <Latex>
                                    {data.optionb
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                            optionc: data.optionc ? (
                                <Latex>
                                    {data.optionc
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                            optiond: data.optiond ? (
                                <Latex>
                                    {data.optiond
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                            optione: data.optione ? (
                                <Latex>
                                    {data.optione
                                        .replace(/<[^>]+>/g, "")
                                        .replace(/\&nbsp;/g, "")
                                        .trim()}
                                </Latex>
                            ) : null,
                        };

                        return {
                            ...data,
                            ...options,
                            question: question,
                            isBookmarked: isBookmark,
                            selected_answer: "",
                            isAnswered: false,
                        };
                    });
                    // console.log("que",questions)
                    setQuestions(questions);
                    setShowScore(false);
                    setReviewAnswers(false);
                    setScore(0);
                },
                (error) => {
                    toast.error(t("No Questions Found"));
                    navigate("/quiz-play");
                    console.log(error);
                }
            );
        }
    };

    const handleAnswerOptionClick = (questions, score) => {
        setQuestions(questions);
        setScore(score);
    };

    const onQuestionEnd = (coins, quizScore) => {
        setShowScore(true);
        setCoins(coins);
        setQuizScore(quizScore);
    };

    const handleReviewAnswers = () => {
        let coins = review_answers_deduct_coin && Number(review_answers_deduct_coin[0].message);
        if (userData.data.coins < coins) {
            toast.error(t("You Don't have enough coins"));
            return false;
        }

        if(reviewCoins){
            setReviewAnswers(true);
            setShowScore(false);
        }else{
            MySwal.fire({
                title: t("Are you sure"),
                text: review_answers_deduct_coin && Number(review_answers_deduct_coin[0].message) + " " + t("Coins will be deducted from your account"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef5488",
                cancelButtonColor: "#d33",
                confirmButtonText: t("Continue"),
                cancelButtonText: t("Cancel"),
            }).then((result) => {
                if (result.isConfirmed) {
                
                    let status = 1;
                    UserCoinScoreApi(
                        "-" + coins,
                        null,
                        null,
                        "Random Battle Review Answer",
                        status,
                        (response) => {
                            setReviewAnswers(true);
                            setShowScore(false);
                            setReviewCoins(true)
                            updateUserDataInfo(response.data);
                        },
                        (error) => {
                            Swal.fire(t("OOps"), t("Please Try again"), "error");
                            console.log(error);
                        }
                    );
                }
            });
        }
    };

    const handleReviewAnswerBack = () => {
        setShowScore(true);
        setReviewAnswers(false);
    };

    return (
        <React.Fragment>
            <SEO title={t("DashboardPlay")} />
            <Breadcrumb title={t("1 vs 1 Battle")} content={t("Home")} contentTwo={t("1 vs 1 Battle")} />
            <div className="funandlearnplay dashboard battlerandom">
                <div className="container">
                    <div className="row ">
                        <div className="morphisam">
                            <div className="whitebackground pt-3">
                                <>
                                    {(() => {
                                        if (showScore) {
                                            return <ShowScore score={score} totalQuestions={questions.length} onReviewAnswersClick={handleReviewAnswers} quizScore={quizScore} reviewAnswer={true} playAgain={false} coins={coins} />;
                                        } else if (reviewAnswers) {
                                            return <RandomReviewAnswer questions={questions} goBack={handleReviewAnswerBack} />;
                                        } else {
                                            return questions && questions.length > 0 && questions[0].id !== "" ? (
                                                <RandomQuestions questions={questions} timerSeconds={TIMER_SECONDS} onOptionClick={handleAnswerOptionClick} onQuestionEnd={onQuestionEnd} />
                                            ) : (
                                                <div className="text-center text-white">
                                                    <Skeleton count={5} />
                                                </div>
                                            );
                                        }
                                    })()}
                                </>
                            </div>
                        </div>
                    </div>
                    <span className="circleglass__after"></span>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(RandomPlay);
