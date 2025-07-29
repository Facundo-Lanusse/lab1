import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/LogIn.module.css";
import axios from "axios";

const LogIn = () => {
  const [email, setEmail] = useState(""); //useState se usa para guardar estados de las variables
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); //para navegar entre links

  useEffect(() => {
    //Igual a las líneas de home
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/Home");
    }
  }, [navigate]);

  function randomString(length = 5) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + "@example.com";
  }

  function randomNumberString(length = 4) {
    const digits = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
  }

  const handleLogin = async (isGuest) => {
    setError("");
    try {
      if (isGuest) {
        await createGuestUser();
        return;
      }

      // Resto del código para login normal...
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/Home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Error connecting to the server");
      console.error("Fetch error:", error);
    }
  };

  const createGuestUser = async () => {
    try {
      const guestId = Math.floor(Math.random() * 900000) + 100000;
      const guestUsername = `Guest_${guestId}`;

      // Insertar guest en la base de datos
      const response = await axios.post(
        "http://localhost:3000/api/create-guest",
        {
          user_id: guestId,
          username: guestUsername,
          password: "guest_password",
        }
      );

      if (response.data.success) {
        const guestData = {
          user_id: guestId,
          username: guestUsername,
          email: null,
          is_admin: false,
          isGuest: true,
        };

        localStorage.setItem("user", JSON.stringify(guestData));
        navigate("/Home");
      }
    } catch (error) {
      console.error("Error creando usuario guest:", error);
      setError("Error al crear usuario invitado");
    }
  };

  return (
    <div className={styles.logIn}>
      <img
        className={styles.arrowLeftSolid1Icon}
        alt="Go back"
        src="arrow-left-solid.svg"
        onClick={() => navigate("/")}
      />
      <img
        className={styles.loginImageIcon}
        alt="Login visual"
        src="login_image.svg"
      />
      <b className={styles.loginPage}>Inicio de Sesión</b>

      <div className={styles.rectangleGroup}>
        <input
          type="email"
          className={styles.inputField}
          placeholder="Enter email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.rectangleGroup}>
        <input
          type="password"
          className={styles.inputField}
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.forgotPassword}>Olvidaste tu contraseña?</div>

      <button className={styles.logInButton} onClick={() => handleLogin(false)}>
        Iniciar sesión
      </button>

      <div>
        <button
          className={styles.logInButton}
          onClick={() => handleLogin(true)}
        >
          Iniciar como invitado
        </button>
      </div>
    </div>
  );
};

export default LogIn;
