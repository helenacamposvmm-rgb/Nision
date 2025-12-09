import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateSite from './pages/CreateSite';
import Settings from './pages/Settings';
import MyProjects from './pages/MyProjects';
import CreateContacts from './pages/CreateContacts';
import CreateContracts from './pages/CreateContracts';
import FindClients from './pages/FindClients';
import GenerateApproach from './pages/GenerateApproach';
import Academy from './pages/Academy';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-site" element={<CreateSite />} />
          <Route path="/create-contacts" element={<CreateContacts />} />
          <Route path="/find-clients" element={<FindClients />} />
          <Route path="/create-contracts" element={<CreateContracts />} />
          <Route path="/generate-approach" element={<GenerateApproach />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;