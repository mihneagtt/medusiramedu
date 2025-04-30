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
import ClientDetails from "./pages/ClientDetails";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginScreen from "./pages/Login";
import EquipmentDetails from "./pages/EquipmentDetails";

const CLIENT_ID =
  "364505970546-l0ca5j0vqiltlgm23rvl75h34agl0daj.apps.googleusercontent.com";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<div>Dashboard</div>} />
            <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
            <Route path={ROUTES.ADD_CLIENT} element={<AddClient />} />
            <Route path={ROUTES.ADD_EQUIPMENT} element={<AddEquipment />} />
            <Route path={ROUTES.ADD_PART} element={<AddPart />} />
            <Route path={ROUTES.ADD_SUPPLIER} element={<AddSupplier />} />
            <Route path={ROUTES.ADD_SERVICE_REPORT} element={<AddReport />} />
            <Route path={ROUTES.CLIENTS} element={<Clients />} />
            <Route path={`${ROUTES.CLIENTS}/:id`} element={<ClientDetails />} />
            <Route path={ROUTES.EQUIPMENT} element={<Equipment />} />
            <Route
              path={`${ROUTES.EQUIPMENT}/:id`}
              element={<EquipmentDetails />}
            />
            <Route path={ROUTES.PARTS} element={<Parts />} />
            <Route path={ROUTES.REPORTS} element={<Reports />} />
          </Routes>
        </main>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
