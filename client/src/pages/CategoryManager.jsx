import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import styles from "./css/SignUp.module.css";
import { useNavigate } from "react-router-dom";
import styles2 from "./css/SuggestionList.module.css";
import BackButton from "../components/BackButton";

const CreateCategory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchCategories().then();
    if (!user) {
      navigate("/Home");
    }
  }, [navigate]);

  const [form, setForm] = useState({ name: "" });
  const [modifyForm, setModifyForm] = useState({ newName: "", oldName: "" });
  const [message, setMessage] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [suggestedCategory, setSuggestedCategories] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/CreateCategory",
        form
      );
      setMessage(`Categoria creada con éxito.`);
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error en el registro");
    }
  }, [form]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/FetchCategories"
      );
      const name = response.data.map((cat) => cat.name);
      setAllCategories(name);
    } catch (err) {
      console.error("Error al traer categorias", err);
    }
  };

  const handleModifyChange = (e) => {
    const { name, value } = e.target;
    setModifyForm({ ...modifyForm, [e.target.name]: e.target.value });
    if (name === "oldName") {
      const filter = allCategories.filter((cat) =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedCategories(filter);
    }
  };

  const handleSuggestionClick = (cat) => {
    const normalizedCat = cat.trim().toLowerCase();
    setModifyForm({ ...modifyForm, oldName: normalizedCat });
    setSuggestedCategories([]);
  };

  const handleModifySubmit = useCallback(async () => {
    try {
      await axios.post("http://localhost:3000/api/ModifyCategory", modifyForm);
      setMessage("Categoría modificada con éxito.");

      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error en el registro");
    }
  }, [modifyForm]);

  const handleNewChange = (e) => {
    setModifyForm({ ...modifyForm, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.signUp}>
      <b className={styles.signUpPage}>Create category</b>

      <div className={styles.rectangleGroup}>
        <input
          className={styles.frameChild}
          type="text"
          name="name"
          placeholder="Enter category name..."
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <BackButton
        onClick={() => window.history.back()}
        ariaLabel="Volver atrás"
      />

      {message && <p className={styles.message}>{message}</p>}

      <button className={styles.signUpButton} onClick={handleSubmit}>
        Upload Category
      </button>

      <br></br>
      <br></br>

      <b className={styles.signUpPage}>Modifica tu categoria</b>

      <div className={styles.rectangleGroup}>
        <input
          className={styles.frameChild}
          type="text"
          name="oldName"
          placeholder="Enter category name..."
          value={modifyForm.oldName}
          onChange={handleModifyChange}
          required
        />

        {suggestedCategory.length > 0 && (
          <ul className={styles2.suggestionList}>
            {suggestedCategory.map((cat, index) => (
              <li key={index} onClick={() => handleSuggestionClick(cat)}>
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.rectangleGroup}>
        <input
          className={styles.frameChild}
          type="text"
          name="newName"
          placeholder="Enter new category name..."
          value={modifyForm.newName}
          onChange={handleNewChange}
          required
        />
      </div>
      <button className={styles.signUpButton} onClick={handleModifySubmit}>
        Modify Category
      </button>
    </div>
  );
};

export default CreateCategory;
