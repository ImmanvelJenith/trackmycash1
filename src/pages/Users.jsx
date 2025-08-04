import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3007/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => console.log("Error"));
  }, []);

  return (
    <div>
      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} – {user.email} – {user.password}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
