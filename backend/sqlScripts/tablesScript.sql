create sequence users_id_seq
    as integer;

alter sequence users_id_seq owner to postgres;

create type friendship_state as enum ('accepted', 'pending', 'rejected');

alter type friendship_state owner to postgres;

create table users
(
    user_id     integer default nextval('users_id_seq'::regclass) not null
        primary key,
    username    varchar(100),
    password    varchar(100)                                      not null,
    email       varchar(100)
        unique,
    rank_points integer default 0,
    is_admin    boolean default false
);

alter table users
    owner to postgres;

alter sequence users_id_seq owned by users.user_id;

create table category
(
    category_id serial
        primary key,
    name        varchar(100) not null
        unique
);

alter table category
    owner to postgres;

create table question
(
    question_id   serial
        primary key,
    questiontext  text not null,
    category_id   integer
                       references category
                           on delete set null,
    alreadypicked boolean default false
);

alter table question
    owner to postgres;

create table answer
(
    answer_id   serial
        primary key,
    question_id integer               not null
        references question
            on delete cascade,
    text        text                  not null,
    is_correct  boolean default false not null
);

alter table answer
    owner to postgres;

create table battle
(
    battle_id serial
        primary key,
    status    varchar(20) default 'ongoing'::character varying not null,
    date      timestamp   default CURRENT_TIMESTAMP,
    user_id1  integer                                          not null
        references users,
    user_id2  integer                                          not null
        references users,
    whos_next integer
        references users
);

alter table battle
    owner to postgres;

create table turns
(
    battle_id   integer not null
        references battle
            on delete cascade,
    user_id     integer not null
        references users,
    question_id integer not null
        references question,
    answer_id   integer not null
        references answer,
    primary key (battle_id, user_id, question_id)
);

alter table turns
    owner to postgres;

create table history
(
    battle_id      integer not null
        primary key
        references battle
            on delete cascade,
    result         varchar(20),
    winner_user_id integer
        references users
);

alter table history
    owner to postgres;

create table points
(
    battle_id   integer not null
        references battle
            on delete cascade,
    user_id     integer not null
        references users,
    category_id integer not null
        references category,
    points      integer default 0,
    primary key (battle_id, user_id, category_id)
);

alter table points
    owner to postgres;

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

alter table solo_history
    owner to postgres;

create table friends
(
    user_id   integer                                              not null
        references users,
    friend_id integer                                              not null
        references users,
    state     friendship_state default 'pending'::friendship_state not null,
    primary key (user_id, friend_id)
);

alter table friends
    owner to postgres;

create table profile_image
(
    img_id     serial
        primary key,
    user_id    integer not null
        unique
        references users
            on delete cascade,
    image_path text    not null
);

alter table profile_image
    owner to postgres;

-- Tabla para llevar el seguimiento de categorías por usuario en cada batalla
CREATE TABLE IF NOT EXISTS battle_categories (battle_id INTEGER NOT NULL REFERENCES battle(battle_id) ON DELETE CASCADE,
                                              user_id INTEGER NOT NULL REFERENCES users(user_id),
                                              category_id INTEGER NOT NULL REFERENCES category(category_id),
                                              completed BOOLEAN DEFAULT FALSE,
                                              completed_at TIMESTAMP,
                                              PRIMARY KEY (battle_id, user_id, category_id)
);

CREATE TABLE IF NOT EXISTS battle_answer (
                                             battle_answer_id SERIAL PRIMARY KEY,
                                             battle_id INTEGER NOT NULL REFERENCES battle(battle_id),
                                             user_id INTEGER NOT NULL REFERENCES users(user_id),
                                             question_id INTEGER NOT NULL REFERENCES question(question_id),
                                             answer_id INTEGER NOT NULL REFERENCES answer(answer_id),
                                             is_correct BOOLEAN NOT NULL,
                                             answer_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                             UNIQUE (battle_id, user_id, question_id)
);

CREATE TABLE community_category (
                                    community_category_id SERIAL PRIMARY KEY,
                                    name VARCHAR(100) NOT NULL UNIQUE
);

alter table community_category
    add COLUMN user_id int references users(user_id);

-- Nueva columna de tabla, agregala faca virgo
create type category_state as enum ('accepted', 'pending', 'inadequate');

alter table community_category
    add column publish_state category_state default 'pending' :: category_state not null;


CREATE TABLE community_question (
                                    community_question_id SERIAL PRIMARY KEY,
                                    question_text TEXT NOT NULL,
                                    community_category_id INT REFERENCES community_category(community_category_id) ON DELETE SET NULL,
                                    alreadyPicked BOOLEAN DEFAULT FALSE
);


CREATE TABLE community_answer (
                                  community_answer_id SERIAL PRIMARY KEY,
                                  community_question_id INT NOT NULL REFERENCES community_question(community_question_id) ON DELETE CASCADE,
                                  answer_text TEXT NOT NULL,
                                  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);



