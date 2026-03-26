// client/src/App.jsx
import React, { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Signin';
import Register from './pages/Auth/Register';
import InstitutionRegister from './pages/Auth/IntitutionRegistration';
import PendingApprovalPage from './pages/Auth/PendingApproval';
import VerifyEmailPage from './pages/Auth/VerifyEmail';
import StudentHome from './pages/Student/Home/Home';
import AdminHome from './pages/Admin/Home';
import PendingUsersPage from './pages/Admin/PendingUsers';
import FacultyHome from './pages/Faculty/Home';

import { refreshAccessToken, getAllInstitutions } from './api/auth.api';
import { setUser, logout } from './store/slice/auth.slice';
import { setInstitutions } from './store/slice/institution.slice';
import { ProtectedRoute, GuestRoute } from './routes/AuthRoutes';
import { PracticePage } from './pages/Student/Practice/PracticePage';
import { StudentTests } from './pages/Student/Tests/TestsPage';
import StudentSubmissions from './pages/Student/Submissions/StudentSubmissions';
import { StudentAnalytics } from './pages/Student/Analytics/StudentAnalytics';
import LeaderboardActions from './components/dashboard/Student/LeaderboardActions';
import ProblemWorkspace from './pages/Student/Practice/ProblemWorkspace';
import { connectSocket } from './socket/socket';
const App = () => {
  const dispatch = useDispatch();

  const refreshCalledRef = useRef(false);

  useEffect(() => {
    if (refreshCalledRef.current) return;
    refreshCalledRef.current = true;

    const restoreSession = async () => {
      try {
        const apiRes = await refreshAccessToken();
        const { accessToken, user } = apiRes.data;
        dispatch(setUser({ user, token: accessToken, role: user.role }));
        connectSocket(accessToken);
      } catch {
        // No valid cookie → guest session, that's fine
        dispatch(logout());
      }
    };

    const loadInstitutions = async () => {
      try {
        const apiRes = await getAllInstitutions();
        dispatch(setInstitutions(apiRes));
      } catch {
        console.warn('Could not load institutions');
      }
    };

    Promise.all([restoreSession(), loadInstitutions()]);
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/auth/signin"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/auth/register-institution"
        element={
          <GuestRoute>
            <InstitutionRegister />
          </GuestRoute>
        }
      />
      <Route
        path="/auth/verify-email/:token"
        element={
          <GuestRoute>
            <VerifyEmailPage />
          </GuestRoute>
        }
      />

      <Route
        path="/pending-approval"
        element={
          <ProtectedRoute>
            <PendingApprovalPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/practice"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PracticePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentTests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/submissions"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/analytics"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/leaderboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <LeaderboardActions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/practice/:problemSlug"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <ProblemWorkspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles={['FACULTY']}>
            <FacultyHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pending-users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PendingUsersPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
