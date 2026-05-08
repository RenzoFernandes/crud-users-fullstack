import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      alert("Login successful!");

      await fetchUsers();
    } catch (error) {
      console.error(error);

      alert("Invalid email or password");
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3000/users", {
        name,
        email: newUserEmail,
        phone,
        password: newUserPassword,
      });

      alert("User created successfully!");

      setName("");
      setNewUserEmail("");
      setPhone("");
      setNewUserPassword("");

      await fetchUsers();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.error || "Error creating user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User deleted successfully!");

      await fetchUsers();
    } catch (error) {
      console.error(error);

      alert("Error deleting user");
    }
  };

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/users/${editingUserId}`,
        {
          name: editName,
          email: editEmail,
          phone: editPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("User updated successfully!");

      setEditingUserId(null);
      setEditName("");
      setEditEmail("");
      setEditPhone("");

      await fetchUsers();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.error || "Error updating user");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <hr />

      <hr />

      <h2>Create User</h2>

      <form onSubmit={handleCreateUser}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={newUserEmail}
          onChange={(event) => setNewUserEmail(event.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={newUserPassword}
          onChange={(event) => setNewUserPassword(event.target.value)}
        />

        <br />
        <br />

        <button type="submit">Create User</button>
      </form>

      <h2>Users</h2>

      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>

          <button onClick={() => handleDeleteUser(user.id)}>Delete</button>

          <button onClick={() => handleStartEdit(user)}>Edit</button>

          <hr />
        </div>
      ))}

      {editingUserId && (
        <>
          <hr />

          <h2>Edit User</h2>

          <form onSubmit={handleUpdateUser}>
            <input
              type="text"
              placeholder="Name"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
            />

            <br />
            <br />

            <input
              type="email"
              placeholder="Email"
              value={editEmail}
              onChange={(event) => setEditEmail(event.target.value)}
            />

            <br />
            <br />

            <input
              type="text"
              placeholder="Phone"
              value={editPhone}
              onChange={(event) => setEditPhone(event.target.value)}
            />

            <br />
            <br />

            <button type="submit">Save Changes</button>

            <button type="button" onClick={() => setEditingUserId(null)}>
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
