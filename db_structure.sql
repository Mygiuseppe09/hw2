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

INSERT INTO places (id, name) VALUES (2010537, 'New York (State)');
INSERT INTO places (id, name) VALUES (7879186, 'Paris, France');
INSERT INTO places (id, name) VALUES (7884587, 'Marseille, France');
INSERT INTO places (id, name) VALUES (7930952, 'London, United Kingdom');
INSERT INTO places (id, name) VALUES (8892167, 'Taormina, Italy');
INSERT INTO places (id, name) VALUES (8893638, 'Catania, Italy');
INSERT INTO places (id, name) VALUES (8897921, 'Rome, Italy');
INSERT INTO places (id, name) VALUES (9661173, 'Amsterdam, Netherlands');
INSERT INTO places (id, name) VALUES (10626288, 'Miami, FL');
INSERT INTO places (id, name) VALUES (10935756, 'Santorini');

INSERT INTO posts (id, user, time, nlikes, place) VALUES (1, 'Mygiuseppe09', '2022-06-08 13:41:00', 0, 7879186);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (2, 'Mygiuseppe09', '2022-06-08 14:31:04', 0, 8897921);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (4, 'Ame_Ciccia', '2022-06-08 15:05:20', 0, 7884587);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (5, 'Pippo_Pluto', '2022-06-08 15:11:36', 0, 8893638);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (6, 'Mario_Rossi', '2022-06-08 15:15:59', 0, 2010537);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (7, 'Maria_Rossi', '2022-06-08 15:17:46', 0, 7930952);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (8, 'Mygiuseppe09', '2022-06-08 15:20:30', 0, 9661173);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (9, 'Ame_Ciccia', '2022-06-08 15:25:28', 0, 10935756);
INSERT INTO posts (id, user, time, nlikes, place) VALUES (12, 'Pippo_Pluto', '2022-06-08 16:17:10', 0, 10626288);

INSERT INTO likes (user, post) VALUES ('Ame_Ciccia', 2);
INSERT INTO likes (user, post) VALUES ('Mario_Rossi', 7);
INSERT INTO likes (user, post) VALUES ('Mygiuseppe09', 7);
INSERT INTO likes (user, post) VALUES ('Pippo_Pluto', 7);
INSERT INTO likes (user, post) VALUES ('Ame_Ciccia', 8);


/********************************************************************/

select * from users;
select * from places;
select * from posts;
select * from likes;
select * from visits;
