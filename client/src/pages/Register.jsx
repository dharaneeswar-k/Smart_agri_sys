import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import { GlassCard, GlassButton, GlassInput } from '../components/ui/Glass';
import PageTransition from '../components/ui/PageTransition';
function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'farmer', 
    });
    const { name, email, password, confirmPassword, role } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess || user) {
            navigate('/dashboard');
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            const userData = {
                name,
                email,
                password,
                role,
            };
            dispatch(register(userData));
        }
    };
    if (isLoading) {
        return <Spinner />;
    }
    return (
        <PageTransition className="min-h-screen flex items-center justify-center relative">
            {}
            <div className="absolute top-6 left-6 z-20">
                <div
                    onClick={() => navigate('/')}
                    className='cursor-pointer text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-agri-green to-agri-neon tracking-wide hover:opacity-80 transition-opacity'
                >
                    AgriSmart
                </div>
            </div>
            <GlassCard className="w-full max-w-md p-8">
                <section className="text-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
                        <FaUser className="text-agri-neon" /> Register
                    </h1>
                    <p className="text-gray-300">Create an account</p>
                </section>
                <section className="form">
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <div className="form-group">
                            <GlassInput
                                type="text"
                                name="name"
                                value={name}
                                placeholder="Enter your name"
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <GlassInput
                                type="email"
                                name="email"
                                value={email}
                                placeholder="Enter your email"
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <GlassInput
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Enter password"
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <GlassInput
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                placeholder="Confirm password"
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Select Role</label>
                            <select
                                name="role"
                                value={role}
                                onChange={onChange}
                                className="glass-input w-full"
                            >
                                <option value="farmer" className="bg-slate-800">Farmer</option>
                                <option value="buyer" className="bg-slate-800">Buyer</option>
                            </select>
                        </div>
                        <GlassButton type="submit" className="w-full justify-center mt-4">
                            Register
                        </GlassButton>
                    </form>
                </section>
            </GlassCard>
        </PageTransition>
    );
}
export default Register;
