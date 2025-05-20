import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './css/GamePlay.module.css';

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
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };

        fetchCategories();
    }, [navigate, location.state]);

    // Función para girar la ruleta
    const spinRouletteAndSelectCategory = () => {
        if (categories.length === 0 || isSpinning) return;

        setIsSpinning(true);
        setQuestion(null);
        setAnswers([]);
        setSelectedIndex(null);
        setIsAnswerCorrect(null);

        // Simulación de la ruleta girando
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * categories.length);
            setSelectedCategory(categories[randomIndex]);
            setIsSpinning(false);
            fetchQuestionByCategory(categories[randomIndex].id);
        }, 2000);
    };

    // Función para obtener una pregunta de la categoría seleccionada
    const fetchQuestionByCategory = async (categoryId) => {
        try {
            const response = await axios.get(`/api/questions/category/${categoryId}`);
            if (response.data && response.data.question) {
                setQuestion(response.data.question);
                const shuffledAnswers = response.data.answers.sort(() => Math.random() - 0.5);
                setAnswers(shuffledAnswers);
            } else {
                console.error('No se encontraron preguntas en esta categoría');
            }
        } catch (error) {
            console.error('Error al obtener la pregunta:', error);
        }
    };

    // Función para seleccionar una respuesta
    const handleSelectAnswer = (index) => {
        setSelectedIndex(index);
        const isCorrect = answers[index].is_correct;
        setIsAnswerCorrect(isCorrect);

        // Aquí puedes agregar la lógica para enviar el resultado al backend
    };

    // Renderizar la ruleta (puedes personalizar esto según tus necesidades)
    const renderRoulette = () => {
        return (
            <div className={styles.roulette}>
                {isSpinning ? (
                    <div className={styles.spinningRoulette}>
                        <p>¡Girando la ruleta!</p>
                    </div>
                ) : (
                    <div className={styles.staticRoulette}>
                        <button
                            onClick={spinRouletteAndSelectCategory}
                            className={styles.spinButton}
                        >
                            Girar ruleta
                        </button>
                        {selectedCategory && (
                            <div className={styles.selectedCategory}>
                                <p>Categoría seleccionada: {selectedCategory.name}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Renderizar la pregunta y respuestas
    const renderQuestion = () => {
        if (!question) return null;

        return (
            <div className={styles.questionContainer}>
                <h3 className={styles.question}>{question.questiontext}</h3>
                <div className={styles.answerOptions}>
                    {answers.map((answer, index) => (
                        <button
                            key={answer.answer_id}
                            onClick={() => handleSelectAnswer(index)}
                            className={`${styles.answerButton} 
                                ${selectedIndex === index ? 
                                    (isAnswerCorrect ? styles.correct : styles.incorrect) 
                                    : ''}`}
                            disabled={selectedIndex !== null}
                        >
                            {answer.answertext}
                        </button>
                    ))}
                </div>
                {selectedIndex !== null && (
                    <div className={styles.resultMessage}>
                        {isAnswerCorrect ?
                            <p className={styles.correctMessage}>¡Respuesta correcta!</p> :
                            <p className={styles.incorrectMessage}>Respuesta incorrecta</p>}
                    </div>
                )}
                {selectedIndex !== null && (
                    <button
                        onClick={spinRouletteAndSelectCategory}
                        className={styles.nextButton}
                    >
                        Siguiente pregunta
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h1>Desafío</h1>
            {friendId && <p>Desafiando a: {friendId}</p>}
            {renderRoulette()}
            {renderQuestion()}
        </div>
    );
};

export default Roulette;
