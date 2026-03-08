import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Landing from './pages/Landing';
import MainLayout from './components/layout/MainLayout';
import MarketAnalytics from './pages/MarketAnalytics';
import Marketplace from './pages/Marketplace';
import SmartSell from './pages/SmartSell';
import MyOrders from './pages/MyOrders';
import MyListings from './pages/MyListings';
const AuthenticatedLayout = () => {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

function App() {
    return (
        <ThemeProvider>
            <Router>
                { }
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <Routes>
                    { }
                    <Route path='/' element={
                        <>
                            { }
                            <Landing />
                        </>
                    } />
                    <Route path='/login' element={
                        <>
                            { }
                            <Login />
                        </>
                    } />
                    <Route path='/register' element={
                        <>
                            { }
                            <Register />
                        </>
                    } />
                    { }
                    <Route element={<AuthenticatedLayout />}>
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/analytics' element={<MarketAnalytics />} />
                        <Route path='/marketplace' element={<Marketplace />} />
                        <Route path='/smart-sell' element={<SmartSell />} />
                        <Route path='/orders' element={<MyOrders />} />
                        <Route path='/my-listings' element={<MyListings />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}
export default App;
