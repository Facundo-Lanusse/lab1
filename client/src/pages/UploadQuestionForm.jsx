import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import styles from "./css/SignUp.module.css";
import styles2 from "./css/SuggestionList.module.css";
import BackButton from "../components/BackButton";

function UploadQuestionForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    categoryName: "",
    questionText: "",
    answerCorrect: "",
    answerFalse1: "",
    answerFalse2: "",
    answerFalse3: "",
  });

  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [suggestedCategory, setSuggestedCategories] = useState([]);

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

  useEffect(() => {
    //Igual a las líneas de admin
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      fetchCategories();
      if (!user) {
        navigate("/");
      }
      if (!user.is_admin) {
        navigate("/Home");
      }
    } catch (err) {
      console.log(err);
      navigate("/Login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [e.target.name]: e.target.value });
    if (name === "categoryName") {
      const filter = allCategories.filter((cat) =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedCategories(filter);
    }
  };

  const handleSuggestionClick = (cat) => {
    setForm({ ...form, categoryName: cat });
    setSuggestedCategories([]);
  };

  const handleQuestionForm = useCallback(async () => {
    //Manejo la pregunta
    try {
      await axios.post("http://localhost:3000/api/uploadQuestion", form);
      setMessage(`Pregunta registrada con éxito`);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error en el registro de pregunta"
      );
    }
  }, [form]);

  const handleAnswersForm = useCallback(async () => {
    //Manejo las respuestas
    try {
      await axios.post("http://localhost:3000/api/uploadAnswers", form);
      setMessage1(`Respuestas registradas con éxito. `);
    } catch (error) {
      setMessage1(
        error.response?.data?.error || "Error en el registro de respuesta"
      );
    }
  }, [form]);

  async function handleForm() {
    //Llamo a ambas funciones cuando llame a este funcion flecha
    await handleQuestionForm();
    handleAnswersForm();
  }

  return (
    <div className={styles.signUp}>
      <BackButton onClick={() => navigate("/Home")} />
      <button
        className={styles.signUpButton}
        style={{
          justifyContent: "center",
          position: "absolute",
          marginTop: "510px",
        }}
        onClick={() => {
          navigate("/CategoryManager");
        }}
      >
        {" "}
        Modificar Categorias
      </button>
      <b className={styles.signUpPage}>Carga tus preguntas</b>

      <div className={styles.rectangleGroup}>
        <input
          className={styles.frameChild}
          type="text"
          name="categoryName"
          placeholder="Enter category name..."
          value={form.categoryName}
          onChange={handleChange}
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
          name="questionText"
          placeholder="Enter question..."
          value={form.questionText}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.rectangleGroup}>
        <input
          className={styles.frameChild}
          type="text"
          name="answerCorrect"
          placeholder="Enter the correct answer..."
          value={form.answerCorrect}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.rectangleGroup}>
        <input
          className={styles.frameChild}
          type="text"
          name="answerFalse1"
          placeholder="Enter a wrong answer..."
          value={form.answerFalse1}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.rectangleGroup}>
        <input
          className={styles.frameChild}
          type="text"
          name="answerFalse2"
          placeholder="Enter a wrong answer..."
          value={form.answerFalse2}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.rectangleGroup}>
        <input
          className={styles.frameChild}
          type="text"
          name="answerFalse3"
          placeholder="Enter a wrong answer..."
          value={form.answerFalse3}
          onChange={handleChange}
          required
        />
      </div>

      {message1 && message && (
        <p className={styles.message}> {message + " y " + message1} </p>
      )}

      <button className={styles.signUpButton} onClick={handleForm}>
        Subir
      </button>
    </div>
  );
}

export default UploadQuestionForm;
