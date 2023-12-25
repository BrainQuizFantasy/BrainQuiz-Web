import React, { lazy } from "react";
import { Route, Routes } from "react-router";
import PublicRoute from "../routes/PublicRoute";
import PrivateRoute from "../routes/PrivateRoute";

const Home = lazy(() => import("../pages/Home"));
const Quizplay = lazy(() => import("../pages/Quizplay"));
const Login = lazy(() => import("../pages/auth/Login"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));
const Otpverify = lazy(() => import("../pages/auth/Otpverify"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const QuizZone = lazy(() => import("../pages/QuizZone"));
const DashboardPlay = lazy(() => import("../components/Quiz/DashboardPlay"));
const Profile = lazy(() => import("../pages/Profile"));
const Bookmark = lazy(() => import("../pages/Bookmark"));
const Instruction = lazy(() => import("../pages/Instruction"));
const Invitefriends = lazy(() => import("../pages/Invitefriends"));
const LeaderBoard = lazy(() => import("../pages/LeaderBoard"));
const Contact_us = lazy(() => import("../pages/Contact-us"));
const About_us = lazy(() => import("../pages/About-us"));
const BookmarkPlay = lazy(() => import("../pages/BookmarkPlay"));
const TermAndConditions = lazy(() => import("../pages/TermAndConditions"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const DailyQuizDashboard = lazy(() => import("../components/Quiz/DailyQuizDashboard"));
const TrueandFalsePlay = lazy(() => import("../pages/TrueandFalsePlay"));
const FunandLearn = lazy(() => import("../pages/Fun-and-Learn"));
const FunandLearnPlay = lazy(() => import("../components/Quiz/Fun_and_Learn/FunandLearnPLay"));
const GuesstheWord = lazy(() => import("../pages/Guess-the-Word"));
const GuesstheWordplay = lazy(() => import("../components/Quiz/Guesstheword/Guessthewordplay"));
const SelfLearning = lazy(() => import("../pages/SelfLearning"));
const SelfLearningplay = lazy(() => import("../components/Quiz/SelfLearning/SelfLearningplay"));
const ContestPlay = lazy(() => import("../pages/ContestPlay"));
const ContestPlayBoard = lazy(() => import("../components/Quiz/ContestPlay/ContestPlayBoard"));
const ContestLeaderBoard = lazy(() => import("../components/Quiz/ContestPlay/ContestLeaderBoard"));
const RandomBattle = lazy(() => import("../pages/RandomBattle"));
const RandomPlay = lazy(() => import("../components/Quiz/RandomBattle/RandomPlay"));
const PlayWithFriendBattle = lazy(() => import("../pages/PlayWithFrndBattle"));
const GroupBattle = lazy(() => import("../pages/GroupBattle"));
const GroupPlay = lazy(() => import("../components/Quiz/GroupBattle/GroupPlay"));
const GroupBattleScore = lazy(() => import("../components/Quiz/GroupBattle/GroupBattleScore"));
const AudioQuestions = lazy(() => import("../pages/AudioQuestions"));
const AudioQuestionsPlay = lazy(() => import("../components/Quiz/AudioQuestions/AudioQuestionsPlay"));
const AudioReviewAnswer = lazy(() => import("../components/Quiz/AudioQuestions/AudioReviewAnswer"));
const MathMania = lazy(() => import("../pages/MathMania"));
const MathmaniaPlay = lazy(() => import("../components/Quiz/Mathmania/MathmaniaPlay"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ExamModule = lazy(() => import("../pages/ExamModule"));
const ExamModulePlay = lazy(() => import("../components/Quiz/Exammodule/ExamModulePlay"));
const CoinHistoryData = lazy(() => import("../pages/CoinHistory"));
const BadgesData = lazy(() => import("../pages/Badges"));
const Wallet = lazy(() => import("../pages/Wallet"));
const Statistics = lazy(() => import("../pages/Statistics"));
const GuestProfile = lazy(() => import("../pages/GuestProfile"));

const Router = () => {
  return (
      <Routes basename={process.env.REACT_APP_BASE_URL}>

        {/* public routes */}

        <Route path="/" exact={true} element={<Home />} />

        <Route path="/home" exact={true} element={<Home />} />

        <Route path="/instruction" exact={true} element={<Instruction />} />

        <Route path="/quiz-play" exact={true} element={<Quizplay />} />

        <Route path="/contact-us" exact={true} element={<Contact_us />} />

        <Route path="/about-us" exact={true} element={<About_us />} />

        <Route path="/terms-conditions" exact={true} element={<TermAndConditions />} />

        <Route path="/privacy-policy" exact={true} element={<PrivacyPolicy />} />

        <Route path="*" exact={true} element={<NotFound />} />

        <Route path="/guest-profile" exact={true} element={<GuestProfile />} />


        {/* private routes */}

        {/* Display this routes only after User Authentication */}
        <Route path="/" element={<PrivateRoute />}>

          <Route path="/leaderboard" exact={true} element={<LeaderBoard />} />

          <Route path="/quiz-play/quiz-zone" exact={true} element={<QuizZone />} />

          <Route path="/quiz-play/quiz-zone/dashboard-play" exact={true} element={<DashboardPlay />} />

          <Route path="/quiz-play/daily-quiz-dashboard" exact={true} element={<DailyQuizDashboard />} />

          <Route path="/quiz-play/true-and-false-play" exact={true} element={<TrueandFalsePlay />} />

          <Route path="/quiz-play/fun-and-learn" exact={true} element={<FunandLearn />} />

          <Route path="/quiz-play/fun-and-learn/fun-and-learn-play" exact={true} element={<FunandLearnPlay />} />

          <Route path="/quiz-play/guess-the-word" exact={true} element={<GuesstheWord />} />

          <Route path="/quiz-play/guess-the-word/guess-the-word-play" exact={true} element={<GuesstheWordplay />} />

          <Route path="/quiz-play/self-learning" exact={true} element={<SelfLearning />} />

          <Route path="/quiz-play/self-learning/self-learning-play" exact={true} element={<SelfLearningplay />} />

          <Route path="/quiz-play/contest-play" exact={true} element={<ContestPlay />} />

          <Route path="/quiz-play/contest-play/contest-play-board" exact={true} element={<ContestPlayBoard />} />

          <Route path="/quiz-play/contest-play/contest-leaderboard" exact={true} element={<ContestLeaderBoard />} />

          <Route path="/quiz-play/random-battle" exact={true} element={<RandomBattle />} />

          <Route path="/quiz-play/random-battle/random-play" exact={true} element={<RandomPlay />} />

          <Route path="/quiz-play/random-battle/play-with-friend-battle" exact={true} element={<PlayWithFriendBattle />} />

          <Route path="/quiz-play/group-battle" exact={true} element={<GroupBattle />} />

          <Route path="/quiz-play/group-battle/group-play" exact={true} element={<GroupPlay />} />

          <Route path="/quiz-play/group-battle/group-battle-score" exact={true} element={<GroupBattleScore />} />

          <Route path="/quiz-play/audio-questions" exact={true} element={<AudioQuestions />} />

          <Route path="/quiz-play/audio-questions/audio-questions-play" exact={true} element={<AudioQuestionsPlay />} />

          <Route path="/quiz-play/audio-questions/audio-review-answer" exact={true} element={<AudioReviewAnswer />} />

          <Route path="/quiz-play/math-mania" exact={true} element={<MathMania />} />

          <Route path="/quiz-play/math-mania/math-mania-play" exact={true} element={<MathmaniaPlay />} />

          <Route path="/quiz-play/exam-module" exact={true} element={<ExamModule />} />

          <Route path="/quiz-play/exam-module/exam-module-play" exact={true} element={<ExamModulePlay />} />

          <Route path="/profile" exact={true} element={<Profile />} />

          <Route path="/profile/bookmark" exact={true} element={<Bookmark />} />

          <Route path="/play-bookmark-questions" exact={true} element={<BookmarkPlay />} />

          <Route path="/profile/invite-friends" exact={true} element={<Invitefriends />} />

          <Route path="/profile/coin-history" exact={true} element={<CoinHistoryData />} />

          <Route path="/profile/badges" exact={true} element={<BadgesData />} />

          <Route path="/profile/wallet" exact={true} element={<Wallet />} />

          <Route path="/profile/statistics" exact={true} element={<Statistics />} />

        </Route>

        {/* Display this pages only if user is not Unauthenticated */}
        <Route path="/" exact={true} element={<PublicRoute afterLoginAccess={false} />}>

          <Route path="/auth/login" exact={true} element={<Login />} />

          <Route path="/auth/sign-up" exact={true} element={<SignUp />} />

          <Route path="/auth/otp-verify" exact={true} element={<Otpverify />} />

          <Route path="/auth/reset-password" exact={true} element={<ResetPassword />} />

        </Route>

      </Routes>
  );
};

export default Router;
