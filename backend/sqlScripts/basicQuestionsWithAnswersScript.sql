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
