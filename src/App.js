//built-in
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import './common.css';

//custom
import Login from "./pages/Login";
import Content from "./pages/Content";
import Discussion from "./pages/Discussion";
import Subscription from "./pages/Subscription";
import User from "./pages/User";
import DashboardLayout from "./layout/DashboardLayout";
import AddContent from "./pages/Content/AddContent";
import Category from "./pages/Category";
import NotFound from "./pages/NotFound";
import Notification from "./pages/Notification/Notification";
import ContributorDashboardLayout from "./layout/ContributorDashboardLayout";
import {
  RequireAdmin,
  RequireAuth,
  RequireContributor,
} from "./auth/RequireAuth";
import { AuthProvider } from "./auth/useAuth";
import Home from "./pages/Home";
import EditContent from "./pages/Content/EditContent";
import Healthcheck from "./pages/Healthcheck";
import Card from "./pages/Card";
import { Settings } from "./pages/Settings";
import { AddDiscussion } from "./pages/Discussion/AddDiscussion";
import { EditDiscussion } from "./pages/Discussion/EditDiscussion";
import OfferAndAnnouncement from "./pages/OfferAndAnnouncement/index.js";
import AddOfferAndAnnouncement from "./pages/OfferAndAnnouncement/AddOfferAndAnnouncement";
import EditOfferAndAnnouncement from "./pages/OfferAndAnnouncement/EditOfferAndAnnouncement";
import Profile from "./pages/Profile/profile.js";
import Book from "./pages/Book";
import AddBook from "./pages/Book/AddBook";
import AddChapter from "./pages/Book/AddChapter";
import Chapter from "./pages/Book/Chapter";
import Section from "./pages/Book/Section";
import EditSection from "./pages/Book/EditSection";
import AddSection from "./pages/Book/AddSection";
import EditBook from "./pages/Book/EditBook";
import EditChapter from "./pages/Book/EditChapter";
import Leads from "./pages/Leads";
import AddLeads from "./pages/Leads/AddLeads";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin/healthcheck" element={<Healthcheck />} />

            {/* protected routes for admin */}

            <Route
              path="/admin/dashboard/*"
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <DashboardLayout />
                  </RequireAdmin>
                </RequireAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path="category" element={<Category />} />
              <Route path="content" element={<Content />} />
              <Route path="content/add" element={<AddContent />} />
              <Route path="content/edit/:id" element={<EditContent />} />
              <Route path="discussion" element={<Discussion />} />
              <Route path="discussion/add" element={<AddDiscussion />} />
              <Route path="discussion/edit/:id" element={<EditDiscussion />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="user" element={<User />} />
              <Route path="card" element={<Card />} />
              <Route path="settings" element={<Settings />} />
              <Route path="notification" element={<Notification />} />
              <Route path="notification/:id" element={<Notification />} />
              <Route path="notification/discussion/:discussionId" element={<Notification />} />
              <Route
                path="offer-and-announcement"
                element={<OfferAndAnnouncement />}
              />
              <Route
                path="offer-and-announcement/add"
                element={<AddOfferAndAnnouncement />}
              />
              <Route
                path="offer-and-announcement/edit/:id"
                element={<EditOfferAndAnnouncement />}
              />
              <Route path="profile" element={<Profile />} />
              <Route path="book" element={<Book />} />
              <Route path="book/add" element={<AddBook />} />
              <Route path="book/edit/:bookId" element={<EditBook />} />
              <Route path="book/chapter/:bookId" element={<Chapter />} />
              <Route path="book/chapter/add/:bookId" element={<AddChapter />} />
              <Route path="book/chapter/edit/:bookId/:chapterId" element={<EditChapter />} />
              <Route path="book/chapter/section/:bookId/:chapterId" element={<Section />} />
              <Route path="book/chapter/section/add/:bookId/:chapterId" element={<AddSection />} />
              <Route
                path="book/chapter/section/edit/:bookId/:chapterId/:sectionId"
                element={<EditSection />}
              />
              <Route path="leads" element={<Leads />} />
              <Route path="leads/add" element={<AddLeads />} />
              <Route path="leads/edit/:id" element={<AddLeads />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* protected route for contributor */}
            <Route
              path="/contributor/dashboard/*"
              element={
                <RequireAuth>
                  <RequireContributor>
                    <ContributorDashboardLayout />
                  </RequireContributor>
                </RequireAuth>
              }
            >
              {/* <Route index element={<Home />} /> */}
              <Route path="profile" element={<Profile />} />
              <Route path="content" element={<Content />} />
              <Route path="content/add" element={<AddContent />} />
              <Route path="content/edit/:id" element={<EditContent />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
