import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/CategoryCommuntyForm.module.css";

const CreateCommunityCategory = () => {
    const navigate = useNavigate();
    const QUESTION_COUNT = 10;

    // Estado para el nombre de la categoría
    const [categoryName, setCategoryName] = useState("");

    // Estado para las preguntas (array de 10 preguntas con sus respectivas respuestas)
    const [questions, setQuestions] = useState(Array(QUESTION_COUNT).fill().map(() => ({
        questionText: "",
        answerCorrect: "",
        answerFalse1: "",
        answerFalse2: "",
        answerFalse3: ""
    })));

    // Estados para mensajes y sugerencias
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [existingCategories, setExistingCategories] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);

    // Verificar si el usuario está autenticado
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        fetchCategories();
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    // Obtener todas las categorías de comunidad
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/FetchCommunityCategories");
            const categories = response.data.map(cat => cat.name);
            setExistingCategories(categories);
        } catch (err) {
            console.error("Error al traer categorías de comunidad", err);
        }
    };

    // Manejar cambios en el nombre de la categoría
    const handleCategoryChange = (e) => {
        setCategoryName(e.target.value);
    };

    // Manejar cambios en las preguntas
    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        setQuestions(updatedQuestions);
    };

    // Verificar si todos los campos de una pregunta están completos
    const isQuestionComplete = (questionIndex) => {
        const q = questions[questionIndex];
        return q.questionText.trim() &&
            q.answerCorrect.trim() &&
            q.answerFalse1.trim() &&
            q.answerFalse2.trim() &&
            q.answerFalse3.trim();
    };

    // Verificar cuántas preguntas están completas
    const getCompletedQuestionCount = () => {
        return questions.filter((_, index) => isQuestionComplete(index)).length;
    };

    // Manejar el envío del formulario completo
    const handleSubmit = async () => {
        try {
            setMessage("Procesando solicitud...");
            setStatus("loading");

            // Validar que el nombre de la categoría esté completo
            if (!categoryName.trim()) {
                setMessage("Por favor, ingresa un nombre para la categoría");
                setStatus("error");
                return;
            }

            // Validar que todas las preguntas estén completas
            if (getCompletedQuestionCount() !== QUESTION_COUNT) {
                setMessage(`Por favor, completa todas las preguntas (${getCompletedQuestionCount()}/${QUESTION_COUNT} completadas)`);
                setStatus("error");
                return;
            }

            // 1. Crear la categoría si no existe
            let categoryExists = existingCategories.some(
                cat => cat.toLowerCase() === categoryName.toLowerCase()
            );

            if (!categoryExists) {
                await axios.post("http://localhost:3000/api/CreateCommunityCategory", {
                    name: categoryName,
                    userId: JSON.parse(localStorage.getItem('user')).user_id
                });

                // Actualizar lista de categorías
                await fetchCategories();
            }

            // 2. Para cada pregunta, crear la pregunta y sus respuestas
            for (let i = 0; i < QUESTION_COUNT; i++) {
                const questionData = {
                    categoryName: categoryName,
                    ...questions[i]
                };

                // Crear la pregunta
                await axios.post(
                    "http://localhost:3000/api/uploadCommunityQuestion",
                    questionData
                );

                // Crear las respuestas asociadas a la pregunta
                await axios.post(
                    "http://localhost:3000/api/uploadCommunityAnswers",
                    questionData
                );
            }

            // Mostrar mensaje de éxito y limpiar el formulario
            setMessage("¡Categoría y 10 preguntas creadas con éxito!");
            setStatus("success");
            setCategoryName("");
            setQuestions(Array(QUESTION_COUNT).fill().map(() => ({
                questionText: "",
                answerCorrect: "",
                answerFalse1: "",
                answerFalse2: "",
                answerFalse3: ""
            })));
            setActiveQuestion(0);

        } catch (error) {
            console.error("Error al crear elementos:", error);
            setMessage(error.response?.data?.error || "Error al procesar la solicitud");
            setStatus("error");
        }
    };

    // Cambiar a la siguiente pregunta
    const goToNextQuestion = () => {
        if (activeQuestion < QUESTION_COUNT - 1) {
            setActiveQuestion(activeQuestion + 1);
        }
    };

    // Cambiar a la pregunta anterior
    const goToPrevQuestion = () => {
        if (activeQuestion > 0) {
            setActiveQuestion(activeQuestion - 1);
        }
    };

    return (
        <div className={styles.categoryContainer}>
            <button className={styles.backButton} onClick={() => navigate('/communities')}>
                <img src="arrow-left-solid.svg" alt="Back" />
            </button>

            <h2 className={styles.categoryTitle}>Crear Categoría con 10 Preguntas</h2>

            <div className={styles.formContainer}>
                {/* Sección de información de categoría */}
                <div className={styles.formSection}>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Nombre de la categoría</label>
                        <input
                            className={styles.formInput}
                            type="text"
                            name="categoryName"
                            placeholder="Ej: Historia del Arte, Matemáticas Avanzadas..."
                            value={categoryName}
                            onChange={handleCategoryChange}
                            required
                        />
                    </div>
                </div>

                {/* Navegación de preguntas */}
                <div className={styles.questionNavigation}>
                    <div className={styles.questionIndicators}>
                        {Array(QUESTION_COUNT).fill().map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.questionIndicator} 
                                           ${activeQuestion === index ? styles.activeIndicator : ''} 
                                           ${isQuestionComplete(index) ? styles.completedIndicator : ''}`}
                                onClick={() => setActiveQuestion(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <div className={styles.completionStatus}>
                        {getCompletedQuestionCount()}/{QUESTION_COUNT} preguntas completadas
                    </div>
                </div>

                {/* Formulario para la pregunta activa */}
                <div className={styles.questionForm}>
                    <h3 className={styles.questionTitle}>Pregunta {activeQuestion + 1}</h3>

                    <div className={styles.formSection}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Texto de la pregunta</label>
                            <textarea
                                className={styles.formInput}
                                name="questionText"
                                placeholder="Escribe aquí el texto de la pregunta..."
                                value={questions[activeQuestion].questionText}
                                onChange={(e) => handleQuestionChange(activeQuestion, 'questionText', e.target.value)}
                                required
                                style={{ minHeight: '100px', resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    {/* Sección de respuestas */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Respuestas</h3>
                        <div className={styles.answerContainer}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Respuesta correcta</label>
                                <input
                                    className={`${styles.formInput} ${styles.correctAnswer}`}
                                    type="text"
                                    name="answerCorrect"
                                    placeholder="Escribe la respuesta correcta..."
                                    value={questions[activeQuestion].answerCorrect}
                                    onChange={(e) => handleQuestionChange(activeQuestion, 'answerCorrect', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Respuesta incorrecta 1</label>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    name="answerFalse1"
                                    placeholder="Escribe una respuesta incorrecta..."
                                    value={questions[activeQuestion].answerFalse1}
                                    onChange={(e) => handleQuestionChange(activeQuestion, 'answerFalse1', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Respuesta incorrecta 2</label>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    name="answerFalse2"
                                    placeholder="Escribe una respuesta incorrecta..."
                                    value={questions[activeQuestion].answerFalse2}
                                    onChange={(e) => handleQuestionChange(activeQuestion, 'answerFalse2', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Respuesta incorrecta 3</label>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    name="answerFalse3"
                                    placeholder="Escribe una respuesta incorrecta..."
                                    value={questions[activeQuestion].answerFalse3}
                                    onChange={(e) => handleQuestionChange(activeQuestion, 'answerFalse3', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navegación entre preguntas */}
                    <div className={styles.navigationButtons}>
                        <button
                            className={styles.navButton}
                            onClick={goToPrevQuestion}
                            disabled={activeQuestion === 0}
                        >
                            Anterior
                        </button>
                        <button
                            className={styles.navButton}
                            onClick={goToNextQuestion}
                            disabled={activeQuestion === QUESTION_COUNT - 1}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`${styles.statusMessage} ${styles[status]}`}>
                        {message}
                    </div>
                )}

                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                >
                    Crear Categoría con {QUESTION_COUNT} Preguntas
                </button>
            </div>
        </div>
    );
};

export default CreateCommunityCategory;