import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [usage, setUsage] = useState({});
  const [roleEdit, setRoleEdit] = useState({});

  useEffect(() => {
    API.get('/users').then(res => setUsers(res.data));
    API.get('/admin/usage').then(res => setUsage(res.data));
  }, []);

  const handleRoleChange = (userId, role) => {
    API.put(`/admin/user/${userId}/role`, { role }).then(() => {
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
      setRoleEdit({});
    });
  };

  const handleDelete = userId => {
    API.delete(`/admin/user/${userId}`).then(() => {
      setUsers(users.filter(u => u._id !== userId));
    });
  };

  return (
    <div className="container">
      <h3>Admin Panel</h3>
      <div className="mb-3">Users: {usage.users} | Trips: {usage.trips}</div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {roleEdit[u._id]
                  ? (
                    <select className="form-select" value={u.role}
                      onChange={e => handleRoleChange(u._id, e.target.value)}>
                      <option>Traveller</option>
                      <option>Admin</option>
                    </select>
                  )
                  : (
                    <>
                      {u.role}
                      <button className="btn btn-link btn-sm ms-2"
                        onClick={() => setRoleEdit({ ...roleEdit, [u._id]: true })}>Edit</button>
                    </>
                  )}
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
// This AdminPanel component allows administrators to manage users and view system usage statistics.
// It displays a list of users with options to change their roles and delete accounts.
// It also shows the total number of users and trips in the system.