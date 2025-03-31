import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/users");
            setUsers(res.data);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error al eliminar usuario", error);
        }
    };

    return (
        <div>
            <h2>Administración de Usuarios</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} ({user.email})
                        <button onClick={() => deleteUser(user.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Admin;
