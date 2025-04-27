// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./Constants";
import Navigation from "./Navigation";
import AddClient from "./pages/admin/AddClient";
import AddEquipment from "./pages/admin/AddEquipment";
import AddPart from "./pages/admin/AddPart";
import AddSupplier from "./pages/admin/AddSupplier";
import AddReport from "./pages/AddReport";
import Clients from "./pages/Clients";
import Equipment from "./pages/Equipment";
import Parts from "./pages/Parts";
import Reports from "./pages/Reports";

const App = () => {
  return (
    <Router>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route path={ROUTES.ADD_CLIENT} element={<AddClient />} />
          <Route path={ROUTES.ADD_EQUIPMENT} element={<AddEquipment />} />
          <Route path={ROUTES.ADD_PART} element={<AddPart />} />
          <Route path={ROUTES.ADD_SUPPLIER} element={<AddSupplier />} />
          <Route path={ROUTES.ADD_SERVICE_REPORT} element={<AddReport />} />
          <Route path={ROUTES.CLIENTS} element={<Clients />} />
          <Route path={ROUTES.EQUIPMENT} element={<Equipment />} />
          <Route path={ROUTES.PARTS} element={<Parts />} />
          <Route path={ROUTES.REPORTS} element={<Reports />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
