/* TRIPBOOK */

create database tripbook_lv;
use tripbook_lv;

create table users
(
    username varchar(20) primary key,
    name varchar(255) not null,
    surname varchar(255) not null,
    date_of_birth date not null,
    gender varchar(1) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    nposts integer default 0
) Engine = InnoDB;


create table places
(
    id integer primary key auto_increment,
    name varchar(50)
) Engine = InnoDB;


create table posts (
    id integer primary key auto_increment,
    user varchar(20),
    time timestamp not null default current_timestamp,
    nlikes integer  default 0,
    place integer not null,
    foreign key(place) references places(id) on update cascade,
    foreign key(user) references users(username) on delete cascade on update cascade
) Engine = InnoDB;


/* tabelle relazioni molti a molti */

create table likes (
    user varchar(20) not null,
    post integer not null,

    index idx_user(user),
    index idx_post(post),

    foreign key(user) references users(username) on delete cascade on update cascade,
    foreign key(post) references posts(id) on delete cascade on update cascade,
    primary key(user, post)
) Engine = InnoDB;


create table visits (
    id integer primary key auto_increment,
    user varchar(20) not null,
    place integer not null,

    index idx_user(user),
    index idx_place(place),

    foreign key(user) references users(username) on delete cascade on update cascade,
    foreign key(place) references places(id) on update cascade
) Engine = InnoDB;

/**************************** TRIGGERS ********************************/

DELIMITER //
CREATE TRIGGER update_visits
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
INSERT INTO visits set
    user = new.user,
    place = new.place;
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER update_users__increment_nposts
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
UPDATE users set
    nposts = nposts + 1 where username = NEW.user;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_users__decrement_nposts
AFTER DELETE ON posts
FOR EACH ROW
BEGIN
UPDATE users set
    nposts = nposts - 1 where username = OLD.user;
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER update_posts__increment_nlikes
AFTER INSERT ON likes
FOR EACH ROW
BEGIN
UPDATE posts set
    nlikes = nlikes + 1 where id = NEW.post;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_posts__decrement_nlikes
AFTER DELETE ON likes
FOR EACH ROW
BEGIN
UPDATE posts set
    nlikes = nlikes - 1 where id = OLD.post;
END //
DELIMITER ;


/************************* POPOLIAMO IL DB ***************************/

INSERT INTO users (username, name, surname, date_of_birth, gender, email, password, nposts) VALUES ('Mygiuseppe09', 'Giuseppe', 'Leocata', '2000-06-09', 'M', 'email1@example.com', 'Password1@', 0);
INSERT INTO users (username, name, surname, date_of_birth, gender, email, password, nposts) VALUES ('Mario_Rossi', 'Mario', 'Rossi', '1990-01-01', 'M', 'email2@example.com', 'Password1@', 0);
INSERT INTO users (username, name, surname, date_of_birth, gender, email, password, nposts) VALUES ('Maria_Rossi', 'Maria', 'Rossi', '1990-01-01', 'F', 'email3@example.com', 'Password1@', 0);
INSERT INTO users (username, name, surname, date_of_birth, gender, email, password, nposts) VALUES ('Pippo_Pluto', 'Pippo', 'Pluto', '1990-01-01', 'M', 'email4@example.com', 'Password1@', 0);
INSERT INTO users (username, name, surname, date_of_birth, gender, email, password, nposts) VALUES ('Ame_Ciccia', 'Ame', 'Ciccia', '1990-01-01', 'F', 'email5@example.com', 'Password1@', 0);

INSERT INTO places (id, name) VALUES (6588544, 'New York, NY');
INSERT INTO places (id, name) VALUES (7750870, 'Berlin, Germany');
INSERT INTO places (id, name) VALUES (7823288, 'Madrid, Spain');
INSERT INTO places (id, name) VALUES (7879186, 'Paris, France');
INSERT INTO places (id, name) VALUES (7884587, 'Marseille, France');
INSERT INTO places (id, name) VALUES (7930952, 'London, United Kingdom');
INSERT INTO places (id, name) VALUES (7977158, 'Athens, Greece');
INSERT INTO places (id, name) VALUES (8894857, 'Venice, Italy');
INSERT INTO places (id, name) VALUES (8897921, 'Rome, Italy');
INSERT INTO places (id, name) VALUES (8900975, 'Milan, Italy');

INSERT INTO posts (id, user, time, nlikes, place) VALUES (1, 'Ame_Ciccia', '2022-05-27 20:29:18', 0, 8897921);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (2, 'Mygiuseppe09', '2022-05-27 20:29:47', 0, 8900975);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (3, 'Pippo_Pluto', '2022-05-27 20:30:07', 0, 7879186);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (4, 'Maria_Rossi', '2022-05-27 20:30:24', 0, 7930952);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (6, 'Mario_Rossi', '2022-05-27 20:31:56', 0, 7750870);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (7, 'Ame_Ciccia', '2022-05-27 20:32:16', 0, 7884587);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (8, 'Pippo_Pluto', '2022-05-27 20:32:36', 0, 8894857);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (9, 'Maria_Rossi', '2022-05-27 20:33:12', 0, 7823288);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (10, 'Mario_Rossi', '2022-05-27 20:34:09', 0, 7977158);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (11, 'Mygiuseppe09', '2022-05-27 20:34:31', 0, 6588544);

INSERT INTO likes (user, post) VALUES ('Mario_Rossi', 1);
INSERT INTO likes (user, post) VALUES ('Mygiuseppe09', 1);
INSERT INTO likes (user, post) VALUES ('Pippo_Pluto', 1);
INSERT INTO likes (user, post) VALUES ('Mario_Rossi', 2);
INSERT INTO likes (user, post) VALUES ('Mario_Rossi', 4);
INSERT INTO likes (user, post) VALUES ('Mygiuseppe09', 4);
INSERT INTO likes (user, post) VALUES ('Pippo_Pluto', 4);
INSERT INTO likes (user, post) VALUES ('Mario_Rossi', 7);
INSERT INTO likes (user, post) VALUES ('Mygiuseppe09', 7);
INSERT INTO likes (user, post) VALUES ('Pippo_Pluto', 7);
INSERT INTO likes (user, post) VALUES ('Mario_Rossi', 9);
INSERT INTO likes (user, post) VALUES ('Mygiuseppe09', 9);
INSERT INTO likes (user, post) VALUES ('Pippo_Pluto', 9);
INSERT INTO likes (user, post) VALUES ('Mario_Rossi', 11);
INSERT INTO likes (user, post) VALUES ('Ame_Ciccia', 9);
INSERT INTO likes (user, post) VALUES ('Maria_Rossi', 9);



/********************************************************************/

select * from users;
select * from places;
select * from posts;
select * from likes;
select * from visits;



