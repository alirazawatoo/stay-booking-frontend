import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Workspace pages load as separate chunks so the login page stays small.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const LeaseManagement = lazy(() => import('./pages/LeaseManagement'));
const LeaseDetail = lazy(() => import('./pages/LeaseDetail'));
const DocumentPreview = lazy(() => import('./pages/DocumentPreview'));
const ViewNotes = lazy(() => import('./pages/ViewNotes'));
const RegulationManagement = lazy(() => import('./pages/RegulationManagement'));
const NewRegulationSearch = lazy(() => import('./pages/NewRegulationSearch'));
const ViewRegulationChat = lazy(() => import('./pages/ViewRegulationChat'));
const RentalManagement = lazy(() => import('./pages/RentalManagement'));

const privateRoutes: { path: string; element: React.ReactNode }[] = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/update-password/:id', element: <UpdatePassword /> },
  { path: '/leases', element: <LeaseManagement /> },
  { path: '/lease/:id', element: <LeaseDetail /> },
  {
    path: '/preview/:documentId',
    element: (
      <Layout>
        <DocumentPreview />
      </Layout>
    ),
  },
  { path: '/lease/:id/documents/:documentId/notes', element: <ViewNotes /> },
  { path: '/regulations', element: <RegulationManagement /> },
  { path: '/regulation/new', element: <NewRegulationSearch /> },
  { path: '/regulation/:regulationId/chat', element: <ViewRegulationChat /> },
  { path: '/rental-analyzer', element: <RentalManagement /> },
];

const App: React.FC = () => (
  <Suspense
    fallback={
      <p role="status" className="p-8 text-slate-600">
        Loading workspace…
      </p>
    }
  >
    <Routes>
      <Route path="/" element={<Login />} />
      {privateRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
      ))}
    </Routes>
  </Suspense>
);

export default App;
