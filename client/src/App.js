import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import Login from "./pages/LogIn";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import UploadQuestionForm from "./pages/UploadQuestionForm";
import PlayMenu from "./pages/PlayMenu";
import Solitary from "./pages/Solitary";
import Ranking from "./pages/UserRanking";
import SoloHistory from "./pages/SoloHistory";
import CategoryManager from "./pages/CategoryManager";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import UserProfile from "./pages/ExternUserProfile";
import ClassicMode from "./pages/ClassicMode";
import Roulette from "./pages/Roulette";
import Community from "./pages/Community";
import CreateCommunityCategory from "./pages/CreateCommunityCategory";
import PlayCommunityCategories from "./pages/PlayCommunityCategories";
import NavigationBar from "./components/NavigationBar";
import CommunityCategoriesJudgement from "./pages/CommunityCategoriesJudgement";
import ReviewCategory from "./pages/ReviewCategory";
import BulletPlay from "./pages/BulletPlay";
import InviteHandler from "./components/InviteHandler";


const AppContent = () => {
  const location = useLocation();


  const showNavBarRoutes = ["/Home", "/Play", "/Communities"];


  const shouldShowNavBar = showNavBarRoutes.some(route =>
      location.pathname === route || location.pathname.startsWith(route + "/")
  );

  return (
      <>
        {shouldShowNavBar && <NavigationBar />}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/LogIn" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/UploadQuestion" element={<UploadQuestionForm />} />
          <Route path="/Play" element={<PlayMenu />} />
          <Route path="/Solitary" element={<Solitary />} />
          <Route path="/BulletPlay" element={<BulletPlay />} />
          <Route path="/Ranking" element={<Ranking />} />
          <Route path="/SoloHistory" element={<SoloHistory />} />
          <Route path="/CategoryManager" element={<CategoryManager />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Friends" element={<Friends />} />
          <Route path="/Profile/:userId" element={<UserProfile />} />
          <Route path="/Classic/:battleId" element={<ClassicMode />} />
          <Route path="/Classic" element={<ClassicMode />} />
          <Route path="/Roulette" element={<Roulette />} />
          <Route path="/Communities" element={<Community />} />
          <Route path="/Create-Category" element={<CreateCommunityCategory />} />
          <Route path="/Play-Categories/:category_id" element={<PlayCommunityCategories />} />
          <Route path="/Categories-Judgement" element={<CommunityCategoriesJudgement />} />
          <Route path="/Review-Category/:category_id" element={<ReviewCategory />} />
          <Route path="/invite/:inviteCode" element={<InviteHandler />} />
        </Routes>
      </>
  );
};

function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}

export default App;