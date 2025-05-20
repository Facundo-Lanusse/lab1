import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Wheel from '../components/Wheel';
import styles from './css/GamePlay.module.css';

const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#32CD32', '#FF69B4', '#BA55D3', '#20B2AA'
];

const Roulette = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [friendId, setFriendId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener las categorías al cargar el componente
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        // Obtener el ID del amigo de los parámetros de la URL o del estado
        if (location.state && location.state.friendId) {
            setFriendId(location.state.friendId);
        }

        // Cargar las categorías
        const fetchCategories = async () => {
            setLoading(true);
            try {
                // Usando la URL completa como en otros componentes
                const response = await axios.get("http://localhost:3000/api/categories");
                console.log("Respuesta de API categorías:", response.data);

                // Ajustando para obtener el arreglo de categorías según la estructura de respuesta correcta
                const categoriesArray = response.data.categories || response.data;

                if (categoriesArray && Array.isArray(categoriesArray) && categoriesArray.length > 0) {
                    setCategories(categoriesArray);
                } else {
                    console.error("No se encontraron categorías en la respuesta de la API");
                    setError('No se encontraron categorías');
                }
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
                setError('Error al cargar las categorías');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [navigate, location.state]);

    // Función para manejar cuando la ruleta termina de girar
    const handleFinishSpin = (segment) => {
        setIsSpinning(false);

        // Buscar la categoría seleccionada por su nombre
        console.log("Categorías disponibles:", categories);
        console.log("Buscando categoría con nombre:", segment);

        // Normalizar el texto para la búsqueda (quitar espacios, convertir a minúsculas)
        const normalizedSegment = segment.toLowerCase().trim();

        // Buscar categoría que coincida exactamente o de forma aproximada
        const selectedCat = categories.find(cat =>
            cat.name === segment || // Coincidencia exacta
            cat.name.toLowerCase().trim() === normalizedSegment || // Coincidencia sin considerar mayúsculas/minúsculas
            cat.name.toLowerCase().includes(normalizedSegment) || // El nombre contiene el segmento
            normalizedSegment.includes(cat.name.toLowerCase()) // El segmento contiene el nombre
        );

        if (selectedCat && selectedCat.category_id) {
            console.log("Categoría seleccionada:", selectedCat);
            setSelectedCategory(selectedCat);
            fetchQuestionByCategory(selectedCat.category_id); // Usar category_id en lugar de id
        } else {
            console.error("No se encontró la categoría o su ID es undefined:", segment);
            console.log("Nombres de categorías disponibles:", categories.map(c => c.name));

            // Si hay categorías disponibles, seleccionar la primera como fallback
            if (categories.length > 0) {
                const fallbackCategory = categories[0];
                console.log("Usando categoría de respaldo:", fallbackCategory);
                setSelectedCategory(fallbackCategory);
                fetchQuestionByCategory(fallbackCategory.category_id);
            } else {
                setError(`No se encontró la categoría: ${segment}`);
            }
        }
    };

    // Iniciar el giro de la ruleta
    const handleStartSpin = () => {
        if (categories.length === 0 || isSpinning) return;

        setIsSpinning(true);
        setQuestion(null);
        setAnswers([]);
        setSelectedIndex(null);
        setIsAnswerCorrect(null);
    };

    // Función para obtener una pregunta de la categoría seleccionada
    const fetchQuestionByCategory = async (categoryId) => {
        try {
            console.log(`Intentando obtener preguntas para categoría ID: ${categoryId}`);

            // Buscar el nombre de la categoría por ID antes de hacer la solicitud
            const categoryName = categories.find(cat => cat.category_id === categoryId)?.name || 'desconocida';

            // URL actualizada para coincidir con el endpoint existente en el backend
            const response = await axios.get(`http://localhost:3000/api/questionsByCategoryId/${categoryId}`);
            console.log("Respuesta de pregunta por categoría:", response.data);

            if (response.data && response.data.question) {
                setQuestion(response.data.question);
                const shuffledAnswers = response.data.answers.sort(() => Math.random() - 0.5);
                setAnswers(shuffledAnswers);
                setError(null); // Limpiar cualquier error previo
            } else {
                console.error('No se encontraron preguntas en esta categoría');
                setError(`No hay preguntas disponibles para la categoría "${categoryName}"`);
                setQuestion(null);
                setAnswers([]);
            }
        } catch (error) {
            console.error('Error al obtener la pregunta:', error);

            // Buscar el nombre de la categoría directamente de las categorías cargadas
            const categoryName = categories.find(cat => cat.category_id === categoryId)?.name || 'seleccionada';

            if (error.response && error.response.status === 404) {
                setError(`No se encontraron preguntas para la categoría "${categoryName}". Prueba con otra categoría.`);
            } else {
                setError(`Error al cargar las preguntas para la categoría "${categoryName}": ${error.message || 'Error desconocido'}`);
            }

            setQuestion(null);
            setAnswers([]);
        }
    };

    // Función para seleccionar una respuesta
    const handleSelectAnswer = (index) => {
        setSelectedIndex(index);
        const isCorrect = answers[index].is_correct;
        setIsAnswerCorrect(isCorrect);

        // Aquí podrías enviar el resultado al backend si es necesario
        // Similar a como se hace en Play.jsx
    };

    // Función para obtener una nueva pregunta
    const getNextQuestion = () => {
        if (selectedCategory) {
            handleStartSpin();
        }
    };

    // Obtener lista de nombres de categorías para la ruleta
    const getCategoryNames = () => {
        return categories.map(cat => cat.name);
    };

    // Seleccionar una categoría ganadora aleatoria
    const getRandomWinningSegment = () => {
        if (categories.length === 0) return '';
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex].name;
    };

    return (
        <div className={styles.container}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Ruleta de categorías</h1>

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '30px', width: '100%', maxWidth: '350px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            Cargando categorías...
                        </div>
                    ) : categories.length > 0 ? (
                        <Wheel
                            segments={getCategoryNames()}
                            segColors={COLORS}
                            winningSegment={getRandomWinningSegment()}
                            onFinished={handleFinishSpin}
                            primaryColor="#16b3b9"
                            contrastColor="#ffffff"
                            buttonText="Girar"
                            size={350}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                            No se encontraron categorías
                        </div>
                    )}
                </div>

                {error && (
                    <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                {selectedCategory && (
                    <div className={styles.selectedCategory} style={{ marginBottom: '20px' }}>
                        <span>Categoría seleccionada: </span>
                        <strong>{selectedCategory.name}</strong>
                    </div>
                )}

                {question && (
                    <div className={styles.questionContainer} style={{ width: '100%', maxWidth: '500px' }}>
                        <h2 className={styles.question}>{question.questiontext}</h2>
                        <div className={styles.answerOptions}>
                            {answers.map((answer, index) => (
                                <button
                                    key={answer.answer_id || index}
                                    onClick={() => handleSelectAnswer(index)}
                                    className={`${styles.answerButton} ${
                                        selectedIndex === index
                                            ? isAnswerCorrect
                                                ? styles.correct
                                                : styles.incorrect
                                            : ''
                                    }`}
                                    disabled={selectedIndex !== null}
                                >
                                    {answer.answertext}
                                </button>
                            ))}
                        </div>

                        {selectedIndex !== null && (
                            <div className={styles.resultMessage}>
                                {isAnswerCorrect ? (
                                    <p className={styles.correctMessage}>¡Respuesta correcta!</p>
                                ) : (
                                    <p className={styles.incorrectMessage}>Respuesta incorrecta</p>
                                )}
                            </div>
                        )}

                        {selectedIndex !== null && (
                            <button
                                onClick={getNextQuestion}
                                className={styles.nextButton}
                                style={{ margin: '20px auto 0', display: 'block' }}
                            >
                                Siguiente pregunta
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Roulette;
