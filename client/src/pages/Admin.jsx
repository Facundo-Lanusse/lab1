import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Admin() {

    const navigate = useNavigate();

    useEffect(() => { //Igual a las líneas de home
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.is_admin) {
            navigate('/home');
        }
        else {
            fetchUsers();
        }
    }, [navigate]);

    const [users, setUsers] = useState([]);



    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/users",
                {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
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
                        <button onClick={() => deleteUser(user.user_id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Admin;
