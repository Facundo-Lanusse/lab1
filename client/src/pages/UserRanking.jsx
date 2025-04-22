import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function UserRanking() {
    const navigate = useNavigate();

    useEffect(() => { //Igual a las líneas de home
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
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


    return (
        <div>
            <h2>Ranking de Usuarios</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} ({user.rank_points})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserRanking;