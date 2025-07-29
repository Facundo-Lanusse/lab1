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

-- Ciencia 6
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué partícula subatómica tiene carga negativa?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Electrón', TRUE),
    (currval('question_question_id_seq'), 'Protón', FALSE),
    (currval('question_question_id_seq'), 'Neutrón', FALSE),
    (currval('question_question_id_seq'), 'Quark', FALSE);

-- Ciencia 7
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el pH del agua pura?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), '7', TRUE),
    (currval('question_question_id_seq'), '1', FALSE),
    (currval('question_question_id_seq'), '3', FALSE),
    (currval('question_question_id_seq'), '9', FALSE);

-- Ciencia 8
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué tipo de sangre es donante universal?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'O negativo', TRUE),
    (currval('question_question_id_seq'), 'A positivo', FALSE),
    (currval('question_question_id_seq'), 'B negativo', FALSE),
    (currval('question_question_id_seq'), 'AB positivo', FALSE);

-- Ciencia 9
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué planeta tiene el día más largo?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Venus', TRUE),
    (currval('question_question_id_seq'), 'Marte', FALSE),
    (currval('question_question_id_seq'), 'Saturno', FALSE),
    (currval('question_question_id_seq'), 'Júpiter', FALSE);

-- Ciencia 10
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué vitamina produce el cuerpo con la luz solar?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Vitamina D', TRUE),
    (currval('question_question_id_seq'), 'Vitamina C', FALSE),
    (currval('question_question_id_seq'), 'Vitamina B12', FALSE),
    (currval('question_question_id_seq'), 'Vitamina A', FALSE);

-- Ciencia 11
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué estructura celular contiene el ADN?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Núcleo', TRUE),
    (currval('question_question_id_seq'), 'Mitocondria', FALSE),
    (currval('question_question_id_seq'), 'Citoplasma', FALSE),
    (currval('question_question_id_seq'), 'Ribosoma', FALSE);

-- Ciencia 12
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué instrumento mide la presión atmosférica?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Barómetro', TRUE),
    (currval('question_question_id_seq'), 'Termómetro', FALSE),
    (currval('question_question_id_seq'), 'Anemómetro', FALSE),
    (currval('question_question_id_seq'), 'Higrómetro', FALSE);

-- Ciencia 13
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el metal líquido a temperatura ambiente?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mercurio', TRUE),
    (currval('question_question_id_seq'), 'Plomo', FALSE),
    (currval('question_question_id_seq'), 'Aluminio', FALSE),
    (currval('question_question_id_seq'), 'Cobre', FALSE);

-- Ciencia 14
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué órgano filtra la sangre en el cuerpo humano?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Riñón', TRUE),
    (currval('question_question_id_seq'), 'Hígado', FALSE),
    (currval('question_question_id_seq'), 'Pulmones', FALSE),
    (currval('question_question_id_seq'), 'Páncreas', FALSE);

-- Ciencia 15
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la fórmula química del agua?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'H2O', TRUE),
    (currval('question_question_id_seq'), 'CO2', FALSE),
    (currval('question_question_id_seq'), 'NaCl', FALSE),
    (currval('question_question_id_seq'), 'CH4', FALSE);

-- Ciencia 16
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué científico desarrolló la tabla periódica?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Dmitri Mendeléyev', TRUE),
    (currval('question_question_id_seq'), 'Marie Curie', FALSE),
    (currval('question_question_id_seq'), 'Lavoisier', FALSE),
    (currval('question_question_id_seq'), 'Newton', FALSE);

-- Ciencia 17
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué fuerza nos mantiene en la Tierra?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Gravedad', TRUE),
    (currval('question_question_id_seq'), 'Magnetismo', FALSE),
    (currval('question_question_id_seq'), 'Fuerza nuclear', FALSE),
    (currval('question_question_id_seq'), 'Presión', FALSE);

-- Ciencia 18
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué animal es un mamífero marino?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Delfín', TRUE),
    (currval('question_question_id_seq'), 'Tiburón', FALSE),
    (currval('question_question_id_seq'), 'Pulpo', FALSE),
    (currval('question_question_id_seq'), 'Pez espada', FALSE);

-- Ciencia 19
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué órgano permite la visión?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Ojo', TRUE),
    (currval('question_question_id_seq'), 'Piel', FALSE),
    (currval('question_question_id_seq'), 'Pulmón', FALSE),
    (currval('question_question_id_seq'), 'Estómago', FALSE);

-- Ciencia 20
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué gas respiran las plantas?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Dióxido de carbono', TRUE),
    (currval('question_question_id_seq'), 'Oxígeno', FALSE),
    (currval('question_question_id_seq'), 'Nitrógeno', FALSE),
    (currval('question_question_id_seq'), 'Helio', FALSE);


-- Historia 6
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué año cayó el Imperio Romano de Occidente?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), '476', TRUE),
    (currval('question_question_id_seq'), '1492', FALSE),
    (currval('question_question_id_seq'), '1066', FALSE),
    (currval('question_question_id_seq'), '800', FALSE);

-- Historia 7
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue conocido como el Libertador de América?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Simón Bolívar', TRUE),
    (currval('question_question_id_seq'), 'José de San Martín', FALSE),
    (currval('question_question_id_seq'), 'Napoleón', FALSE),
    (currval('question_question_id_seq'), 'Che Guevara', FALSE);

-- Historia 8
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país inició la Revolución Industrial?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Reino Unido', TRUE),
    (currval('question_question_id_seq'), 'Francia', FALSE),
    (currval('question_question_id_seq'), 'Alemania', FALSE),
    (currval('question_question_id_seq'), 'Estados Unidos', FALSE);

-- Historia 9
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué tratado puso fin a la Primera Guerra Mundial?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Tratado de Versalles', TRUE),
    (currval('question_question_id_seq'), 'Tratado de París', FALSE),
    (currval('question_question_id_seq'), 'Tratado de Tordesillas', FALSE),
    (currval('question_question_id_seq'), 'Tratado de Ginebra', FALSE);

-- Historia 10
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién pintó la Última Cena?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Leonardo da Vinci', TRUE),
    (currval('question_question_id_seq'), 'Miguel Ángel', FALSE),
    (currval('question_question_id_seq'), 'Donatello', FALSE),
    (currval('question_question_id_seq'), 'Rafael', FALSE);

-- Historia 11
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué ciudad fue destruida por el Vesubio en el año 79?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Pompeya', TRUE),
    (currval('question_question_id_seq'), 'Roma', FALSE),
    (currval('question_question_id_seq'), 'Nápoles', FALSE),
    (currval('question_question_id_seq'), 'Venecia', FALSE);

-- Historia 12
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue el faraón más famoso del Antiguo Egipto?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Tutankamón', TRUE),
    (currval('question_question_id_seq'), 'Ramsés II', FALSE),
    (currval('question_question_id_seq'), 'Cleopatra', FALSE),
    (currval('question_question_id_seq'), 'Akenatón', FALSE);

-- Historia 13
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué conflicto enfrentó a Estados Unidos y la URSS sin combates directos?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Guerra Fría', TRUE),
    (currval('question_question_id_seq'), 'Primera Guerra Mundial', FALSE),
    (currval('question_question_id_seq'), 'Guerra Civil Española', FALSE),
    (currval('question_question_id_seq'), 'Guerra de Vietnam', FALSE);

-- Historia 14
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué imperio construyó el Coliseo?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Imperio Romano', TRUE),
    (currval('question_question_id_seq'), 'Imperio Bizantino', FALSE),
    (currval('question_question_id_seq'), 'Imperio Persa', FALSE),
    (currval('question_question_id_seq'), 'Imperio Otomano', FALSE);

-- Historia 15
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue el dictador de Alemania durante la Segunda Guerra Mundial?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Adolf Hitler', TRUE),
    (currval('question_question_id_seq'), 'Benito Mussolini', FALSE),
    (currval('question_question_id_seq'), 'Josef Stalin', FALSE),
    (currval('question_question_id_seq'), 'Winston Churchill', FALSE);

-- Historia 16
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué guerra terminó con el Tratado de Utrecht?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Guerra de Sucesión Española', TRUE),
    (currval('question_question_id_seq'), 'Guerra de los Treinta Años', FALSE),
    (currval('question_question_id_seq'), 'Guerra de Crimea', FALSE),
    (currval('question_question_id_seq'), 'Guerra de Independencia', FALSE);

-- Historia 17
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién escribió 'El Príncipe'?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Maquiavelo', TRUE),
    (currval('question_question_id_seq'), 'Platón', FALSE),
    (currval('question_question_id_seq'), 'Aristóteles', FALSE),
    (currval('question_question_id_seq'), 'Sun Tzu', FALSE);

-- Historia 18
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país colonizó Filipinas?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'España', TRUE),
    (currval('question_question_id_seq'), 'Portugal', FALSE),
    (currval('question_question_id_seq'), 'Reino Unido', FALSE),
    (currval('question_question_id_seq'), 'Países Bajos', FALSE);

-- Historia 19
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué invento revolucionó la imprenta?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'La imprenta de Gutenberg', TRUE),
    (currval('question_question_id_seq'), 'La máquina de escribir', FALSE),
    (currval('question_question_id_seq'), 'La linotipia', FALSE),
    (currval('question_question_id_seq'), 'La imprenta offset', FALSE);

-- Historia 20
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué movimiento acabó con la monarquía absoluta en Francia?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'La Revolución Francesa', TRUE),
    (currval('question_question_id_seq'), 'La Ilustración', FALSE),
    (currval('question_question_id_seq'), 'El Romanticismo', FALSE),
    (currval('question_question_id_seq'), 'La Comuna de París', FALSE);

-- Geografía 6
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país tiene la ciudad de Estambul?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Turquía', TRUE),
    (currval('question_question_id_seq'), 'Grecia', FALSE),
    (currval('question_question_id_seq'), 'Italia', FALSE),
    (currval('question_question_id_seq'), 'Egipto', FALSE);

-- Geografía 7
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué continente está Madagascar?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'África', TRUE),
    (currval('question_question_id_seq'), 'Asia', FALSE),
    (currval('question_question_id_seq'), 'Oceanía', FALSE),
    (currval('question_question_id_seq'), 'Europa', FALSE);

-- Geografía 8
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el océano más grande?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Océano Pacífico', TRUE),
    (currval('question_question_id_seq'), 'Atlántico', FALSE),
    (currval('question_question_id_seq'), 'Índico', FALSE),
    (currval('question_question_id_seq'), 'Ártico', FALSE);

-- Geografía 9
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país tiene forma de bota?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Italia', TRUE),
    (currval('question_question_id_seq'), 'España', FALSE),
    (currval('question_question_id_seq'), 'Grecia', FALSE),
    (currval('question_question_id_seq'), 'Francia', FALSE);

-- Geografía 10
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué cordillera está entre Chile y Argentina?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Cordillera de los Andes', TRUE),
    (currval('question_question_id_seq'), 'Himalayas', FALSE),
    (currval('question_question_id_seq'), 'Alpes', FALSE),
    (currval('question_question_id_seq'), 'Pirineos', FALSE);

-- Geografía 11
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el país más pequeño del mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Ciudad del Vaticano', TRUE),
    (currval('question_question_id_seq'), 'Mónaco', FALSE),
    (currval('question_question_id_seq'), 'San Marino', FALSE),
    (currval('question_question_id_seq'), 'Liechtenstein', FALSE);

-- Geografía 12
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país tiene más población?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'China', TRUE),
    (currval('question_question_id_seq'), 'India', FALSE),
    (currval('question_question_id_seq'), 'EE.UU.', FALSE),
    (currval('question_question_id_seq'), 'Indonesia', FALSE);

-- Geografía 13
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué ciudad es la capital de Japón?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Tokio', TRUE),
    (currval('question_question_id_seq'), 'Kioto', FALSE),
    (currval('question_question_id_seq'), 'Osaka', FALSE),
    (currval('question_question_id_seq'), 'Nagoya', FALSE);

-- Geografía 14
INSERT INTO question (questiontext, category_id)
VALUES ('¿Dónde se encuentra el desierto del Sahara?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'África', TRUE),
    (currval('question_question_id_seq'), 'Asia', FALSE),
    (currval('question_question_id_seq'), 'América', FALSE),
    (currval('question_question_id_seq'), 'Australia', FALSE);

-- Geografía 15
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país está más al norte?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Noruega', TRUE),
    (currval('question_question_id_seq'), 'Italia', FALSE),
    (currval('question_question_id_seq'), 'Francia', FALSE),
    (currval('question_question_id_seq'), 'Alemania', FALSE);

-- Geografía 16
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país limita con más naciones?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'China', TRUE),
    (currval('question_question_id_seq'), 'Rusia', FALSE),
    (currval('question_question_id_seq'), 'Brasil', FALSE),
    (currval('question_question_id_seq'), 'India', FALSE);

-- Geografía 17
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué río atraviesa París?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Sena', TRUE),
    (currval('question_question_id_seq'), 'Danubio', FALSE),
    (currval('question_question_id_seq'), 'Loira', FALSE),
    (currval('question_question_id_seq'), 'Tíber', FALSE);

-- Geografía 18
INSERT INTO question (questiontext, category_id)
VALUES ('¿Dónde se encuentra el Círculo Polar Ártico?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Hemisferio Norte', TRUE),
    (currval('question_question_id_seq'), 'Hemisferio Sur', FALSE),
    (currval('question_question_id_seq'), 'Ecuador', FALSE),
    (currval('question_question_id_seq'), 'Trópico de Cáncer', FALSE);

-- Geografía 19
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el país más largo de norte a sur?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Chile', TRUE),
    (currval('question_question_id_seq'), 'Argentina', FALSE),
    (currval('question_question_id_seq'), 'Canadá', FALSE),
    (currval('question_question_id_seq'), 'Noruega', FALSE);

-- Geografía 20
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué mar baña las costas de Grecia?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mar Egeo', TRUE),
    (currval('question_question_id_seq'), 'Mar Negro', FALSE),
    (currval('question_question_id_seq'), 'Mar Rojo', FALSE),
    (currval('question_question_id_seq'), 'Mar Báltico', FALSE);

-- Entretenimiento 6
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién interpretó a Iron Man?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Robert Downey Jr.', TRUE),
    (currval('question_question_id_seq'), 'Chris Evans', FALSE),
    (currval('question_question_id_seq'), 'Chris Hemsworth', FALSE),
    (currval('question_question_id_seq'), 'Mark Ruffalo', FALSE);

-- Entretenimiento 7
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué película ganó el Oscar a mejor película en 1994?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Forrest Gump', TRUE),
    (currval('question_question_id_seq'), 'Pulp Fiction', FALSE),
    (currval('question_question_id_seq'), 'The Shawshank Redemption', FALSE),
    (currval('question_question_id_seq'), 'Quiz Show', FALSE);

-- Entretenimiento 8
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué serie es protagonizada por Eleven?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Stranger Things', TRUE),
    (currval('question_question_id_seq'), 'The Witcher', FALSE),
    (currval('question_question_id_seq'), 'Dark', FALSE),
    (currval('question_question_id_seq'), 'The Mandalorian', FALSE);

-- Entretenimiento 9
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién canta 'Blinding Lights'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'The Weeknd', TRUE),
    (currval('question_question_id_seq'), 'Drake', FALSE),
    (currval('question_question_id_seq'), 'Bruno Mars', FALSE),
    (currval('question_question_id_seq'), 'Post Malone', FALSE);

-- Entretenimiento 10
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué personaje es el mejor amigo de Shrek?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Burro', TRUE),
    (currval('question_question_id_seq'), 'Gato con Botas', FALSE),
    (currval('question_question_id_seq'), 'Fiona', FALSE),
    (currval('question_question_id_seq'), 'Lord Farquaad', FALSE);

-- Entretenimiento 11
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué grupo musical lanzó 'Yesterday'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'The Beatles', TRUE),
    (currval('question_question_id_seq'), 'Queen', FALSE),
    (currval('question_question_id_seq'), 'ABBA', FALSE),
    (currval('question_question_id_seq'), 'Rolling Stones', FALSE);

-- Entretenimiento 12
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién creó Mickey Mouse?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Walt Disney', TRUE),
    (currval('question_question_id_seq'), 'Tex Avery', FALSE),
    (currval('question_question_id_seq'), 'Hanna-Barbera', FALSE),
    (currval('question_question_id_seq'), 'Matt Groening', FALSE);

-- Entretenimiento 13
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué saga aparece Katniss Everdeen?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Los Juegos del Hambre', TRUE),
    (currval('question_question_id_seq'), 'Divergente', FALSE),
    (currval('question_question_id_seq'), 'Crepúsculo', FALSE),
    (currval('question_question_id_seq'), 'Harry Potter', FALSE);

-- Entretenimiento 14
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué actor interpretó al Joker en 'The Dark Knight'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Heath Ledger', TRUE),
    (currval('question_question_id_seq'), 'Joaquin Phoenix', FALSE),
    (currval('question_question_id_seq'), 'Jack Nicholson', FALSE),
    (currval('question_question_id_seq'), 'Jared Leto', FALSE);

-- Entretenimiento 15
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién canta 'Rolling in the Deep'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Adele', TRUE),
    (currval('question_question_id_seq'), 'Taylor Swift', FALSE),
    (currval('question_question_id_seq'), 'Lady Gaga', FALSE),
    (currval('question_question_id_seq'), 'Dua Lipa', FALSE);

-- Entretenimiento 16
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué película aparece el personaje Jack Sparrow?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Piratas del Caribe', TRUE),
    (currval('question_question_id_seq'), 'Titanic', FALSE),
    (currval('question_question_id_seq'), 'Avatar', FALSE),
    (currval('question_question_id_seq'), 'Los Vengadores', FALSE);

-- Entretenimiento 17
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué banda compuso 'Bohemian Rhapsody'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Queen', TRUE),
    (currval('question_question_id_seq'), 'The Beatles', FALSE),
    (currval('question_question_id_seq'), 'Pink Floyd', FALSE),
    (currval('question_question_id_seq'), 'Nirvana', FALSE);

-- Entretenimiento 18
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué princesa de Disney tiene un tigre como mascota?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Jazmín', TRUE),
    (currval('question_question_id_seq'), 'Ariel', FALSE),
    (currval('question_question_id_seq'), 'Blancanieves', FALSE),
    (currval('question_question_id_seq'), 'Cenicienta', FALSE);

-- Entretenimiento 19
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién interpretó a Batman en 'The Dark Knight'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Christian Bale', TRUE),
    (currval('question_question_id_seq'), 'Ben Affleck', FALSE),
    (currval('question_question_id_seq'), 'Michael Keaton', FALSE),
    (currval('question_question_id_seq'), 'Robert Pattinson', FALSE);

-- Entretenimiento 20
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué saga tiene un anillo como objeto principal?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'El Señor de los Anillos', TRUE),
    (currval('question_question_id_seq'), 'Harry Potter', FALSE),
    (currval('question_question_id_seq'), 'Star Wars', FALSE),
    (currval('question_question_id_seq'), 'Percy Jackson', FALSE);


-- 20 preguntas únicas de Historia, formuladas

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué año comenzó la Primera Guerra Mundial?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), '1914', TRUE),
    (currval('question_question_id_seq'), '1912', FALSE),
    (currval('question_question_id_seq'), '1916', FALSE),
    (currval('question_question_id_seq'), '1920', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué civilización construyó Machu Picchu?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Inca', TRUE),
    (currval('question_question_id_seq'), 'Azteca', FALSE),
    (currval('question_question_id_seq'), 'Maya', FALSE),
    (currval('question_question_id_seq'), 'Olmeca', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue el libertador de Argentina, Chile y Perú?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'José de San Martín', TRUE),
    (currval('question_question_id_seq'), 'Simón Bolívar', FALSE),
    (currval('question_question_id_seq'), 'Artigas', FALSE),
    (currval('question_question_id_seq'), 'Belgrano', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país lanzó la primera bomba atómica en guerra?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Estados Unidos', TRUE),
    (currval('question_question_id_seq'), 'Alemania', FALSE),
    (currval('question_question_id_seq'), 'Japón', FALSE),
    (currval('question_question_id_seq'), 'URSS', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué año cayó el Muro de Berlín?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), '1989', TRUE),
    (currval('question_question_id_seq'), '1991', FALSE),
    (currval('question_question_id_seq'), '1979', FALSE),
    (currval('question_question_id_seq'), '1995', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue el primer emperador romano?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Augusto', TRUE),
    (currval('question_question_id_seq'), 'Julio César', FALSE),
    (currval('question_question_id_seq'), 'Nerón', FALSE),
    (currval('question_question_id_seq'), 'Tiberio', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué imperio era gobernado por los zares?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Ruso', TRUE),
    (currval('question_question_id_seq'), 'Chino', FALSE),
    (currval('question_question_id_seq'), 'Bizantino', FALSE),
    (currval('question_question_id_seq'), 'Persa', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál fue el líder de la Alemania nazi?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Adolf Hitler', TRUE),
    (currval('question_question_id_seq'), 'Benito Mussolini', FALSE),
    (currval('question_question_id_seq'), 'Joseph Stalin', FALSE),
    (currval('question_question_id_seq'), 'Winston Churchill', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué siglo fue la Revolución Francesa?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Siglo XVIII', TRUE),
    (currval('question_question_id_seq'), 'Siglo XVII', FALSE),
    (currval('question_question_id_seq'), 'Siglo XIX', FALSE),
    (currval('question_question_id_seq'), 'Siglo XVI', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué nave llevó a Cristóbal Colón a América?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'La Santa María', TRUE),
    (currval('question_question_id_seq'), 'La Pinta', FALSE),
    (currval('question_question_id_seq'), 'La Niña', FALSE),
    (currval('question_question_id_seq'), 'La Victoria', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién lideró la independencia de Venezuela?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Simón Bolívar', TRUE),
    (currval('question_question_id_seq'), 'José de San Martín', FALSE),
    (currval('question_question_id_seq'), 'Sucre', FALSE),
    (currval('question_question_id_seq'), 'O''Higgins', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué ciudad fue destruida por el Vesubio?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Pompeya', TRUE),
    (currval('question_question_id_seq'), 'Roma', FALSE),
    (currval('question_question_id_seq'), 'Atenas', FALSE),
    (currval('question_question_id_seq'), 'Cartago', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué año se firmó la Declaración de Independencia de EE.UU.?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), '1776', TRUE),
    (currval('question_question_id_seq'), '1789', FALSE),
    (currval('question_question_id_seq'), '1812', FALSE),
    (currval('question_question_id_seq'), '1750', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué presidente argentino murió en ejercicio en 1974?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Juan Domingo Perón', TRUE),
    (currval('question_question_id_seq'), 'Raúl Alfonsín', FALSE),
    (currval('question_question_id_seq'), 'Arturo Illia', FALSE),
    (currval('question_question_id_seq'), 'Carlos Menem', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué civilización antigua vivía en el actual Irak?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mesopotámica', TRUE),
    (currval('question_question_id_seq'), 'Egipcia', FALSE),
    (currval('question_question_id_seq'), 'China', FALSE),
    (currval('question_question_id_seq'), 'Griega', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué tratado puso fin a la Primera Guerra Mundial?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Tratado de Versalles', TRUE),
    (currval('question_question_id_seq'), 'Tratado de París', FALSE),
    (currval('question_question_id_seq'), 'Tratado de Tordesillas', FALSE),
    (currval('question_question_id_seq'), 'Pacto de Varsovia', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue conocido como el 'Napoleón del Río de la Plata'?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Juan Manuel de Rosas', TRUE),
    (currval('question_question_id_seq'), 'Belgrano', FALSE),
    (currval('question_question_id_seq'), 'Artigas', FALSE),
    (currval('question_question_id_seq'), 'Rivadavia', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país colonizó la India?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Reino Unido', TRUE),
    (currval('question_question_id_seq'), 'Francia', FALSE),
    (currval('question_question_id_seq'), 'Portugal', FALSE),
    (currval('question_question_id_seq'), 'España', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué acontecimiento histórico comenzó en 1939?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Segunda Guerra Mundial', TRUE),
    (currval('question_question_id_seq'), 'Guerra Fría', FALSE),
    (currval('question_question_id_seq'), 'Revolución Rusa', FALSE),
    (currval('question_question_id_seq'), 'Guerra de Vietnam', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué faraón egipcio fue descubierto en 1922?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Tutankamón', TRUE),
    (currval('question_question_id_seq'), 'Ramsés II', FALSE),
    (currval('question_question_id_seq'), 'Cleopatra', FALSE),
    (currval('question_question_id_seq'), 'Akhenatón', FALSE);

-- 20 preguntas únicas de Geografía, formuladas

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el río más largo del mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Amazonas', TRUE),
    (currval('question_question_id_seq'), 'Nilo', FALSE),
    (currval('question_question_id_seq'), 'Yangtsé', FALSE),
    (currval('question_question_id_seq'), 'Mississippi', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué continente se encuentra Egipto?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'África', TRUE),
    (currval('question_question_id_seq'), 'Asia', FALSE),
    (currval('question_question_id_seq'), 'Europa', FALSE),
    (currval('question_question_id_seq'), 'América', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la capital de Canadá?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Ottawa', TRUE),
    (currval('question_question_id_seq'), 'Toronto', FALSE),
    (currval('question_question_id_seq'), 'Vancouver', FALSE),
    (currval('question_question_id_seq'), 'Montreal', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué océano está al este de África?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Océano Índico', TRUE),
    (currval('question_question_id_seq'), 'Océano Pacífico', FALSE),
    (currval('question_question_id_seq'), 'Océano Atlántico', FALSE),
    (currval('question_question_id_seq'), 'Océano Ártico', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país tiene forma de bota?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Italia', TRUE),
    (currval('question_question_id_seq'), 'España', FALSE),
    (currval('question_question_id_seq'), 'Francia', FALSE),
    (currval('question_question_id_seq'), 'Grecia', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué cordillera atraviesa América del Sur?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Los Andes', TRUE),
    (currval('question_question_id_seq'), 'Los Alpes', FALSE),
    (currval('question_question_id_seq'), 'El Himalaya', FALSE),
    (currval('question_question_id_seq'), 'Los Pirineos', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país tiene más islas en el mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Suecia', TRUE),
    (currval('question_question_id_seq'), 'Filipinas', FALSE),
    (currval('question_question_id_seq'), 'Indonesia', FALSE),
    (currval('question_question_id_seq'), 'Grecia', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la capital de Australia?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Canberra', TRUE),
    (currval('question_question_id_seq'), 'Sídney', FALSE),
    (currval('question_question_id_seq'), 'Melbourne', FALSE),
    (currval('question_question_id_seq'), 'Brisbane', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país limita con Estados Unidos al sur?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'México', TRUE),
    (currval('question_question_id_seq'), 'Canadá', FALSE),
    (currval('question_question_id_seq'), 'Brasil', FALSE),
    (currval('question_question_id_seq'), 'Guatemala', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el país más grande del mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Rusia', TRUE),
    (currval('question_question_id_seq'), 'Canadá', FALSE),
    (currval('question_question_id_seq'), 'China', FALSE),
    (currval('question_question_id_seq'), 'Estados Unidos', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué desierto es el más grande del mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Antártico', TRUE),
    (currval('question_question_id_seq'), 'Sahara', FALSE),
    (currval('question_question_id_seq'), 'Gobi', FALSE),
    (currval('question_question_id_seq'), 'Kalahari', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Dónde se encuentra la Torre Eiffel?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Francia', TRUE),
    (currval('question_question_id_seq'), 'Italia', FALSE),
    (currval('question_question_id_seq'), 'Alemania', FALSE),
    (currval('question_question_id_seq'), 'Bélgica', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el país con más población del mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'China', TRUE),
    (currval('question_question_id_seq'), 'India', FALSE),
    (currval('question_question_id_seq'), 'Estados Unidos', FALSE),
    (currval('question_question_id_seq'), 'Indonesia', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué continente tiene más países?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'África', TRUE),
    (currval('question_question_id_seq'), 'Asia', FALSE),
    (currval('question_question_id_seq'), 'Europa', FALSE),
    (currval('question_question_id_seq'), 'América', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué país se encuentra el monte Everest?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Nepal', TRUE),
    (currval('question_question_id_seq'), 'India', FALSE),
    (currval('question_question_id_seq'), 'China', FALSE),
    (currval('question_question_id_seq'), 'Bután', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país europeo tiene forma de península y está al sur?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Italia', TRUE),
    (currval('question_question_id_seq'), 'Portugal', FALSE),
    (currval('question_question_id_seq'), 'Grecia', FALSE),
    (currval('question_question_id_seq'), 'España', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país tiene más volcanes activos?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Indonesia', TRUE),
    (currval('question_question_id_seq'), 'Japón', FALSE),
    (currval('question_question_id_seq'), 'Chile', FALSE),
    (currval('question_question_id_seq'), 'Islandia', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la capital de Turquía?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Ankara', TRUE),
    (currval('question_question_id_seq'), 'Estambul', FALSE),
    (currval('question_question_id_seq'), 'Izmir', FALSE),
    (currval('question_question_id_seq'), 'Antalya', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué país se encuentra el Taj Mahal?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'India', TRUE),
    (currval('question_question_id_seq'), 'Pakistán', FALSE),
    (currval('question_question_id_seq'), 'Irán', FALSE),
    (currval('question_question_id_seq'), 'Nepal', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la capital de Brasil?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Brasilia', TRUE),
    (currval('question_question_id_seq'), 'Río de Janeiro', FALSE),
    (currval('question_question_id_seq'), 'São Paulo', FALSE),
    (currval('question_question_id_seq'), 'Salvador', FALSE);

-- 20 preguntas únicas de Entretenimiento, formuladas

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién interpretó a Harry Potter en las películas?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Daniel Radcliffe', TRUE),
    (currval('question_question_id_seq'), 'Rupert Grint', FALSE),
    (currval('question_question_id_seq'), 'Elijah Wood', FALSE),
    (currval('question_question_id_seq'), 'Tom Holland', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué personaje vive en una piña bajo el mar?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Bob Esponja', TRUE),
    (currval('question_question_id_seq'), 'Patricio', FALSE),
    (currval('question_question_id_seq'), 'Calamardo', FALSE),
    (currval('question_question_id_seq'), 'Dory', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la película animada sobre juguetes que cobran vida?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Toy Story', TRUE),
    (currval('question_question_id_seq'), 'Shrek', FALSE),
    (currval('question_question_id_seq'), 'Frozen', FALSE),
    (currval('question_question_id_seq'), 'Coco', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué superhéroe es conocido como el Hombre Araña?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Spider-Man', TRUE),
    (currval('question_question_id_seq'), 'Batman', FALSE),
    (currval('question_question_id_seq'), 'Iron Man', FALSE),
    (currval('question_question_id_seq'), 'Flash', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién cantó 'Thriller'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Michael Jackson', TRUE),
    (currval('question_question_id_seq'), 'Prince', FALSE),
    (currval('question_question_id_seq'), 'Elvis Presley', FALSE),
    (currval('question_question_id_seq'), 'Freddie Mercury', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué serie popular tiene dragones y casas nobles?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Game of Thrones', TRUE),
    (currval('question_question_id_seq'), 'Vikings', FALSE),
    (currval('question_question_id_seq'), 'The Witcher', FALSE),
    (currval('question_question_id_seq'), 'The Crown', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué parque se encuentra el castillo de Disney?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Disneyland', TRUE),
    (currval('question_question_id_seq'), 'Universal Studios', FALSE),
    (currval('question_question_id_seq'), 'Parque Warner', FALSE),
    (currval('question_question_id_seq'), 'Six Flags', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué saga tiene un anillo único y hobbits?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'El Señor de los Anillos', TRUE),
    (currval('question_question_id_seq'), 'Harry Potter', FALSE),
    (currval('question_question_id_seq'), 'Narnia', FALSE),
    (currval('question_question_id_seq'), 'Star Wars', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién interpretó a Jack en Titanic?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Leonardo DiCaprio', TRUE),
    (currval('question_question_id_seq'), 'Brad Pitt', FALSE),
    (currval('question_question_id_seq'), 'Matt Damon', FALSE),
    (currval('question_question_id_seq'), 'Johnny Depp', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la banda que compuso 'Bohemian Rhapsody'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Queen', TRUE),
    (currval('question_question_id_seq'), 'The Beatles', FALSE),
    (currval('question_question_id_seq'), 'Pink Floyd', FALSE),
    (currval('question_question_id_seq'), 'The Rolling Stones', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué película tiene como protagonista a un ogro verde?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Shrek', TRUE),
    (currval('question_question_id_seq'), 'Monsters Inc.', FALSE),
    (currval('question_question_id_seq'), 'Kung Fu Panda', FALSE),
    (currval('question_question_id_seq'), 'Ratatouille', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué princesa Disney pierde un zapato de cristal?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Cenicienta', TRUE),
    (currval('question_question_id_seq'), 'Aurora', FALSE),
    (currval('question_question_id_seq'), 'Blancanieves', FALSE),
    (currval('question_question_id_seq'), 'Ariel', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué actor interpreta a Iron Man en el MCU?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Robert Downey Jr.', TRUE),
    (currval('question_question_id_seq'), 'Chris Evans', FALSE),
    (currval('question_question_id_seq'), 'Mark Ruffalo', FALSE),
    (currval('question_question_id_seq'), 'Chris Hemsworth', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué videojuego consiste en construir con bloques?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Minecraft', TRUE),
    (currval('question_question_id_seq'), 'Fortnite', FALSE),
    (currval('question_question_id_seq'), 'Roblox', FALSE),
    (currval('question_question_id_seq'), 'Among Us', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién canta la canción 'Hello' de 2015?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Adele', TRUE),
    (currval('question_question_id_seq'), 'Taylor Swift', FALSE),
    (currval('question_question_id_seq'), 'Beyoncé', FALSE),
    (currval('question_question_id_seq'), 'Lana del Rey', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el nombre del mago enemigo de Harry Potter?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Voldemort', TRUE),
    (currval('question_question_id_seq'), 'Dumbledore', FALSE),
    (currval('question_question_id_seq'), 'Snape', FALSE),
    (currval('question_question_id_seq'), 'Sirius Black', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué película animada tiene una canción llamada 'Let It Go'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Frozen', TRUE),
    (currval('question_question_id_seq'), 'Moana', FALSE),
    (currval('question_question_id_seq'), 'Encanto', FALSE),
    (currval('question_question_id_seq'), 'Valiente', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué color tiene el sable de luz de Luke Skywalker?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Azul', TRUE),
    (currval('question_question_id_seq'), 'Rojo', FALSE),
    (currval('question_question_id_seq'), 'Verde', FALSE),
    (currval('question_question_id_seq'), 'Amarillo', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué película se desarrolla en un hotel embrujado y tiene a Jack Nicholson?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'El Resplandor', TRUE),
    (currval('question_question_id_seq'), 'Psicosis', FALSE),
    (currval('question_question_id_seq'), 'It', FALSE),
    (currval('question_question_id_seq'), 'El Conjuro', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué comedia musical trata sobre una niñera mágica llamada Mary?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mary Poppins', TRUE),
    (currval('question_question_id_seq'), 'Annie', FALSE),
    (currval('question_question_id_seq'), 'La Novicia Rebelde', FALSE),
    (currval('question_question_id_seq'), 'Encantada', FALSE);

-- 20 preguntas adicionales de Ciencia, formuladas

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el gas que más abunda en la atmósfera terrestre?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Nitrógeno', TRUE),
    (currval('question_question_id_seq'), 'Oxígeno', FALSE),
    (currval('question_question_id_seq'), 'Dióxido de carbono', FALSE),
    (currval('question_question_id_seq'), 'Hidrógeno', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué nombre recibe el cambio de estado de gas a líquido?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Condensación', TRUE),
    (currval('question_question_id_seq'), 'Evaporación', FALSE),
    (currval('question_question_id_seq'), 'Fusión', FALSE),
    (currval('question_question_id_seq'), 'Sublimación', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué hueso protege el cerebro?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Cráneo', TRUE),
    (currval('question_question_id_seq'), 'Columna', FALSE),
    (currval('question_question_id_seq'), 'Mandíbula', FALSE),
    (currval('question_question_id_seq'), 'Esternón', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué inventó Alexander Graham Bell?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'El teléfono', TRUE),
    (currval('question_question_id_seq'), 'La radio', FALSE),
    (currval('question_question_id_seq'), 'La televisión', FALSE),
    (currval('question_question_id_seq'), 'El fonógrafo', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué tipo de animal es una mariposa?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Insecto', TRUE),
    (currval('question_question_id_seq'), 'Molusco', FALSE),
    (currval('question_question_id_seq'), 'Anfibio', FALSE),
    (currval('question_question_id_seq'), 'Ave', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué nombre recibe la ciencia que estudia los seres vivos?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Biología', TRUE),
    (currval('question_question_id_seq'), 'Física', FALSE),
    (currval('question_question_id_seq'), 'Química', FALSE),
    (currval('question_question_id_seq'), 'Geología', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué planeta es famoso por su gran mancha roja?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Júpiter', TRUE),
    (currval('question_question_id_seq'), 'Saturno', FALSE),
    (currval('question_question_id_seq'), 'Neptuno', FALSE),
    (currval('question_question_id_seq'), 'Urano', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué tipo de energía usa un panel solar?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Energía solar', TRUE),
    (currval('question_question_id_seq'), 'Energía eólica', FALSE),
    (currval('question_question_id_seq'), 'Energía térmica', FALSE),
    (currval('question_question_id_seq'), 'Energía nuclear', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el órgano principal del sistema nervioso?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Cerebro', TRUE),
    (currval('question_question_id_seq'), 'Corazón', FALSE),
    (currval('question_question_id_seq'), 'Hígado', FALSE),
    (currval('question_question_id_seq'), 'Pulmón', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué instrumento mide la temperatura?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Termómetro', TRUE),
    (currval('question_question_id_seq'), 'Barómetro', FALSE),
    (currval('question_question_id_seq'), 'Anemómetro', FALSE),
    (currval('question_question_id_seq'), 'Higrómetro', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué sustancia da color verde a las plantas?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Clorofila', TRUE),
    (currval('question_question_id_seq'), 'Savia', FALSE),
    (currval('question_question_id_seq'), 'Celulosa', FALSE),
    (currval('question_question_id_seq'), 'Nitrógeno', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué especie humana es la actual?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Homo sapiens', TRUE),
    (currval('question_question_id_seq'), 'Homo erectus', FALSE),
    (currval('question_question_id_seq'), 'Homo habilis', FALSE),
    (currval('question_question_id_seq'), 'Neandertal', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el número atómico del oxígeno?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), '8', TRUE),
    (currval('question_question_id_seq'), '16', FALSE),
    (currval('question_question_id_seq'), '2', FALSE),
    (currval('question_question_id_seq'), '12', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué científico desarrolló la teoría de la relatividad?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Albert Einstein', TRUE),
    (currval('question_question_id_seq'), 'Isaac Newton', FALSE),
    (currval('question_question_id_seq'), 'Stephen Hawking', FALSE),
    (currval('question_question_id_seq'), 'Galileo Galilei', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué planeta tiene un día más largo que su año?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Venus', TRUE),
    (currval('question_question_id_seq'), 'Mercurio', FALSE),
    (currval('question_question_id_seq'), 'Marte', FALSE),
    (currval('question_question_id_seq'), 'Saturno', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué parte de la célula produce energía?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mitocondria', TRUE),
    (currval('question_question_id_seq'), 'Núcleo', FALSE),
    (currval('question_question_id_seq'), 'Ribosoma', FALSE),
    (currval('question_question_id_seq'), 'Citoplasma', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué animal es el más grande del mundo?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Ballena azul', TRUE),
    (currval('question_question_id_seq'), 'Elefante africano', FALSE),
    (currval('question_question_id_seq'), 'Orca', FALSE),
    (currval('question_question_id_seq'), 'Rinoceronte', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué fuerza mantiene a los planetas en órbita?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Gravedad', TRUE),
    (currval('question_question_id_seq'), 'Magnetismo', FALSE),
    (currval('question_question_id_seq'), 'Fricción', FALSE),
    (currval('question_question_id_seq'), 'Inercia', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué proceso convierte el agua en vapor por calor?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Evaporación', TRUE),
    (currval('question_question_id_seq'), 'Condensación', FALSE),
    (currval('question_question_id_seq'), 'Sublimación', FALSE),
    (currval('question_question_id_seq'), 'Fusión', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué aparato transforma la energía eléctrica en sonido?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Altavoz', TRUE),
    (currval('question_question_id_seq'), 'Micrófono', FALSE),
    (currval('question_question_id_seq'), 'Bocina', FALSE),
    (currval('question_question_id_seq'), 'Radio', FALSE);

-- 20 preguntas adicionales de Historia, formuladas

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué guerra terminó con la caída de Napoleón?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Guerra Napoleónica', TRUE),
    (currval('question_question_id_seq'), 'Guerra Civil Española', FALSE),
    (currval('question_question_id_seq'), 'Primera Guerra Mundial', FALSE),
    (currval('question_question_id_seq'), 'Guerra de Crimea', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue el primer presidente de Estados Unidos?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'George Washington', TRUE),
    (currval('question_question_id_seq'), 'Abraham Lincoln', FALSE),
    (currval('question_question_id_seq'), 'Thomas Jefferson', FALSE),
    (currval('question_question_id_seq'), 'John Adams', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué año llegó Cristóbal Colón a América?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), '1492', TRUE),
    (currval('question_question_id_seq'), '1501', FALSE),
    (currval('question_question_id_seq'), '1485', FALSE),
    (currval('question_question_id_seq'), '1478', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál fue la capital del Imperio Bizantino?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Constantinopla', TRUE),
    (currval('question_question_id_seq'), 'Roma', FALSE),
    (currval('question_question_id_seq'), 'Atenas', FALSE),
    (currval('question_question_id_seq'), 'Alejandría', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué civilización inventó la escritura cuneiforme?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Sumeria', TRUE),
    (currval('question_question_id_seq'), 'Egipcia', FALSE),
    (currval('question_question_id_seq'), 'China', FALSE),
    (currval('question_question_id_seq'), 'Babilonia', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue el líder de la Revolución Cubana?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Fidel Castro', TRUE),
    (currval('question_question_id_seq'), 'Che Guevara', FALSE),
    (currval('question_question_id_seq'), 'Hugo Chávez', FALSE),
    (currval('question_question_id_seq'), 'Raúl Castro', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué evento desencadenó la Segunda Guerra Mundial?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Invasión de Polonia', TRUE),
    (currval('question_question_id_seq'), 'Ataque a Pearl Harbor', FALSE),
    (currval('question_question_id_seq'), 'Caída de Francia', FALSE),
    (currval('question_question_id_seq'), 'Bombardeo de Londres', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué líder sudafricano luchó contra el apartheid?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Nelson Mandela', TRUE),
    (currval('question_question_id_seq'), 'Desmond Tutu', FALSE),
    (currval('question_question_id_seq'), 'Steve Biko', FALSE),
    (currval('question_question_id_seq'), 'Jacob Zuma', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué emperador romano legalizó el cristianismo?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Constantino', TRUE),
    (currval('question_question_id_seq'), 'Nerón', FALSE),
    (currval('question_question_id_seq'), 'Trajano', FALSE),
    (currval('question_question_id_seq'), 'Julio César', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué tratado dividió el mundo entre España y Portugal?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Tratado de Tordesillas', TRUE),
    (currval('question_question_id_seq'), 'Tratado de Versalles', FALSE),
    (currval('question_question_id_seq'), 'Tratado de París', FALSE),
    (currval('question_question_id_seq'), 'Tratado de Utrecht', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué país se inició la Revolución Industrial?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Reino Unido', TRUE),
    (currval('question_question_id_seq'), 'Alemania', FALSE),
    (currval('question_question_id_seq'), 'Francia', FALSE),
    (currval('question_question_id_seq'), 'Estados Unidos', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién fue el último zar de Rusia?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Nicolás II', TRUE),
    (currval('question_question_id_seq'), 'Pedro el Grande', FALSE),
    (currval('question_question_id_seq'), 'Iván el Terrible', FALSE),
    (currval('question_question_id_seq'), 'Alejandro III', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué guerra enfrentó al Norte y al Sur de Estados Unidos?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Guerra Civil', TRUE),
    (currval('question_question_id_seq'), 'Guerra de Independencia', FALSE),
    (currval('question_question_id_seq'), 'Primera Guerra Mundial', FALSE),
    (currval('question_question_id_seq'), 'Guerra de Secesión Mexicana', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país fue invadido por Napoleón en su campaña fallida de invierno?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Rusia', TRUE),
    (currval('question_question_id_seq'), 'Inglaterra', FALSE),
    (currval('question_question_id_seq'), 'Austria', FALSE),
    (currval('question_question_id_seq'), 'España', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué reina inglesa es famosa por su largo reinado en el siglo XIX?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Reina Victoria', TRUE),
    (currval('question_question_id_seq'), 'Isabel I', FALSE),
    (currval('question_question_id_seq'), 'Ana Bolena', FALSE),
    (currval('question_question_id_seq'), 'Catalina de Aragón', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién escribió el 'Contrato Social'?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Jean-Jacques Rousseau', TRUE),
    (currval('question_question_id_seq'), 'Voltaire', FALSE),
    (currval('question_question_id_seq'), 'Montesquieu', FALSE),
    (currval('question_question_id_seq'), 'Locke', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué ciudad fue dividida por un muro durante la Guerra Fría?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Berlín', TRUE),
    (currval('question_question_id_seq'), 'Praga', FALSE),
    (currval('question_question_id_seq'), 'Varsovia', FALSE),
    (currval('question_question_id_seq'), 'Moscú', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué imperio construyó una gran muralla para defenderse?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Chino', TRUE),
    (currval('question_question_id_seq'), 'Romano', FALSE),
    (currval('question_question_id_seq'), 'Persa', FALSE),
    (currval('question_question_id_seq'), 'Mongol', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué movimiento social luchó por el voto femenino?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Sufragismo', TRUE),
    (currval('question_question_id_seq'), 'Feminismo moderno', FALSE),
    (currval('question_question_id_seq'), 'Abolicionismo', FALSE),
    (currval('question_question_id_seq'), 'Movimiento obrero', FALSE);

-- Historia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país lideró las Cruzadas en la Edad Media?', (SELECT category_id FROM category WHERE name = 'Historia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Francia', TRUE),
    (currval('question_question_id_seq'), 'Alemania', FALSE),
    (currval('question_question_id_seq'), 'España', FALSE),
    (currval('question_question_id_seq'), 'Italia', FALSE);

-- 20 preguntas adicionales de Geografía, formuladas

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país tiene la mayor cantidad de habitantes?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'China', TRUE),
    (currval('question_question_id_seq'), 'India', FALSE),
    (currval('question_question_id_seq'), 'Estados Unidos', FALSE),
    (currval('question_question_id_seq'), 'Brasil', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué continente no tiene desiertos?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Europa', TRUE),
    (currval('question_question_id_seq'), 'África', FALSE),
    (currval('question_question_id_seq'), 'Oceanía', FALSE),
    (currval('question_question_id_seq'), 'América', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué país está la Torre de Pisa?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Italia', TRUE),
    (currval('question_question_id_seq'), 'Francia', FALSE),
    (currval('question_question_id_seq'), 'Alemania', FALSE),
    (currval('question_question_id_seq'), 'España', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el país más pequeño del mundo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Ciudad del Vaticano', TRUE),
    (currval('question_question_id_seq'), 'Mónaco', FALSE),
    (currval('question_question_id_seq'), 'Nauru', FALSE),
    (currval('question_question_id_seq'), 'San Marino', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país está dividido en cantones?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Suiza', TRUE),
    (currval('question_question_id_seq'), 'Alemania', FALSE),
    (currval('question_question_id_seq'), 'Francia', FALSE),
    (currval('question_question_id_seq'), 'Austria', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el lago más grande de América del Sur?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Lago Titicaca', TRUE),
    (currval('question_question_id_seq'), 'Lago Maracaibo', FALSE),
    (currval('question_question_id_seq'), 'Lago Buenos Aires', FALSE),
    (currval('question_question_id_seq'), 'Lago Poopó', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué cordillera se encuentra en América del Norte?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Montañas Rocosas', TRUE),
    (currval('question_question_id_seq'), 'Andes', FALSE),
    (currval('question_question_id_seq'), 'Pirineos', FALSE),
    (currval('question_question_id_seq'), 'Apeninos', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué río pasa por Egipto?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Nilo', TRUE),
    (currval('question_question_id_seq'), 'Tigris', FALSE),
    (currval('question_question_id_seq'), 'Éufrates', FALSE),
    (currval('question_question_id_seq'), 'Zambeze', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la capital de Noruega?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Oslo', TRUE),
    (currval('question_question_id_seq'), 'Estocolmo', FALSE),
    (currval('question_question_id_seq'), 'Copenhague', FALSE),
    (currval('question_question_id_seq'), 'Helsinki', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué país se encuentra el desierto de Atacama?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Chile', TRUE),
    (currval('question_question_id_seq'), 'Perú', FALSE),
    (currval('question_question_id_seq'), 'Argentina', FALSE),
    (currval('question_question_id_seq'), 'Bolivia', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la capital de Marruecos?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Rabat', TRUE),
    (currval('question_question_id_seq'), 'Casablanca', FALSE),
    (currval('question_question_id_seq'), 'Fez', FALSE),
    (currval('question_question_id_seq'), 'Tánger', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país se encuentra entre Francia y España?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Andorra', TRUE),
    (currval('question_question_id_seq'), 'Mónaco', FALSE),
    (currval('question_question_id_seq'), 'Liechtenstein', FALSE),
    (currval('question_question_id_seq'), 'Luxemburgo', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país africano tiene forma de triángulo?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Sudán', TRUE),
    (currval('question_question_id_seq'), 'Egipto', FALSE),
    (currval('question_question_id_seq'), 'Kenia', FALSE),
    (currval('question_question_id_seq'), 'Nigeria', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país sudamericano no tiene salida al mar?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Paraguay', TRUE),
    (currval('question_question_id_seq'), 'Uruguay', FALSE),
    (currval('question_question_id_seq'), 'Colombia', FALSE),
    (currval('question_question_id_seq'), 'Venezuela', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el principal río de Europa occidental?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Rin', TRUE),
    (currval('question_question_id_seq'), 'Danubio', FALSE),
    (currval('question_question_id_seq'), 'Loira', FALSE),
    (currval('question_question_id_seq'), 'Tajo', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué país está ubicada la ciudad de Dubái?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Emiratos Árabes Unidos', TRUE),
    (currval('question_question_id_seq'), 'Qatar', FALSE),
    (currval('question_question_id_seq'), 'Arabia Saudita', FALSE),
    (currval('question_question_id_seq'), 'Omán', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué mar separa Europa de África?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mar Mediterráneo', TRUE),
    (currval('question_question_id_seq'), 'Mar Rojo', FALSE),
    (currval('question_question_id_seq'), 'Mar Negro', FALSE),
    (currval('question_question_id_seq'), 'Mar Caspio', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país tiene más fronteras con otros países?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'China', TRUE),
    (currval('question_question_id_seq'), 'Rusia', FALSE),
    (currval('question_question_id_seq'), 'Brasil', FALSE),
    (currval('question_question_id_seq'), 'India', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué isla pertenece a Dinamarca y está cerca del Ártico?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Groenlandia', TRUE),
    (currval('question_question_id_seq'), 'Islandia', FALSE),
    (currval('question_question_id_seq'), 'Svalbard', FALSE),
    (currval('question_question_id_seq'), 'Baffin', FALSE);

-- Geografía
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué país se encuentra al norte de México?', (SELECT category_id FROM category WHERE name = 'Geografía'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Estados Unidos', TRUE),
    (currval('question_question_id_seq'), 'Canadá', FALSE),
    (currval('question_question_id_seq'), 'Guatemala', FALSE),
    (currval('question_question_id_seq'), 'Belice', FALSE);

-- 20 preguntas adicionales de Entretenimiento, formuladas

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién dirigió la película 'Titanic'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'James Cameron', TRUE),
    (currval('question_question_id_seq'), 'Steven Spielberg', FALSE),
    (currval('question_question_id_seq'), 'Christopher Nolan', FALSE),
    (currval('question_question_id_seq'), 'Martin Scorsese', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué personaje de Disney tiene una lámpara mágica?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Aladdín', TRUE),
    (currval('question_question_id_seq'), 'Hércules', FALSE),
    (currval('question_question_id_seq'), 'Peter Pan', FALSE),
    (currval('question_question_id_seq'), 'Simba', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es la princesa de Disney con cabello largo y mágico?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Rapunzel', TRUE),
    (currval('question_question_id_seq'), 'Ariel', FALSE),
    (currval('question_question_id_seq'), 'Elsa', FALSE),
    (currval('question_question_id_seq'), 'Jazmín', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién protagonizó la serie 'El Príncipe del Rap'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Will Smith', TRUE),
    (currval('question_question_id_seq'), 'Chris Rock', FALSE),
    (currval('question_question_id_seq'), 'Jamie Foxx', FALSE),
    (currval('question_question_id_seq'), 'Denzel Washington', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué grupo británico compuso 'Hey Jude'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'The Beatles', TRUE),
    (currval('question_question_id_seq'), 'Queen', FALSE),
    (currval('question_question_id_seq'), 'The Rolling Stones', FALSE),
    (currval('question_question_id_seq'), 'Pink Floyd', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué película animada tiene como personaje a una niña llamada Boo?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Monsters Inc.', TRUE),
    (currval('question_question_id_seq'), 'Toy Story', FALSE),
    (currval('question_question_id_seq'), 'Up', FALSE),
    (currval('question_question_id_seq'), 'Ratatouille', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué cantante es conocido como 'El Sol de México'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Luis Miguel', TRUE),
    (currval('question_question_id_seq'), 'Chayanne', FALSE),
    (currval('question_question_id_seq'), 'Juan Gabriel', FALSE),
    (currval('question_question_id_seq'), 'Cristian Castro', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué programa infantil tiene un personaje rosa llamado Peppa?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Peppa Pig', TRUE),
    (currval('question_question_id_seq'), 'Dora la Exploradora', FALSE),
    (currval('question_question_id_seq'), 'Pocoyó', FALSE),
    (currval('question_question_id_seq'), 'Backyardigans', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué película popular tiene como lema 'Que la fuerza te acompañe'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Star Wars', TRUE),
    (currval('question_question_id_seq'), 'Star Trek', FALSE),
    (currval('question_question_id_seq'), 'Avatar', FALSE),
    (currval('question_question_id_seq'), 'Matrix', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el nombre de la escuela de magia en Harry Potter?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Hogwarts', TRUE),
    (currval('question_question_id_seq'), 'Ilvermorny', FALSE),
    (currval('question_question_id_seq'), 'Durmstrang', FALSE),
    (currval('question_question_id_seq'), 'Beauxbatons', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién interpreta a Thor en el universo Marvel?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Chris Hemsworth', TRUE),
    (currval('question_question_id_seq'), 'Chris Evans', FALSE),
    (currval('question_question_id_seq'), 'Tom Hiddleston', FALSE),
    (currval('question_question_id_seq'), 'Henry Cavill', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué película de Disney se basa en la leyenda china de Hua Mulan?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mulan', TRUE),
    (currval('question_question_id_seq'), 'Raya', FALSE),
    (currval('question_question_id_seq'), 'Moana', FALSE),
    (currval('question_question_id_seq'), 'Valiente', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué superhéroe es conocido como el Caballero de la Noche?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Batman', TRUE),
    (currval('question_question_id_seq'), 'Superman', FALSE),
    (currval('question_question_id_seq'), 'Iron Man', FALSE),
    (currval('question_question_id_seq'), 'Capitán América', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el apellido de los hermanos que crearon Mario Bros?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mario', TRUE),
    (currval('question_question_id_seq'), 'Luigi', FALSE),
    (currval('question_question_id_seq'), 'Wario', FALSE),
    (currval('question_question_id_seq'), 'Toad', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué serie trata sobre una familia amarilla?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Los Simpson', TRUE),
    (currval('question_question_id_seq'), 'Padre de Familia', FALSE),
    (currval('question_question_id_seq'), 'American Dad', FALSE),
    (currval('question_question_id_seq'), 'Rick and Morty', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué animal es Scooby-Doo?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Gran danés', TRUE),
    (currval('question_question_id_seq'), 'Labrador', FALSE),
    (currval('question_question_id_seq'), 'Beagle', FALSE),
    (currval('question_question_id_seq'), 'Boxer', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Quién canta la canción 'Shape of You'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Ed Sheeran', TRUE),
    (currval('question_question_id_seq'), 'Justin Bieber', FALSE),
    (currval('question_question_id_seq'), 'Shawn Mendes', FALSE),
    (currval('question_question_id_seq'), 'Bruno Mars', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué película animada trata sobre emociones dentro de una niña?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Intensamente', TRUE),
    (currval('question_question_id_seq'), 'Coco', FALSE),
    (currval('question_question_id_seq'), 'Soul', FALSE),
    (currval('question_question_id_seq'), 'Valiente', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿En qué ciudad se desarrolla la serie 'Friends'?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Nueva York', TRUE),
    (currval('question_question_id_seq'), 'Los Ángeles', FALSE),
    (currval('question_question_id_seq'), 'Chicago', FALSE),
    (currval('question_question_id_seq'), 'San Francisco', FALSE);

-- Entretenimiento
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué famoso espía británico tiene el número 007?', (SELECT category_id FROM category WHERE name = 'Entretenimiento'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'James Bond', TRUE),
    (currval('question_question_id_seq'), 'Jason Bourne', FALSE),
    (currval('question_question_id_seq'), 'Ethan Hunt', FALSE),
    (currval('question_question_id_seq'), 'Sherlock Holmes', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el planeta más cercano al Sol?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mercurio', TRUE),
    (currval('question_question_id_seq'), 'Venus', FALSE),
    (currval('question_question_id_seq'), 'Tierra', FALSE),
    (currval('question_question_id_seq'), 'Marte', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué célula transporta oxígeno en la sangre?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Glóbulo rojo', TRUE),
    (currval('question_question_id_seq'), 'Glóbulo blanco', FALSE),
    (currval('question_question_id_seq'), 'Plaqueta', FALSE),
    (currval('question_question_id_seq'), 'Neuronas', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué es H2O?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Agua', TRUE),
    (currval('question_question_id_seq'), 'Hidrógeno', FALSE),
    (currval('question_question_id_seq'), 'Oxígeno', FALSE),
    (currval('question_question_id_seq'), 'Ácido clorhídrico', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué científico descubrió la penicilina?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Alexander Fleming', TRUE),
    (currval('question_question_id_seq'), 'Louis Pasteur', FALSE),
    (currval('question_question_id_seq'), 'Isaac Newton', FALSE),
    (currval('question_question_id_seq'), 'Marie Curie', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el órgano más grande del cuerpo humano?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Piel', TRUE),
    (currval('question_question_id_seq'), 'Hígado', FALSE),
    (currval('question_question_id_seq'), 'Pulmón', FALSE),
    (currval('question_question_id_seq'), 'Corazón', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué instrumento se usa para observar estrellas?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Telescopio', TRUE),
    (currval('question_question_id_seq'), 'Microscopio', FALSE),
    (currval('question_question_id_seq'), 'Sismógrafo', FALSE),
    (currval('question_question_id_seq'), 'Radar', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el metal líquido a temperatura ambiente?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Mercurio', TRUE),
    (currval('question_question_id_seq'), 'Plomo', FALSE),
    (currval('question_question_id_seq'), 'Aluminio', FALSE),
    (currval('question_question_id_seq'), 'Hierro', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué tipo de energía proviene del viento?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Eólica', TRUE),
    (currval('question_question_id_seq'), 'Solar', FALSE),
    (currval('question_question_id_seq'), 'Geotérmica', FALSE),
    (currval('question_question_id_seq'), 'Hidráulica', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué hueso está en la parte superior del brazo?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Húmero', TRUE),
    (currval('question_question_id_seq'), 'Fémur', FALSE),
    (currval('question_question_id_seq'), 'Tibia', FALSE),
    (currval('question_question_id_seq'), 'Radio', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué parte de la planta absorbe agua del suelo?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Raíz', TRUE),
    (currval('question_question_id_seq'), 'Tallo', FALSE),
    (currval('question_question_id_seq'), 'Hoja', FALSE),
    (currval('question_question_id_seq'), 'Flor', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Cuál es el principal gas del efecto invernadero?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Dióxido de carbono', TRUE),
    (currval('question_question_id_seq'), 'Ozono', FALSE),
    (currval('question_question_id_seq'), 'Nitrógeno', FALSE),
    (currval('question_question_id_seq'), 'Oxígeno', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué ciencia estudia los elementos y su composición?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Química', TRUE),
    (currval('question_question_id_seq'), 'Física', FALSE),
    (currval('question_question_id_seq'), 'Biología', FALSE),
    (currval('question_question_id_seq'), 'Astronomía', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué aparato mide la presión atmosférica?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Barómetro', TRUE),
    (currval('question_question_id_seq'), 'Termómetro', FALSE),
    (currval('question_question_id_seq'), 'Anemómetro', FALSE),
    (currval('question_question_id_seq'), 'Altímetro', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué ser vivo produce miel?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Abeja', TRUE),
    (currval('question_question_id_seq'), 'Hormiga', FALSE),
    (currval('question_question_id_seq'), 'Mariposa', FALSE),
    (currval('question_question_id_seq'), 'Mosca', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué proceso usan las plantas para hacer su alimento?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Fotosíntesis', TRUE),
    (currval('question_question_id_seq'), 'Respiración', FALSE),
    (currval('question_question_id_seq'), 'Evaporación', FALSE),
    (currval('question_question_id_seq'), 'Transpiración', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué fuerza se opone al movimiento?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Fricción', TRUE),
    (currval('question_question_id_seq'), 'Gravedad', FALSE),
    (currval('question_question_id_seq'), 'Inercia', FALSE),
    (currval('question_question_id_seq'), 'Impulso', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué es un eclipse solar?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'La Luna cubre al Sol', TRUE),
    (currval('question_question_id_seq'), 'La Tierra cubre al Sol', FALSE),
    (currval('question_question_id_seq'), 'El Sol cubre a la Luna', FALSE),
    (currval('question_question_id_seq'), 'La Luna cambia de color', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué parte del ojo regula la cantidad de luz?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Pupila', TRUE),
    (currval('question_question_id_seq'), 'Córnea', FALSE),
    (currval('question_question_id_seq'), 'Retina', FALSE),
    (currval('question_question_id_seq'), 'Cristalino', FALSE);

-- Ciencia
INSERT INTO question (questiontext, category_id)
VALUES ('¿Qué órgano produce insulina?', (SELECT category_id FROM category WHERE name = 'Ciencia'));
INSERT INTO answer (question_id, text, is_correct) VALUES
    (currval('question_question_id_seq'), 'Páncreas', TRUE),
    (currval('question_question_id_seq'), 'Hígado', FALSE),
    (currval('question_question_id_seq'), 'Riñón', FALSE),
    (currval('question_question_id_seq'), 'Intestino', FALSE);
