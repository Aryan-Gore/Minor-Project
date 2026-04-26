import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "./Component/Login.jsx";

/* ADMIN */
import Admin from "./Component/Admin.jsx";
import AdminDashboard from "./Component/Admin-feature/AdminDashboard.jsx";
import VillageManagement from "./Component/Admin-feature/VillageManagement.jsx";
import AdminRecommendations from "./Component/Admin-feature/AdminRecommendations.jsx";
import MelaScheduling from "./Component/Admin-feature/MelaScheduling.jsx";
import AdminUploadHistory from "./Component/Admin-feature/AdminUploadHistory.jsx";
import UserManagement from "./Component/Admin-feature/UserManagement.jsx";
import AdminVillageDetail from "./Component/Admin-feature/AdminVillageDetail.jsx";

/* USER */
import User from "./Component/features/User.jsx";
import Upload from "./Component/features/Upload.jsx";
import UploadHistory from "./Component/features/UploadHistory.jsx";
import Villages from "./Component/features/Villages.jsx";
import VillageDetail from "./Component/features/VillageDetail.jsx";
import Recommendations from "./Component/features/Recommendations.jsx";
import Melas from "./Component/features/Melas.jsx";
import Reports from "./Component/features/Reports.jsx";
import DownloadPDF from "./Component/features/DownloadPDF.jsx";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      {/* ================= ADMIN ================= */}
      <Route path="/admin" element={<Admin />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="villages" element={<VillageManagement />} />
        <Route path="villages/:id" element={<AdminVillageDetail />} />
        <Route path="recommendations" element={<AdminRecommendations />} />
        <Route path="mela" element={<MelaScheduling />} />
        <Route path="upload-history" element={<AdminUploadHistory />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* ================= USER (FIXED) ================= */}
      <Route path="/user" element={<User />}>
        <Route index element={<Navigate to="upload" replace />} />

        <Route path="upload" element={<Upload />} />
        <Route path="history" element={<UploadHistory />} />
        <Route path="villages" element={<Villages />} />
        <Route path="villages/:id" element={<VillageDetail />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="melas" element={<Melas />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/pdf" element={<DownloadPDF />} />
      </Route>

    </Routes>
  );
}

export default App;