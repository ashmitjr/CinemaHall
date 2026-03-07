import React, { useEffect, useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, CheckCircle, Trash2, ShieldAlert } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBan = async (id: string, isBanned: boolean) => {
    try {
      await api.patch(`/admin/users/${id}`, { isBanned: !isBanned });
      setUsers(users.map(u => u._id === id ? { ...u, isBanned: !isBanned } : u));
    } catch (error) {
      console.error("Error toggling ban:", error);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("ARE YOU SURE? THIS ACTION IS IRREVERSIBLE.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-mono text-accent animate-pulse">
      SCANNING DATABASE...
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 md:px-12 py-12 min-h-screen"
    >
      <h1 className="text-6xl md:text-8xl mb-12">MANAGE USERS</h1>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="p-6 uppercase tracking-widest">Username</th>
              <th className="p-6 uppercase tracking-widest">Email</th>
              <th className="p-6 uppercase tracking-widest">Role</th>
              <th className="p-6 uppercase tracking-widest">Status</th>
              <th className="p-6 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-border hover:bg-white/5 transition-colors">
                <td className="p-6">{user.username}</td>
                <td className="p-6 text-gray-400">{user.email}</td>
                <td className="p-6">
                  <span className={`px-2 py-1 ${user.role === 'admin' ? 'bg-accent text-black' : 'bg-border text-white'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-6">
                  {user.isBanned ? (
                    <span className="text-red-500 flex items-center gap-2">
                      <Ban size={14} /> BANNED
                    </span>
                  ) : (
                    <span className="text-green-500 flex items-center gap-2">
                      <CheckCircle size={14} /> ACTIVE
                    </span>
                  )}
                </td>
                <td className="p-6 text-right">
                  {user._id !== currentUser?.id ? (
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => toggleBan(user._id, user.isBanned)}
                        className={`p-2 border ${user.isBanned ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}
                        title={user.isBanned ? "Unban User" : "Ban User"}
                      >
                        {user.isBanned ? <CheckCircle size={16} /> : <Ban size={16} />}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 border border-gray-500 text-gray-500 hover:bg-white hover:text-black"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-600 italic">SELF (PROTECTED)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ManageUsers;
