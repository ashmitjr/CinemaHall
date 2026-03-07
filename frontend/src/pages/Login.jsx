import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import api from "../services/api";
import { PageTransition } from "../components/common/PageTransition";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", formData);
      dispatch(setCredentials(res.data.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "AUTHENTICATION FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.h1
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
              className="font-display text-8xl md:text-9xl mb-12 tracking-tighter uppercase text-center"
            >
              Sign In
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </motion.div>
              <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
                <Input
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </motion.div>

              {error && (
                <motion.p
                  variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
                  className="font-mono text-[10px] text-danger uppercase text-center"
                >
                  {error}
                </motion.p>
              )}

              <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
                <Button type="submit" className="w-full py-5 text-xl" disabled={loading}>
                  {loading ? "AUTHENTICATING..." : "ENTER CINEMA"}
                </Button>
              </motion.div>
            </form>

            <motion.p
              variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
              className="mt-12 text-center font-mono text-[10px] text-muted uppercase tracking-widest"
            >
              New to the archive?{" "}
              <Link to="/register" className="text-accent hover:underline">
                Create Account
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
