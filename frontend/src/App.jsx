import { Routes, Route } from "react-router-dom";
import Login from "./Component/Login.jsx";
import Admin from "./Component/Admin.jsx";
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
      <Route path="/admin" element={<Admin />} />

      {/* 👇 USER LAYOUT */}
      <Route path="/user" element={<User />}>

        <Route path="upload" element={<Upload />} />
        <Route path="history" element={<UploadHistory />} />
        <Route path="villages" element={<Villages />} />
        <Route path="villages/:id" element={<VillageDetail />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="melas" element={<Melas />} />F            
        <Route path="reports" element={<Reports />} />
        <Route path="reports/pdf" element={<DownloadPDF />} />

      </Route>

    </Routes>
  );
}

export default App;                                                