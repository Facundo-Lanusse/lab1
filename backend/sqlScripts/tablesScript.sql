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