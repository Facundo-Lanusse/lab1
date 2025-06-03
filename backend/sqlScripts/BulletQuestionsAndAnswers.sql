-- Preguntas
INSERT INTO bullet_questions (bullet_text) VALUES
                                               ('¿De qué color es el cielo?'),
                                               ('¿Cuánto es 2 + 2?'),
                                               ('¿Qué animal hace "miau"?'),
                                               ('¿Cuánto es 5 - 3?'),
                                               ('¿Qué fruta es amarilla y alargada?'),
                                               ('¿Cómo se dice "hola" en inglés?'),
                                               ('¿Qué día viene después del lunes?'),
                                               ('¿Cuántos lados tiene un triángulo?'),
                                               ('¿Qué usamos para escuchar música?'),
                                               ('¿De qué color es el pasto?');

-- Respuestas
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
-- Respuestas para "¿De qué color es el cielo?"
(1, 'Azul', true),
(1, 'Rojo', false),
(1, 'Verde', false),
(1, 'Blanco', false),

-- Respuestas para "¿Cuánto es 2 + 2?"
(2, '4', true),
(2, '3', false),
(2, '5', false),
(2, '6', false),

-- Respuestas para "¿Qué animal hace 'miau'?"
(3, 'Gato', true),
(3, 'Perro', false),
(3, 'Pájaro', false),
(3, 'Ratón', false),

-- Respuestas para "¿Cuánto es 5 - 3?"
(4, '2', true),
(4, '3', false),
(4, '1', false),
(4, '4', false),

-- Respuestas para "¿Qué fruta es amarilla y alargada?"
(5, 'Banana', true),
(5, 'Manzana', false),
(5, 'Uva', false),
(5, 'Naranja', false),

-- Respuestas para "¿Cómo se dice 'hola' en inglés?"
(6, 'Hello', true),
(6, 'Bye', false),
(6, 'Thanks', false),
(6, 'Hola', false),

-- Respuestas para "¿Qué día viene después del lunes?"
(7, 'Martes', true),
(7, 'Miércoles', false),
(7, 'Domingo', false),
(7, 'Jueves', false),

-- Respuestas para "¿Cuántos lados tiene un triángulo?"
(8, '3', true),
(8, '4', false),
(8, '5', false),
(8, '6', false),

-- Respuestas para "¿Qué usamos para escuchar música?"
(9, 'Audífonos', true),
(9, 'Zapatillas', false),
(9, 'Reloj', false),
(9, 'Sombrero', false),

-- Respuestas para "¿De qué color es el pasto?"
(10, 'Verde', true),
(10, 'Azul', false),
(10, 'Amarillo', false),
(10, 'Negro', false);