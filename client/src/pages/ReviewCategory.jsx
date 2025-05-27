import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import styles from './css/ReviewCategory.module.css';
import styles2 from "./css/FriendsMenu.module.css";


const ReviewCategory = () => {
    const { category_id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState({});

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const [questionRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/FetchQuestionAndAnswersFromPendingCategories/${category_id}`)
                ]);
                setData(questionRes.data);


                if (questionRes.data && questionRes.data.questionAndAnswers) {
                    const questionIds = [...new Set(
                        questionRes.data.questionAndAnswers.map(qa => qa.community_question_id)
                    )];

                    const initialStatus = {};
                    questionIds.forEach(id => {
                        initialStatus[id] = false;
                    });
                    setApprovalStatus(initialStatus);
                }
            }
            catch (error) {
                console.log(error);
                if (error.response) {
                    setData(error.response.data);
                } else {
                    setData({ error: "Error al cargar los datos" });
                }
            }
            finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [category_id]);

    const groupQuestionsByID = () => {
        if (!data || !data.questionAndAnswers) return [];

        const groupedQuestions = {};

        data.questionAndAnswers.forEach(qa => {
            const id = qa.community_question_id;

            if (!groupedQuestions[id]) {
                groupedQuestions[id] = {
                    question_id: id,
                    question_text: qa.question_text,
                    answers: []
                };
            }

            groupedQuestions[id].answers.push({
                answer_text: qa.answer_text,
                is_correct: qa.is_correct
            });
        });

        return Object.values(groupedQuestions);
    };

    const handleApproveAll = async () => {
        try {
            await axios.put(`http://localhost:3000/api/UpdateCommunityCategoryState`, {
                status: 'accepted',
                categoryId: category_id
            });
            navigate("/Categories-Judgement");
        } catch (error) {
            console.error("Error al aprobar la categoría", error);
        }
    };

    const handleRejectAll = async () => {
        try {
            await axios.put(`http://localhost:3000/api/UpdateCommunityCategoryState`,{
                status: 'inadequate',
                categoryId: category_id
            });
            navigate("/Categories-Judgement");
        } catch (error) {
            console.error("Error al rechazar la categoría", error);
        }
    };

    const handleViewQuestion = (question) => {
        setSelectedQuestion(question);
    };

    const handleBackToList = () => {
        setSelectedQuestion(null);
    };

    const questionsGrouped = groupQuestionsByID();

    if (loading) {
        return <div className={styles.loadingContainer}><div className={styles.loadingSpinner}></div></div>;
    }

    return (<div className={styles.reviewCategoryContainer}>

            <button
                className={styles2.backButton}
                onClick={() => navigate('/Categories-Judgement')}
                aria-label="Volver"
            >
                <img src="../arrow-left-solid.svg" alt="Volver" />
            </button>
            <h1 className={styles.reviewTitle}>Revisión de Categoría</h1>
            {selectedQuestion ? (
                <div className={styles.questionDetail}>
                    <button className={styles.backButton} onClick={handleBackToList}>← Volver a la lista</button>
                    <h2>{selectedQuestion.question_text}</h2>

                    <div className={styles.answersList}>
                        {selectedQuestion.answers.map((answer, index) => (
                            <div
                                key={index}
                                className={`${styles.answerItem} ${answer.is_correct ? styles.correctAnswer : ''}`}
                            >
                                <span className={styles.answerText}>{answer.answer_text}</span>
                                {answer.is_correct && <span className={styles.correctBadge}>Correcta</span>}
                            </div>
                        ))}
                    </div>

                </div>
            ) : (
                <>
                    <div className={styles.questionsList}>
                        {questionsGrouped.map((question, index) => (
                            <div
                                key={index}
                                className={`${styles.questionItem} ${approvalStatus[question.question_id] ? styles.approvedQuestion : ''}`}
                                onClick={() => handleViewQuestion(question)}
                            >
                                <h3>{question.question_text}</h3>
                            </div>
                        ))}
                    </div>

                    <div className={styles.globalActions}>
                        <button className={styles.approveAllBtn} onClick={handleApproveAll}>
                            Aprobar categoría
                        </button>
                        <button className={styles.rejectAllBtn} onClick={handleRejectAll}>
                            Rechazar categoría
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReviewCategory;