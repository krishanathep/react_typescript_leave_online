import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

import WithNavbar from "./layouts/WithNavbar";
import WithOutNavbar from "./layouts/WithOutNavbar";

import Signin from "./pages/auth/signin";
import Home from "./pages/home";

import Products from "./pages/products";
import ProductDetail from "./pages/products/detail";

import Blogs from "./pages/blogs";
import BlogCreate from "./pages/blogs/create";
import BlogUpdate from './pages/blogs/update'

import Meeting from './pages/mettings/'
import MeetingCreate from './pages/mettings/create'
import MeetingUpdate from './pages/mettings/update'
import MeetingView from './pages/mettings/view'

import Overtime from './pages/overtime'
import OvertimeView from './pages/overtime/view'
import OvertimeCreate from "./pages/overtime/create";
import OvertimeUpdate from "./pages/overtime/update";

import LeaveList from './pages/eleave'
import LeaveView from './pages/eleave/view'

// ถ้าไม่มีการ login จะไม่สามารถเข้าใช้งานได้และ redirect ไปหน้า login
const RequireAuth: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};

const RoutesPage: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<WithOutNavbar />}>
          <Route path="/auth/signin" element={<Signin />} />
        </Route>
        <Route element={<RequireAuth />}> 
          <Route element={<WithNavbar />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/detail/:id" element={<ProductDetail />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/create" element={<BlogCreate />} />
            <Route path="/blogs/update/:id" element={<BlogUpdate/>}/>
            <Route path="/meetings" element={<Meeting/>}/>
            <Route path="/meetings/create" element={<MeetingCreate />} />
            <Route path="/meetings/update/:id" element={<MeetingUpdate />} />
            <Route path="/meetings/view/:id" element={<MeetingView />} />
            <Route path="/overtime" element={<Overtime/>}/>
            <Route path="/overtime/view/:id" element={<OvertimeView/>}/>
            <Route path="/overtime/create" element={<OvertimeCreate/>}/>
            <Route path="/overtime/update/:id" element={<OvertimeUpdate/>}/>
            <Route path="/leave" element={<LeaveList/>}/>
            <Route path="/leave/view/:id" element={<LeaveView/>}/>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default RoutesPage;
