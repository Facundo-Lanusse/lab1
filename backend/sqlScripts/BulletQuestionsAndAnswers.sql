--COPIA TODO PORQUE SINO VAS A TENER POROBLEMA CON LOS IDs
-- Elimina primero las respuestas (porque dependen de las preguntas)
DELETE FROM bullet_answers;
-- Luego elimina las preguntas
DELETE FROM bullet_questions;

-- Preguntas
INSERT INTO bullet_questions (bullet_text) VALUES
                                               ('¿De qué color es el cielo?'),
                                               ('¿Cuánto es 2 + 2?'),
                                               ('¿Qué animal hace "miau"?'),
                                       d        ('¿Cuánto es 5 - 3?'),
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

-- === Preguntas y respuestas adicionales ===

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué animal hace "beee"?');

-- Respuestas para "¿Qué animal hace 'beee'?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(11, 'Oveja', true),
(11, 'Vaca', false),
(11, 'Loro', false),
(11, 'Caballo', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 8 + 16?');

-- Respuestas para "¿Cuánto es 8 + 16?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(12, '24', true),
(12, '22', false),
(12, '26', false),
(12, '20', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué usamos para medir?');

-- Respuestas para "¿Qué usamos para medir?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(13, 'Regla', true),
(13, 'Reloj', false),
(13, 'Celular', false),
(13, 'Zapato', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuántos lados tiene un cuadrado?');

-- Respuestas para "¿Cuántos lados tiene un cuadrado?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(14, '4', true),
(14, '3', false),
(14, '5', false),
(14, '7', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué animal hace "croac"?');

-- Respuestas para "¿Qué animal hace 'croac'?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(15, 'Rana', true),
(15, 'Oveja', false),
(15, 'Loro', false),
(15, 'Sapo', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué usamos para ver la hora?');

-- Respuestas para "¿Qué usamos para ver la hora?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(16, 'Reloj', true),
(16, 'Silla', false),
(16, 'Zapato', false),
(16, 'Celular', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué día viene después del miércoles?');

-- Respuestas para "¿Qué día viene después del miércoles?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(17, 'Jueves', true),
(17, 'Martes', false),
(17, 'Viernes', false),
(17, 'Lunes', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar negro y celeste?');

-- Respuestas para "¿Qué color resulta de mezclar negro y celeste?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(18, 'Azul oscuro', true),
(18, 'Rojo', false),
(18, 'Naranja', false),
(18, 'Rosa', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué usamos para escribir?');

-- Respuestas para "¿Qué usamos para escribir?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(19, 'Lápiz', true),
(19, 'Silla', false),
(19, 'Celular', false),
(19, 'Zapato', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuántos lados tiene un pentágono?');

-- Respuestas para "¿Cuántos lados tiene un pentágono?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(20, '5', true),
(20, '4', false),
(20, '6', false),
(20, '3', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuál es la capital de Francia?');

-- Respuestas para "¿Cuál es la capital de Francia?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(21, 'París', true),
(21, 'Madrid', false),
(21, 'Londres', false),
(21, 'Roma', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar rosa y celeste?');

-- Respuestas para "¿Qué color resulta de mezclar rosa y celeste?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(22, 'Violeta', true),
(22, 'Blanco', false),
(22, 'Naranja', false),
(22, 'Verde', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 16 + 13?');

-- Respuestas para "¿Cuánto es 16 + 13?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(23, '29', true),
(23, '28', false),
(23, '31', false),
(23, '32', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es amarilla y alargada?');

-- Respuestas para "¿Qué fruta es amarilla y alargada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(24, 'Banana', true),
(24, 'Manzana', false),
(24, 'Pera', false),
(24, 'Sandía', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar blanco y rojo?');

-- Respuestas para "¿Qué color resulta de mezclar blanco y rojo?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(25, 'Rosa', true),
(25, 'Naranja', false),
(25, 'Azul', false),
(25, 'Celeste', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuántos lados tiene un hexágono?');

-- Respuestas para "¿Cuántos lados tiene un hexágono?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(26, '6', true),
(26, '5', false),
(26, '7', false),
(26, '3', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 24 + 12?');

-- Respuestas para "¿Cuánto es 24 + 12?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(27, '36', true),
(27, '34', false),
(27, '38', false),
(27, '39', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 8 + 23?');

-- Respuestas para "¿Cuánto es 8 + 23?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(28, '31', true),
(28, '30', false),
(28, '29', false),
(28, '32', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 21 + 15?');

-- Respuestas para "¿Cuánto es 21 + 15?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(29, '36', true),
(29, '34', false),
(29, '37', false),
(29, '35', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar rojo y violeta?');

-- Respuestas para "¿Qué color resulta de mezclar rojo y violeta?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(30, 'Magenta', true),
(30, 'Amarillo', false),
(30, 'Celeste', false),
(30, 'Negro', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuál es la capital de Italia?');

-- Respuestas para "¿Cuál es la capital de Italia?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(31, 'Roma', true),
(31, 'Milán', false),
(31, 'Venecia', false),
(31, 'Madrid', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué usamos para cortar papel?');

-- Respuestas para "¿Qué usamos para cortar papel?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(32, 'Tijera', true),
(32, 'Zapato', false),
(32, 'Silla', false),
(32, 'Lápiz', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es violeta y alargada?');

-- Respuestas para "¿Qué fruta es violeta y alargada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(33, 'Berenjena', true),
(33, 'Banana', false),
(33, 'Frutilla', false),
(33, 'Manzana', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar celeste y amarillo?');

-- Respuestas para "¿Qué color resulta de mezclar celeste y amarillo?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(34, 'Verde claro', true),
(34, 'Violeta', false),
(34, 'Azul', false),
(34, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuál es la capital de Alemania?');

-- Respuestas para "¿Cuál es la capital de Alemania?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(35, 'Berlín', true),
(35, 'Múnich', false),
(35, 'Lisboa', false),
(35, 'Buenos Aires', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es naranja y redonda?');

-- Respuestas para "¿Qué fruta es naranja y redonda?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(36, 'Naranja', true),
(36, 'Pera', false),
(36, 'Frutilla', false),
(36, 'Manzana', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es blanca y redonda?');

-- Respuestas para "¿Qué fruta es blanca y redonda?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(37, 'Coco', true),
(37, 'Naranja', false),
(37, 'Manzana', false),
(37, 'Pera', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué día viene después del lunes?');

-- Respuestas para "¿Qué día viene después del lunes?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(38, 'Martes', true),
(38, 'Miércoles', false),
(38, 'Jueves', false),
(38, 'Domingo', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar rosa y amarillo?');

-- Respuestas para "¿Qué color resulta de mezclar rosa y amarillo?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(39, 'Naranja claro', true),
(39, 'Violeta', false),
(39, 'Negro', false),
(39, 'Azul', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es blanca y alargada?');

-- Respuestas para "¿Qué fruta es blanca y alargada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(40, 'Apio', true),
(40, 'Banana', false),
(40, 'Frutilla', false),
(40, 'Sandía', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es violeta y redonda?');

-- Respuestas para "¿Qué fruta es violeta y redonda?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(41, 'Uva', true),
(41, 'Manzana', false),
(41, 'Naranja', false),
(41, 'Sandía', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar amarillo y violeta?');

-- Respuestas para "¿Qué color resulta de mezclar amarillo y violeta?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(42, 'Marrón', true),
(42, 'Blanco', false),
(42, 'Rosa', false),
(42, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué día viene después del martes?');

-- Respuestas para "¿Qué día viene después del martes?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(43, 'Miércoles', true),
(43, 'Martes', false),
(43, 'Sábado', false),
(43, 'Lunes', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 9 + 26?');

-- Respuestas para "¿Cuánto es 9 + 26?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(44, '35', true),
(44, '33', false),
(44, '37', false),
(44, '34', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué día viene después del jueves?');

-- Respuestas para "¿Qué día viene después del jueves?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(45, 'Viernes', true),
(45, 'Martes', false),
(45, 'Domingo', false),
(45, 'Sábado', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 21 + 28?');

-- Respuestas para "¿Cuánto es 21 + 28?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(46, '49', true),
(46, '52', false),
(46, '47', false),
(46, '51', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar blanco y azul?');

-- Respuestas para "¿Qué color resulta de mezclar blanco y azul?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(47, 'Celeste', true),
(47, 'Verde', false),
(47, 'Naranja', false),
(47, 'Amarillo', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar naranja y amarillo?');

-- Respuestas para "¿Qué color resulta de mezclar naranja y amarillo?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(48, 'Amarillo naranja', true),
(48, 'Blanco', false),
(48, 'Rosa', false),
(48, 'Azul', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 15 + 1?');

-- Respuestas para "¿Cuánto es 15 + 1?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(49, '16', true),
(49, '15', false),
(49, '14', false),
(49, '17', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué animal hace "mu"?');

-- Respuestas para "¿Qué animal hace 'mu'?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(50, 'Vaca', true),
(50, 'Oveja', false),
(50, 'Caballo', false),
(50, 'Cerdo', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es verde y alargada?');

-- Respuestas para "¿Qué fruta es verde y alargada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(51, 'Pepino', true),
(51, 'Manzana', false),
(51, 'Frutilla', false),
(51, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar blanco y naranja?');

-- Respuestas para "¿Qué color resulta de mezclar blanco y naranja?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(52, 'Durazno', true),
(52, 'Rosa', false),
(52, 'Verde', false),
(52, 'Negro', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuál es la capital de Argentina?');

-- Respuestas para "¿Cuál es la capital de Argentina?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(53, 'Buenos Aires', true),
(53, 'Córdoba', false),
(53, 'Lisboa', false),
(53, 'Roma', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar violeta y verde?');

-- Respuestas para "¿Qué color resulta de mezclar violeta y verde?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(54, 'Marrón oscuro', true),
(54, 'Rojo', false),
(54, 'Celeste', false),
(54, 'Azul', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar amarillo y azul?');

-- Respuestas para "¿Qué color resulta de mezclar amarillo y azul?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(55, 'Verde', true),
(55, 'Rosa', false),
(55, 'Naranja', false),
(55, 'Negro', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar azul y rojo?');

-- Respuestas para "¿Qué color resulta de mezclar azul y rojo?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(56, 'Violeta', true),
(56, 'Celeste', false),
(56, 'Amarillo', false),
(56, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar celeste y azul?');

-- Respuestas para "¿Qué color resulta de mezclar celeste y azul?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(57, 'Azul claro', true),
(57, 'Negro', false),
(57, 'Blanco', false),
(57, 'Rojo', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar violeta y rosa?');

-- Respuestas para "¿Qué color resulta de mezclar violeta y rosa?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(58, 'Fucsia', true),
(58, 'Amarillo', false),
(58, 'Azul', false),
(58, 'Verde', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es azul y redonda?');

-- Respuestas para "¿Qué fruta es azul y redonda?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(59, 'Arándano', true),
(59, 'Manzana', false),
(59, 'Uva', false),
(59, 'Sandía', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 27 + 19?');

-- Respuestas para "¿Cuánto es 27 + 19?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(60, '46', true),
(60, '44', false),
(60, '49', false),
(60, '47', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 30 + 4?');

-- Respuestas para "¿Cuánto es 30 + 4?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(61, '34', true),
(61, '32', false),
(61, '37', false),
(61, '35', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 16 + 2?');

-- Respuestas para "¿Cuánto es 16 + 2?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(62, '18', true),
(62, '16', false),
(62, '20', false),
(62, '19', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 23 + 15?');

-- Respuestas para "¿Cuánto es 23 + 15?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(63, '38', true),
(63, '36', false),
(63, '40', false),
(63, '37', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar verde y violeta?');

-- Respuestas para "¿Qué color resulta de mezclar verde y violeta?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(64, 'Marrón', true),
(64, 'Blanco', false),
(64, 'Celeste', false),
(64, 'Negro', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar rojo y azul?');

-- Respuestas para "¿Qué color resulta de mezclar rojo y azul?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(65, 'Violeta', true),
(65, 'Negro', false),
(65, 'Naranja', false),
(65, 'Verde', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es rosa y alargada?');

-- Respuestas para "¿Qué fruta es rosa y alargada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(66, 'Rábano', true),
(66, 'Banana', false),
(66, 'Sandía', false),
(66, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 10 + 5?');

-- Respuestas para "¿Cuánto es 10 + 5?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(67, '15', true),
(67, '14', false),
(67, '18', false),
(67, '16', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es roja y ovalada?');

-- Respuestas para "¿Qué fruta es roja y ovalada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(68, 'Frutilla', true),
(68, 'Manzana', false),
(68, 'Pera', false),
(68, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es negra y redonda?');

-- Respuestas para "¿Qué fruta es negra y redonda?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(69, 'Aceituna', true),
(69, 'Pera', false),
(69, 'Sandía', false),
(69, 'Uva', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es celeste y ovalada?');

-- Respuestas para "¿Qué fruta es celeste y ovalada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(70, 'Ciruela azul', true),
(70, 'Pera', false),
(70, 'Naranja', false),
(70, 'Frutilla', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es roja y alargada?');

-- Respuestas para "¿Qué fruta es roja y alargada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(71, 'Pimiento rojo', true),
(71, 'Naranja', false),
(71, 'Uva', false),
(71, 'Sandía', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 4 + 7?');

-- Respuestas para "¿Cuánto es 4 + 7?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(72, '11', true),
(72, '13', false),
(72, '14', false),
(72, '10', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar rojo y celeste?');

-- Respuestas para "¿Qué color resulta de mezclar rojo y celeste?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(73, 'Violeta claro', true),
(73, 'Negro', false),
(73, 'Violeta', false),
(73, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es azul y alargada?');

-- Respuestas para "¿Qué fruta es azul y alargada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(74, 'Berenjena japonesa', true),
(74, 'Naranja', false),
(74, 'Manzana', false),
(74, 'Sandía', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar azul y naranja?');

-- Respuestas para "¿Qué color resulta de mezclar azul y naranja?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(75, 'Gris', true),
(75, 'Rosa', false),
(75, 'Violeta', false),
(75, 'Blanco', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es amarilla y ovalada?');

-- Respuestas para "¿Qué fruta es amarilla y ovalada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(76, 'Limón', true),
(76, 'Manzana', false),
(76, 'Naranja', false),
(76, 'Sandía', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 8 + 19?');

-- Respuestas para "¿Cuánto es 8 + 19?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(77, '27', true),
(77, '28', false),
(77, '29', false),
(77, '26', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 27 + 26?');

-- Respuestas para "¿Cuánto es 27 + 26?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(78, '53', true),
(78, '55', false),
(78, '51', false),
(78, '54', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar celeste y verde?');

-- Respuestas para "¿Qué color resulta de mezclar celeste y verde?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(79, 'Verde agua', true),
(79, 'Negro', false),
(79, 'Violeta', false),
(79, 'Rojo', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 25 + 25?');

-- Respuestas para "¿Cuánto es 25 + 25?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(80, '50', true),
(80, '53', false),
(80, '49', false),
(80, '52', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es violeta y ovalada?');

-- Respuestas para "¿Qué fruta es violeta y ovalada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(81, 'Ciruela', true),
(81, 'Pera', false),
(81, 'Sandía', false),
(81, 'Manzana', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 13 + 14?');

-- Respuestas para "¿Cuánto es 13 + 14?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(82, '27', true),
(82, '29', false),
(82, '28', false),
(82, '26', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es negra y alargada?');

-- Respuestas para "¿Qué fruta es negra y alargada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(83, 'Berenjena', true),
(83, 'Naranja', false),
(83, 'Manzana', false),
(83, 'Frutilla', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar amarillo y rosa?');

-- Respuestas para "¿Qué color resulta de mezclar amarillo y rosa?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(84, 'Melocotón', true),
(84, 'Verde', false),
(84, 'Naranja', false),
(84, 'Celeste', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 1 + 16?');

-- Respuestas para "¿Cuánto es 1 + 16?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(85, '17', true),
(85, '15', false),
(85, '19', false),
(85, '18', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 19 + 3?');

-- Respuestas para "¿Cuánto es 19 + 3?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(86, '22', true),
(86, '20', false),
(86, '24', false),
(86, '21', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 5 + 12?');

-- Respuestas para "¿Cuánto es 5 + 12?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(87, '17', true),
(87, '19', false),
(87, '15', false),
(87, '18', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es amarilla y redonda?');

-- Respuestas para "¿Qué fruta es amarilla y redonda?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(88, 'Manzana amarilla', true),
(88, 'Naranja', false),
(88, 'Frutilla', false),
(88, 'Pera', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar azul y verde?');

-- Respuestas para "¿Qué color resulta de mezclar azul y verde?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(89, 'Turquesa', true),
(89, 'Rosa', false),
(89, 'Blanco', false),
(89, 'Celeste', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar violeta y amarillo?');

-- Respuestas para "¿Qué color resulta de mezclar violeta y amarillo?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(90, 'Marrón claro', true),
(90, 'Naranja', false),
(90, 'Celeste', false),
(90, 'Azul', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar blanco y amarillo?');

-- Respuestas para "¿Qué color resulta de mezclar blanco y amarillo?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(91, 'Amarillo claro', true),
(91, 'Negro', false),
(91, 'Naranja', false),
(91, 'Rosa', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 23 + 5?');

-- Respuestas para "¿Cuánto es 23 + 5?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(92, '28', true),
(92, '29', false),
(92, '30', false),
(92, '27', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar rosa y blanco?');

-- Respuestas para "¿Qué color resulta de mezclar rosa y blanco?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(93, 'Rosa claro', true),
(93, 'Negro', false),
(93, 'Amarillo', false),
(93, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es naranja y ovalada?');

-- Respuestas para "¿Qué fruta es naranja y ovalada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(94, 'Durazno', true),
(94, 'Pera', false),
(94, 'Naranja', false),
(94, 'Uva', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 17 + 18?');

-- Respuestas para "¿Cuánto es 17 + 18?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(95, '35', true),
(95, '37', false),
(95, '34', false),
(95, '36', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es verde y ovalada?');

-- Respuestas para "¿Qué fruta es verde y ovalada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(96, 'Palta', true),
(96, 'Pera', false),
(96, 'Manzana', false),
(96, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar rosa y naranja?');

-- Respuestas para "¿Qué color resulta de mezclar rosa y naranja?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(97, 'Coral', true),
(97, 'Azul', false),
(97, 'Violeta', false),
(97, 'Rojo', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar celeste y naranja?');

-- Respuestas para "¿Qué color resulta de mezclar celeste y naranja?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(98, 'Gris claro', true),
(98, 'Blanco', false),
(98, 'Azul', false),
(98, 'Negro', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 1 + 18?');

-- Respuestas para "¿Cuánto es 1 + 18?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(99, '19', true),
(99, '21', false),
(99, '22', false),
(99, '20', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 25 + 8?');

-- Respuestas para "¿Cuánto es 25 + 8?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(100, '33', true),
(100, '36', false),
(100, '32', false),
(100, '35', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es azul y ovalada?');

-- Respuestas para "¿Qué fruta es azul y ovalada?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(101, 'Arándano grande', true),
(101, 'Manzana', false),
(101, 'Frutilla', false),
(101, 'Naranja', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar azul y negro?');

-- Respuestas para "¿Qué color resulta de mezclar azul y negro?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(102, 'Azul oscuro', true),
(102, 'Amarillo', false),
(102, 'Blanco', false),
(102, 'Rosa', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 15 + 6?');

-- Respuestas para "¿Cuánto es 15 + 6?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(103, '21', true),
(103, '19', false),
(103, '20', false),
(103, '22', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 22 + 7?');

-- Respuestas para "¿Cuánto es 22 + 7?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(104, '29', true),
(104, '31', false),
(104, '32', false),
(104, '28', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar amarillo y negro?');

-- Respuestas para "¿Qué color resulta de mezclar amarillo y negro?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(105, 'Verde oliva', true),
(105, 'Verde', false),
(105, 'Rojo', false),
(105, 'Violeta', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué color resulta de mezclar blanco y celeste?');

-- Respuestas para "¿Qué color resulta de mezclar blanco y celeste?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(106, 'Celeste claro', true),
(106, 'Rosa', false),
(106, 'Azul', false),
(106, 'Violeta', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es rosa y redonda?');

-- Respuestas para "¿Qué fruta es rosa y redonda?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(107, 'Manzana rosa', true),
(107, 'Manzana', false),
(107, 'Uva', false),
(107, 'Sandía', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué fruta es verde y redonda?');

-- Respuestas para "¿Qué fruta es verde y redonda?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(108, 'Manzana verde', true),
(108, 'Banana', false),
(108, 'Naranja', false),
(108, 'Uva', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Cuánto es 9 + 16?');

-- Respuestas para "¿Cuánto es 9 + 16?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(109, '25', true),
(109, '28', false),
(109, '27', false),
(109, '24', false);

INSERT INTO bullet_questions (bullet_text) VALUES
('¿Qué día viene después del viernes?');

-- Respuestas para "¿Qué día viene después del viernes?"
INSERT INTO bullet_answers (bullet_question_id, answer_text, is_correct) VALUES
(110, 'Sábado', true),
(110, 'Domingo', false),
(110, 'Lunes', false),
(110, 'Jueves', false);
