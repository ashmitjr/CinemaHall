import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { PageTransition } from "../../components/common/PageTransition";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useSelector } from "react-redux";
import { Ban, CheckCircle, Trash2 } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = useSelector((s) => s.auth.user);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch (error) {
      console.error("Users fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (user) => {
    try {
      await api.patch(`/admin/users/${user.id}/ban`);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isBanned: !u.isBanned } : u));
    } catch (error) { console.error("Toggle ban error:", error); }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setIsModalOpen(false);
    } catch (error) { console.error("Delete user error:", error); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-mono text-accent animate-pulse">SCANNING DATABASE...</div>;

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="container mx-auto">
          <h1 className="font-display text-8xl md:text-[10rem] mb-12 uppercase tracking-tighter leading-none">Users</h1>
          <div className="bg-surface border border-border overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="p-6 uppercase tracking-widest text-muted">Name</th>
                  <th className="p-6 uppercase tracking-widest text-muted">Email</th>
                  <th className="p-6 uppercase tracking-widest text-muted">Role</th>
                  <th className="p-6 uppercase tracking-widest text-muted">Status</th>
                  <th className="p-6 uppercase tracking-widest text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="p-6 font-display text-2xl uppercase tracking-tight">{user.name}</td>
                    <td className="p-6 text-muted">{user.email}</td>
                    <td className="p-6"><Badge variant={user.role === "admin" ? "accent" : "outline"}>{user.role}</Badge></td>
                    <td className="p-6">
                      {user.isBanned
                        ? <Badge variant="danger">Banned</Badge>
                        : <Badge className="text-green-500 border-green-500">Active</Badge>}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button disabled={user.id === currentUser?.id} onClick={() => handleToggleBan(user)}
                          className={`p-2 border border-border transition-all ${user.isBanned ? "text-green-500 hover:border-green-500" : "text-danger hover:border-danger"} disabled:opacity-20`}>
                          {user.isBanned ? <CheckCircle size={14} /> : <Ban size={14} />}
                        </button>
                        <button disabled={user.id === currentUser?.id}
                          onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                          className="p-2 border border-border hover:border-danger text-muted hover:text-danger transition-all disabled:opacity-20">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Delete User">
        <div className="space-y-8">
          <p className="font-body text-muted">
            DELETE USER <span className="text-white">"{selectedUser?.name?.toUpperCase()}"</span>? THIS CANNOT BE UNDONE.
          </p>
          <div className="flex gap-4">
            <Button variant="danger" className="flex-grow" onClick={handleDelete}>DELETE USER</Button>
            <Button variant="outline" className="flex-grow" onClick={() => setIsModalOpen(false)}>CANCEL</Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
};

export default ManageUsers;
