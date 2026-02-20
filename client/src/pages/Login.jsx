import { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import { GlassCard, GlassButton, GlassInput } from '../components/ui/Glass';
import PageTransition from '../components/ui/PageTransition';
function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { email, password } = formData;
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
        const userData = {
            email,
            password,
        };
        dispatch(login(userData));
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
                        <FaSignInAlt className="text-agri-neon" /> Login
                    </h1>
                    <p className="text-gray-300">Login to start trading</p>
                </section>
                <section className="form">
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
                        <GlassButton type="submit" className="w-full justify-center mt-4">
                            Submit
                        </GlassButton>
                    </form>
                </section>
            </GlassCard>
        </PageTransition>
    );
}
export default Login;
