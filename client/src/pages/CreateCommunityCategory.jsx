import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/CategoryCommuntyForm.module.css";

const CreateCommunityCategory = () => {
    const navigate = useNavigate();
    const QUESTION_COUNT = 10;

    // Estado para el modo de creación
    const [creationMode, setCreationMode] = useState(null); // 'manual' | 'json' | null

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

    // Estado para el archivo JSON
    const [jsonFile, setJsonFile] = useState(null);
    const [jsonPreview, setJsonPreview] = useState(null);

    // Verificar si el usuario está autenticado
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        fetchCategories();
        if (!user) {
            navigate('/Login');
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

    // Manejar la selección del modo de creación
    const handleModeSelection = (mode) => {
        setCreationMode(mode);
        setMessage("");
        setStatus("");
    };

    // Manejar la carga del archivo JSON
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== "application/json") {
            setMessage("Por favor, selecciona un archivo JSON válido");
            setStatus("error");
            return;
        }

        setJsonFile(file);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                validateAndSetJsonData(jsonData);
            } catch (error) {
                setMessage("Error al leer el archivo JSON: formato inválido");
                setStatus("error");
                setJsonFile(null);
                setJsonPreview(null);
            }
        };

        reader.readAsText(file);
    };

    // Validar y establecer los datos del JSON
    const validateAndSetJsonData = (jsonData) => {
        try {
            // Validar estructura del JSON
            if (!jsonData.categoryName || !Array.isArray(jsonData.questions)) {
                throw new Error("Estructura JSON inválida. Debe contener 'categoryName' y 'questions'");
            }

            if (jsonData.questions.length !== QUESTION_COUNT) {
                throw new Error(`El archivo debe contener exactamente ${QUESTION_COUNT} preguntas`);
            }

            // Validar cada pregunta
            jsonData.questions.forEach((q, index) => {
                if (!q.questionText || !q.answerCorrect || !q.answerFalse1 || !q.answerFalse2 || !q.answerFalse3) {
                    throw new Error(`La pregunta ${index + 1} está incompleta`);
                }
            });

            // Si todo está bien, establecer los datos
            setCategoryName(jsonData.categoryName);
            setQuestions(jsonData.questions);
            setJsonPreview(jsonData);
            setMessage("Archivo JSON cargado correctamente");
            setStatus("success");

        } catch (error) {
            setMessage(`Error en el archivo JSON: ${error.message}`);
            setStatus("error");
            setJsonFile(null);
            setJsonPreview(null);
        }
    };

    // Generar JSON de ejemplo
    const downloadExampleJson = () => {
        const exampleData = {
            categoryName: "Ejemplo de Categoría",
            questions: Array(QUESTION_COUNT).fill().map((_, index) => ({
                questionText: `¿Cuál es la pregunta número ${index + 1}?`,
                answerCorrect: `Respuesta correcta ${index + 1}`,
                answerFalse1: `Respuesta incorrecta 1 para pregunta ${index + 1}`,
                answerFalse2: `Respuesta incorrecta 2 para pregunta ${index + 1}`,
                answerFalse3: `Respuesta incorrecta 3 para pregunta ${index + 1}`
            }))
        };

        const dataStr = JSON.stringify(exampleData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'categoria-ejemplo.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
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

            // Resetear todo
            setCategoryName("");
            setQuestions(Array(QUESTION_COUNT).fill().map(() => ({
                questionText: "",
                answerCorrect: "",
                answerFalse1: "",
                answerFalse2: "",
                answerFalse3: ""
            })));
            setActiveQuestion(0);
            setCreationMode(null);
            setJsonFile(null);
            setJsonPreview(null);

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

    // Volver a la selección de modo
    const goBackToModeSelection = () => {
        setCreationMode(null);
        setCategoryName("");
        setQuestions(Array(QUESTION_COUNT).fill().map(() => ({
            questionText: "",
            answerCorrect: "",
            answerFalse1: "",
            answerFalse2: "",
            answerFalse3: ""
        })));
        setActiveQuestion(0);
        setJsonFile(null);
        setJsonPreview(null);
        setMessage("");
        setStatus("");
    };

    // Si no se ha seleccionado el modo, mostrar opciones
    if (creationMode === null) {
        return (
            <div className={styles.categoryContainer}>
                <button className={styles.backButton} onClick={() => navigate('/Communities')}>
                    <img src="arrow-left-solid.svg" alt="Back" />
                </button>

                <h2 className={styles.categoryTitle}>Crear Nueva Categoría</h2>

                <div className={styles.formContainer}>
                    <div className={styles.modeSelection}>
                        <h3>¿Cómo quieres crear la categoría?</h3>

                        <div className={styles.modeOptions}>
                            <div className={styles.modeOption}>
                                <button
                                    className={styles.modeButton}
                                    onClick={() => handleModeSelection('manual')}
                                >
                                    <div className={styles.modeIcon}>✏️</div>
                                    <h4>Crear Manualmente</h4>
                                    <p>Escribe las preguntas y respuestas una por una</p>
                                </button>
                            </div>

                            <div className={styles.modeOption}>
                                <button
                                    className={styles.modeButton}
                                    onClick={() => handleModeSelection('json')}
                                >
                                    <div className={styles.modeIcon}>📁</div>
                                    <h4>Cargar desde JSON</h4>
                                    <p>Sube un archivo JSON con todas las preguntas</p>
                                </button>
                            </div>
                        </div>

                        <div className={styles.helpSection}>
                            <button
                                className={styles.downloadButton}
                                onClick={downloadExampleJson}
                            >
                                📥 Descargar JSON de ejemplo
                            </button>
                            <p className={styles.helpText}>
                                ¿No tienes un archivo JSON? Descarga este ejemplo para ver el formato correcto.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Si se seleccionó el modo JSON, mostrar cargador de archivos
    if (creationMode === 'json' && !jsonPreview) {
        return (
            <div className={styles.categoryContainer}>
                <button className={styles.backButton} onClick={goBackToModeSelection}>
                    <img src="arrow-left-solid.svg" alt="Back" />
                </button>

                <h2 className={styles.categoryTitle}>Cargar Categoría desde JSON</h2>

                <div className={styles.formContainer}>
                    <div className={styles.fileUploadSection}>
                        <div className={styles.uploadArea}>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileUpload}
                                className={styles.fileInput}
                                id="jsonFile"
                            />
                            <label htmlFor="jsonFile" className={styles.fileLabel}>
                                <div className={styles.uploadIcon}>📁</div>
                                <h3>Selecciona tu archivo JSON</h3>
                                <p>El archivo debe contener una categoría con exactamente {QUESTION_COUNT} preguntas</p>
                                <span className={styles.uploadButton}>Seleccionar archivo</span>
                            </label>
                        </div>

                        <div className={styles.formatInfo}>
                            <h4>Formato esperado del JSON:</h4>
                            <pre className={styles.codeBlock}>
{`{
  "categoryName": "Nombre de la categoría",
  "questions": [
    {
      "questionText": "¿Pregunta 1?",
      "answerCorrect": "Respuesta correcta",
      "answerFalse1": "Respuesta incorrecta 1",
      "answerFalse2": "Respuesta incorrecta 2",
      "answerFalse3": "Respuesta incorrecta 3"
    },
    // ... 9 preguntas más
  ]
}`}
                            </pre>
                        </div>

                        <button
                            className={styles.downloadButton}
                            onClick={downloadExampleJson}
                        >
                            📥 Descargar ejemplo
                        </button>
                    </div>

                    {message && (
                        <div className={`${styles.statusMessage} ${styles[status]}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Mostrar el formulario (ya sea manual o con datos cargados del JSON)
    return (
        <div className={styles.categoryContainer}>
            <button className={styles.backButton} onClick={goBackToModeSelection}>
                <img src="arrow-left-solid.svg" alt="Back" />
            </button>

            <h2 className={styles.categoryTitle}>
                {creationMode === 'json' ? 'Revisar y Crear desde JSON' : 'Crear Categoría Manualmente'}
                {creationMode === 'json' && (
                    <span className={styles.modeIndicator}>📁 Cargado desde JSON</span>
                )}
            </h2>

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