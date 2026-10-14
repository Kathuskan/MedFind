import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Medicine Seeker Pages
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Results } from './pages/Results';
import { PharmacyDetails } from './pages/PharmacyDetails';
import { AvailabilityConfirmation } from './pages/AvailabilityConfirmation';
import { MultipleMedicineSearch } from './pages/MultipleMedicineSearch';
import { PrescriptionUpload } from './pages/PrescriptionUpload';
import { Login } from './pages/Login';
import { HelpAndContact } from './pages/HelpAndContact';

// Pharmacy Staff Portal Pages
import { PharmacyRegistration } from './pages/pharmacy/PharmacyRegistration';
import { PharmacyDashboard } from './pages/pharmacy/Dashboard';
import { PharmacyInventory } from './pages/pharmacy/Inventory';
import { QuickStockUpdate } from './pages/pharmacy/QuickStockUpdate';
import { Enquiries } from './pages/pharmacy/Enquiries';
import { Holds } from './pages/pharmacy/Holds';
import { PharmacySettings } from './pages/pharmacy/Settings';
import { PharmacyAnalytics } from './pages/pharmacy/Analytics';

// Administrator Portal Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminPharmacies } from './pages/admin/Pharmacies';
import { AdminMedicineCatalogue } from './pages/admin/MedicineCatalogue';
import { AdminInventoryMonitoring } from './pages/admin/InventoryMonitoring';
import { AdminUsers } from './pages/admin/Users';
import { AdminReports } from './pages/admin/Reports';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Medicine Seeker Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/results" element={<Results />} />
      <Route path="/pharmacies/:id" element={<PharmacyDetails />} />
      <Route path="/pharmacy/:id" element={<PharmacyDetails />} />
      <Route path="/requests/:id" element={<AvailabilityConfirmation />} />
      <Route path="/medicine-list" element={<MultipleMedicineSearch />} />
      <Route path="/prescription/upload" element={<PrescriptionUpload />} />
      <Route path="/prescription/review" element={<PrescriptionUpload />} />
      <Route path="/prescription/results" element={<PrescriptionUpload />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
      <Route path="/help" element={<HelpAndContact />} />

      {/* 2. Pharmacy Staff Pages */}
      <Route path="/pharmacy/register" element={<PharmacyRegistration />} />
      <Route path="/pharmacy" element={<Navigate to="/pharmacy/dashboard" replace />} />
      <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
      <Route path="/pharmacy/inventory" element={<PharmacyInventory />} />
      <Route path="/pharmacy/stock-update" element={<QuickStockUpdate />} />
      <Route path="/pharmacy/stock" element={<QuickStockUpdate />} />
      <Route path="/pharmacy/enquiries" element={<Enquiries />} />
      <Route path="/pharmacy/holds" element={<Holds />} />
      <Route path="/pharmacy/settings" element={<PharmacySettings />} />
      <Route path="/pharmacy/analytics" element={<PharmacyAnalytics />} />

      {/* 3. Administrator Pages */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/pharmacies" element={<AdminPharmacies />} />
      <Route path="/admin/medicines" element={<AdminMedicineCatalogue />} />
      <Route path="/admin/inventory" element={<AdminInventoryMonitoring />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/reports" element={<AdminReports />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
