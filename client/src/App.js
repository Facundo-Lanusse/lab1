import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/admin" element={<Admin />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/logIn" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/UploadQuestion" element={<UploadQuestionForm />} />
            <Route path="/Play" element={<PlayMenu />} />
            <Route path="/solitary" element={<Solitary />} />
            <Route path="/Ranking" element={<Ranking />} />
            <Route path="/SoloHistory" element={<SoloHistory />} />
            <Route path="/CategoryManager" element={<CategoryManager />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Friends" element={<Friends />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/classic/:battleId" element={<ClassicMode />} />
          <Route path="/classic" element={<ClassicMode />} />
          <Route path="/roulette" element={<Roulette />} />
          <Route path="/Communities" element={<Community />} />
          <Route path="/Create-Category" element={<CreateCommunityCategory />} />
          <Route path="/Play-Categories/:category_id" element={<PlayCommunityCategories />} />
        </Routes>
      </Router>
  );
}

export default App;
