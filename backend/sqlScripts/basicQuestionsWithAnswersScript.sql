-- Insertar categorías
INSERT INTO category (name) VALUES
                                ('Ciencia'),
                                ('Historia'),
                                ('Geografía'),
                                ('Entretenimiento');

-- === Preguntas y respuestas ===

-- Ciencia 1
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el planeta más grande del sistema solar?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Júpiter', TRUE),
                                                       (currval('question_question_id_seq'), 'Saturno', FALSE),
                                                       (currval('question_question_id_seq'), 'Marte', FALSE),
                                                       (currval('question_question_id_seq'), 'Tierra', FALSE);

-- Ciencia 2
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el elemento químico con el símbolo O?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Oxígeno', TRUE),
                                                       (currval('question_question_id_seq'), 'Oro', FALSE),
                                                       (currval('question_question_id_seq'), 'Osmio', FALSE),
                                                       (currval('question_question_id_seq'), 'Oxalato', FALSE);

-- Ciencia 3
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la velocidad de la luz en el vacío?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), '299.792.458 m/s', TRUE),
                                                       (currval('question_question_id_seq'), '150.000.000 m/s', FALSE),
                                                       (currval('question_question_id_seq'), '3.000.000 m/s', FALSE),
                                                       (currval('question_question_id_seq'), '1.080.000.000 m/s', FALSE);

-- Ciencia 4
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué científico propuso la teoría de la relatividad?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Albert Einstein', TRUE),
                                                       (currval('question_question_id_seq'), 'Isaac Newton', FALSE),
                                                       (currval('question_question_id_seq'), 'Galileo Galilei', FALSE),
                                                       (currval('question_question_id_seq'), 'Nikola Tesla', FALSE);

-- Ciencia 5
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué parte del cuerpo humano produce insulina?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Páncreas', TRUE),
                                                       (currval('question_question_id_seq'), 'Hígado', FALSE),
                                                       (currval('question_question_id_seq'), 'Riñones', FALSE),
                                                       (currval('question_question_id_seq'), 'Estómago', FALSE);

-- Historia 1
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué año comenzó la Segunda Guerra Mundial?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), '1939', TRUE),
                                                       (currval('question_question_id_seq'), '1941', FALSE),
                                                       (currval('question_question_id_seq'), '1936', FALSE),
                                                       (currval('question_question_id_seq'), '1945', FALSE);

-- Historia 2
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue el primer emperador romano?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Augusto', TRUE),
                                                       (currval('question_question_id_seq'), 'Julio César', FALSE),
                                                       (currval('question_question_id_seq'), 'Nerón', FALSE),
                                                       (currval('question_question_id_seq'), 'Calígula', FALSE);

-- Historia 3
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué civilización construyó Machu Picchu?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Inca', TRUE),
                                                       (currval('question_question_id_seq'), 'Azteca', FALSE),
                                                       (currval('question_question_id_seq'), 'Maya', FALSE),
                                                       (currval('question_question_id_seq'), 'Olmeca', FALSE);

-- Historia 4
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién descubrió América?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Cristóbal Colón', TRUE),
                                                       (currval('question_question_id_seq'), 'Américo Vespucio', FALSE),
                                                       (currval('question_question_id_seq'), 'Marco Polo', FALSE),
                                                       (currval('question_question_id_seq'), 'Vasco da Gama', FALSE);

-- Historia 5
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué año se firmó la independencia de Estados Unidos?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), '1776', TRUE),
                                                       (currval('question_question_id_seq'), '1783', FALSE),
                                                       (currval('question_question_id_seq'), '1804', FALSE),
                                                       (currval('question_question_id_seq'), '1750', FALSE);

-- Geografía 1
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el país más grande del mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Rusia', TRUE),
                                                       (currval('question_question_id_seq'), 'Canadá', FALSE),
                                                       (currval('question_question_id_seq'), 'China', FALSE),
                                                       (currval('question_question_id_seq'), 'Brasil', FALSE);

-- Geografía 2
INSERT INTO question (questiontext, category_id)
VALUES ('¿Dónde se encuentra el monte Everest?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Nepal', TRUE),
                                                       (currval('question_question_id_seq'), 'India', FALSE),
                                                       (currval('question_question_id_seq'), 'Tíbet', FALSE),
                                                       (currval('question_question_id_seq'), 'China', FALSE);

-- Geografía 3
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué río es el más largo del mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Nilo', TRUE),
                                                       (currval('question_question_id_seq'), 'Amazonas', FALSE),
                                                       (currval('question_question_id_seq'), 'Yangtsé', FALSE),
                                                       (currval('question_question_id_seq'), 'Misisipi', FALSE);

-- Geografía 4
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la capital de Australia?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Canberra', TRUE),
                                                       (currval('question_question_id_seq'), 'Sídney', FALSE),
                                                       (currval('question_question_id_seq'), 'Melbourne', FALSE),
                                                       (currval('question_question_id_seq'), 'Brisbane', FALSE);

-- Geografía 5
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué continente tiene más países?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'África', TRUE),
                                                       (currval('question_question_id_seq'), 'Asia', FALSE),
                                                       (currval('question_question_id_seq'), 'Europa', FALSE),
                                                       (currval('question_question_id_seq'), 'América', FALSE);

-- Entretenimiento 1
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién interpretó a Harry Potter en las películas?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Daniel Radcliffe', TRUE),
                                                       (currval('question_question_id_seq'), 'Elijah Wood', FALSE),
                                                       (currval('question_question_id_seq'), 'Rupert Grint', FALSE),
                                                       (currval('question_question_id_seq'), 'Tom Holland', FALSE);

-- Entretenimiento 2
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la película más taquillera de la historia (hasta 2023)?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Avatar', TRUE),
                                                       (currval('question_question_id_seq'), 'Avengers: Endgame', FALSE),
                                                       (currval('question_question_id_seq'), 'Titanic', FALSE),
                                                       (currval('question_question_id_seq'), 'Star Wars: The Force Awakens', FALSE);

-- Entretenimiento 3
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién canta la canción "Shape of You"?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Ed Sheeran', TRUE),
                                                       (currval('question_question_id_seq'), 'Justin Bieber', FALSE),
                                                       (currval('question_question_id_seq'), 'Shawn Mendes', FALSE),
                                                       (currval('question_question_id_seq'), 'Sam Smith', FALSE);

-- Entretenimiento 4
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué serie aparece el personaje Walter White?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Breaking Bad', TRUE),
                                                       (currval('question_question_id_seq'), 'Better Call Saul', FALSE),
                                                       (currval('question_question_id_seq'), 'The Sopranos', FALSE),
                                                       (currval('question_question_id_seq'), 'Ozark', FALSE);

-- Entretenimiento 5
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué actor protagoniza "Misión Imposible"?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
                                                       (currval('question_question_id_seq'), 'Tom Cruise', TRUE),
                                                       (currval('question_question_id_seq'), 'Matt Damon', FALSE),
                                                       (currval('question_question_id_seq'), 'Brad Pitt', FALSE),
                                                       (currval('question_question_id_seq'), 'Chris Evans', FALSE);
