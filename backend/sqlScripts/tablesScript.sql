drop table category cascade;
drop table answer cascade;
drop table history cascade;
drop table battle cascade;
drop table points cascade;
drop table turns cascade;
drop table users cascade;
drop table question cascade;


create table users
(
    id          serial primary key,
    username    varchar(100),
    password    varchar(100),
    email       varchar(100) unique,
    rank_points int default 0

);
ALTER TABLE users
    ADD COLUMN is_admin boolean default false;

ALTER TABLE users
    rename column id to user_id;

ALTER TABLE users
    ALTER COLUMN password set NOT NULL;

CREATE TABLE category (
                          category_id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE question (
                          question_id SERIAL PRIMARY KEY,
                          question TEXT NOT NULL,
                          category_id INT REFERENCES category(category_id) ON DELETE SET NULL);

ALTER TABLE question ADD COLUMN alreadyPicked BOOLEAN DEFAULT FALSE;


CREATE TABLE answer (
                        answer_id SERIAL PRIMARY KEY,
                        question_id INT NOT NULL REFERENCES question(question_id) ON DELETE CASCADE,
                        text TEXT NOT NULL,
                        is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE battle (
                        battle_id SERIAL PRIMARY KEY,
                        status VARCHAR(20) NOT NULL DEFAULT 'ongoing', -- 'ongoing', 'finished'
                        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        user_id1 INT NOT NULL REFERENCES "users"(user_id),
                        user_id2 INT NOT NULL REFERENCES "users"(user_id),
                        whos_next INT REFERENCES "users"(user_id)
);

CREATE TABLE turns (
                       battle_id INT NOT NULL REFERENCES battle(battle_id) ON DELETE CASCADE,
                       user_id INT NOT NULL REFERENCES "users"(user_id),
                       question_id INT NOT NULL REFERENCES question(question_id),
                       answer_id INT NOT NULL REFERENCES answer(answer_id),
                       PRIMARY KEY (battle_id, user_id, question_id)
);

CREATE TABLE history (
                         battle_id INT PRIMARY KEY REFERENCES battle(battle_id) ON DELETE CASCADE,
                         result VARCHAR(20), -- 'draw', 'user1_win', 'user2_win'
                         winner_user_id INT REFERENCES "users"(user_id)
);

CREATE TABLE points (
                        battle_id INT REFERENCES battle(battle_id) ON DELETE CASCADE,
                        user_id INT REFERENCES "users"(user_id),
                        category_id INT REFERENCES category(category_id),
                        points INT DEFAULT 0,
                        PRIMARY KEY (battle_id, user_id, category_id)
);

create table solo_history
(
    game_id   serial
        primary key,
    user_id   integer not null
        references users
            on delete cascade,
    score     integer not null,
    game_date timestamp(0) default CURRENT_TIMESTAMP
);

ALTER TABLE question
    rename column question to questionText;

insert into users (username, password, email, is_admin)
values('admin', 'admin123', 'admin@gmail.com', true);
