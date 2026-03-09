import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
const Dashboard = lazy(() => import('./pages/Dashboard'))
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'))
import PrivateRoute from './components/PrivateRoute'
const LeaseManagement = lazy(() => import('./pages/LeaseManagement'))
const LeaseDetail = lazy(() => import('./pages/LeaseDetail'))
const DocumentPreview = lazy(() => import('./pages/DocumentPreview'))
const ViewNotes = lazy(() => import('./pages/ViewNotes'))
import './App.css'
import Layout from './components/Layout';
const RegulationManagement = lazy(() => import('./pages/RegulationManagement'))
const RegulationDetail = lazy(() => import('./pages/RegulationDetail'))
const ViewRegulationChat = lazy(() => import('./pages/ViewRegulationChat'))
const RentalManagement = lazy(() => import('./pages/RentalManagement'))

const App: React.FC = () => {
  return (
    <Suspense fallback={<p role="status" className="p-8 text-slate-600">Loading workspace…</p>}><Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/update-password/:id" element={<PrivateRoute><UpdatePassword /></PrivateRoute>} />
      <Route
        path="/leases"
        element={
          <PrivateRoute>
            <LeaseManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/lease/:id"
        element={
          <PrivateRoute>
            <LeaseDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/preview/:documentId"
        element={
          <PrivateRoute>
            <Layout>
            <DocumentPreview />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/lease/:id/documents/:documentId/notes"  // Updated route for ViewNotes using documentId
        element={
          <PrivateRoute>
            <ViewNotes />
          </PrivateRoute>
        }
      />
      <Route
        path="/regulations"
        element={
          <PrivateRoute>
            <RegulationManagement />  {/* Added Regulation Management Route */}
          </PrivateRoute>
        }
      />
      <Route
        path="/regulation/:id"
        element={
          <PrivateRoute>
            <RegulationDetail />  {/* Added Regulation Detail Route */}
          </PrivateRoute>
        }
      />
      <Route
        path="/regulation/:regulationId/chat"
        element={
          <PrivateRoute>
            <ViewRegulationChat />  {/* Updated Regulation Chat Route */}
          </PrivateRoute>
        }
      />
      <Route path="/rental-analyzer" element={
          <PrivateRoute>
            <RentalManagement />
          </PrivateRoute>
        }
      />

    </Routes></Suspense>
  )
}

export default App
