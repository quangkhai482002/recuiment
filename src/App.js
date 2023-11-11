// ---import from source----------------------------------------------
import "App.css";

import { CandidateLayout, HasHero, ManagerLayout } from "components/Layout";

import {
  AdminDashboard,
  AdminHome,
  AdminInfo,
  AdminManageAccount,
  AdminPositionDetail,
  AdminScore,
  ViewUserInfo,
} from "features/admin/pages";
import {
  AuthActiveEmail,
  AuthForgotPassword,
  AuthLogin,
  AuthResetPassword,
  AuthSignup,
  PrivateRoute,
} from "features/auth/pages";
import {
  InterviewerHistory,
  InterviewerHome,
  InterviewerInfo,
  InterviewerManageQuestion,
  InterviewerScore,
} from "features/interviewer/pages";
import {
  RecruiterCreatePosition,
  RecruiterEvent,
  RecruiterEventDetail,
  RecruiterHistory,
  RecruiterHome,
  RecruiterInfo,
  RecruiterPositionDetail,
  RecruiterScore,
  RecruiterUpdatePosition,
  RecruiterViewEventDetail,
} from "features/recruiter/pages";
import {
  CandidateCreateResume,
  CandidateEditResume,
  CandidateEvent,
  CandidateEventDetail,
  CandidateHome,
  CandidateInfo,
  CandidateInterviewHistory,
  CandidatePositionDetail,
  CandidateResume,
} from "./features/candidate/pages";

import { ViewResume, AboutUs } from "features/public/pages";

import { NotFound } from "components/Common";

import {Callback} from "components/Common"

// ---import from Library---------------------------------------------------

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faInstagram,
  faSlack,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  faBlog,
  faCheck,
  faChevronLeft,
  faHandPointer,
  faLocationDot,
  faRotateLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faBlog,
  faChevronLeft,
  faSlack,
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter,
  faCheck,
  faTrash,
  faRotateLeft,
  faHandPointer,
  faTrashCan,
  faLocationDot,
  faPenToSquare
);

// ---Main-------------------------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="login" element={<AuthLogin />} />
        <Route path="signup" element={<AuthSignup />} />
        <Route path="forgot-password" element={<AuthForgotPassword />} />
        <Route path="verify-email/:accessToken" element={<AuthActiveEmail />} />
        <Route
          path="reset-password/:accessToken"
          element={<AuthResetPassword />}
        />
        {/* Public */}
        <Route path="view-resume" element={<ViewResume />} />
        
        
        {/* Candidate */}

        <Route path="" element={<CandidateLayout role="candidate" />}>
          <Route element={<HasHero />}>
            <Route index element={<CandidateHome />} />
            <Route path="events" element={<CandidateEvent />} />
          </Route>
          <Route path="about-us" element={<AboutUs />} />
          <Route path="events/:id" element={<CandidateEventDetail />} />
          <Route
            path="positions/:positionID"
            element={<CandidatePositionDetail />}
          />
          <Route path="info" element={<CandidateInfo />} />
          <Route path="create-resume" element={<CandidateCreateResume />} />
          <Route path="manage-resumes" element={<CandidateResume />} />
          <Route
            path="edit-resume/:resumeID"
            element={<CandidateEditResume />}
          />
          <Route path="history" element={<CandidateInterviewHistory />} />
        </Route>

        {/* Interviewer */}
        <Route element={<PrivateRoute role="interviewer" />}>
          <Route
            path="interviewer"
            element={<ManagerLayout role="interviewer" />}
          >
            <Route index element={<InterviewerHome />} />
            <Route path="info" element={<InterviewerInfo />} />
            <Route
              path="manage-question"
              element={<InterviewerManageQuestion />}
            />
            <Route
              path="interviews/:interviewId"
              element={<InterviewerScore />}
            />
            <Route path="history" element={<InterviewerHistory />} />
          </Route>
        </Route>

        {/* Recruiter */}

        <Route element={<PrivateRoute role="recruiter" />}>
          <Route path="recruiter" element={<ManagerLayout role="recruiter" />}>
            <Route index element={<RecruiterHome />} />
            <Route path="info" element={<RecruiterInfo />} />
            <Route path="event" element={<RecruiterEvent />} />
            <Route path="event/:id" element={<RecruiterViewEventDetail />} />
            <Route
              path="event/create"
              element={<RecruiterEventDetail classify={"add"} />}
            />
            <Route
              path="event/edit/:id"
              element={<RecruiterEventDetail classify={"edit"} />}
            />
            <Route
              path="positions/:positionID"
              element={<RecruiterPositionDetail />}
            />
            <Route
              path="positions/create-position"
              element={<RecruiterCreatePosition />}
            />
            <Route
              path="positions/update-position/:positionId"
              element={<RecruiterUpdatePosition />}
            />

            <Route
              path="interviews/:interviewId"
              element={<RecruiterScore />}
            />
            <Route path="history" element={<RecruiterHistory />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="admin" element={<ManagerLayout role="admin" />}>
            <Route index element={<AdminHome />} />
            <Route
              path="positions/:positionID"
              element={<AdminPositionDetail />}
            />
            <Route path="accounts" element={<AdminManageAccount />} />
            <Route path="accounts/:id" element={<ViewUserInfo />}></Route>
            <Route path="general" element={<>manage general</>} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="info" element={<AdminInfo />} />
            <Route
              path="positions/:positionID/:candidateID"
              element={<AdminScore />}
            />

            <Route path="recruiter">
              <Route index element={<RecruiterHome />} />
              <Route path="event" element={<RecruiterEvent />} />
              <Route path="event/:id" element={<RecruiterEventDetail />} />
              <Route path="event/create" element={<RecruiterEventDetail />} />
              <Route
                path="positions/:positionID"
                element={<RecruiterPositionDetail />}
              />
              <Route
                path="positions/create-position"
                element={<RecruiterCreatePosition />}
              />
              <Route
                path="positions/update-position"
                element={<RecruiterUpdatePosition />}
              />
              <Route
                path="interviews/:interviewId"
                element={<RecruiterScore />}
              />
              <Route path="history" element={<RecruiterHistory />} />
            </Route>

            <Route path="interviewer">
              <Route index element={<InterviewerHome />} />
              <Route
                path="manage-question"
                element={<InterviewerManageQuestion />}
              />
              <Route
                path="interviews/:interviewId"
                element={<InterviewerScore />}
              />
              <Route path="history" element={<InterviewerHistory />} />
            </Route>
          </Route>
        </Route>
        <Route path="/Callback" element={<Callback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
