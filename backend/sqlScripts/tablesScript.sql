/*Si corres esto deberías poder tener todas las tablas, HACELO faca asi funca bien todo*/

/*Tipos especificos para las tablas*/
create type friendship_state as enum ('accepted', 'pending', 'rejected');

alter type friendship_state owner to postgres;

create type category_state as enum ('accepted', 'pending', 'inadequate');

alter type category_state owner to postgres;

create type game_mode as enum ('Bullet', 'Solitary', 'Online');

alter type game_mode owner to postgres;

/* Tablas */
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

create table battle_categories
(
    battle_id    integer not null
        references battle
            on delete cascade,
    user_id      integer not null
        references users,
    category_id  integer not null
        references category,
    completed    boolean default false,
    completed_at timestamp,
    primary key (battle_id, user_id, category_id)
);

alter table battle_categories
    owner to postgres;

create table battle_answer
(
    battle_answer_id serial
        primary key,
    battle_id        integer not null
        references battle,
    user_id          integer not null
        references users,
    question_id      integer not null
        references question,
    answer_id        integer not null
        references answer,
    is_correct       boolean not null,
    answer_time      timestamp default CURRENT_TIMESTAMP,
    unique (battle_id, user_id, question_id)
);

alter table battle_answer
    owner to postgres;

create table bullet_questions
(
    bullet_question_id serial
        primary key,
    bullet_text        text not null,
    already_picked     boolean default false
);

alter table bullet_questions
    owner to postgres;

create table bullet_answers
(
    bullet_answer_id   serial
        primary key,
    bullet_question_id integer               not null
        references bullet_questions
            on delete cascade,
    answer_text        text                  not null,
    is_correct         boolean default false not null
);

alter table bullet_answers
    owner to postgres;

create table bullet_ranking
(
    bullet_ranking_id serial
        primary key,
    bullet_user_id    integer           not null
        references users
            on delete cascade,
    best_bullet_score integer default 0 not null
);

alter table bullet_ranking
    owner to postgres;

create table invitations
(
    id          serial
        primary key,
    invite_code varchar(10) not null
        unique,
    creator_id  integer     not null
        references users,
    battle_id   integer
        references battle,
    status      varchar(20) default 'pending'::character varying
        constraint invitations_status_check
            check ((status)::text = ANY
                   ((ARRAY ['pending'::character varying, 'used'::character varying, 'expired'::character varying])::text[])),
    created_at  timestamp   default CURRENT_TIMESTAMP,
    expires_at  timestamp   default (CURRENT_TIMESTAMP + '01:00:00'::interval)
);

alter table invitations
    owner to postgres;

create table community_category
(
    community_category_id serial
        primary key,
    name                  varchar(100)                                     not null
        unique,
    user_id               integer
        references users,
    publish_state         category_state default 'pending'::category_state not null,
    game_mode             game_mode      default 'Solitary'::game_mode
);

alter table community_category
    owner to postgres;

create table community_question
(
    community_question_id serial
        primary key,
    question_text         text not null,
    community_category_id integer
        references community_category
            on delete cascade,
    alreadypicked         boolean default false
);

alter table community_question
    owner to postgres;

create table community_answer
(
    community_answer_id   serial
        primary key,
    community_question_id integer               not null
        references community_question
            on delete cascade,
    answer_text           text                  not null,
    is_correct            boolean default false not null
);

alter table community_answer
    owner to postgres;

