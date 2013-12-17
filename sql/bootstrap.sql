-- If you're thaaaat curious, the passwords are all 'password'
INSERT INTO Users (user_name, first_name, last_name, email, affiliation, password_hash, birthday) VALUES
    ('dange'  , 'Daniel' , 'Ge'     , 'dange@seas.upenn.edu'  , 'UPenn' , '$2a$10$bNJcsmcbH5ZmVWs.QszaW.nYepufRu5a7fhVdk4BNPxvs9.rCCQUC', DATE '1992-09-26');
INSERT INTO Users (user_name, first_name, last_name, email, affiliation, password_hash, birthday) VALUES
    ('ricro'  , 'Richard', 'Roberts', 'ricro@seas.upenn.edu'  , 'UPenn' , '$2a$10$jYAK4r/meVE0gtisEhBrruWEtTegIxSdLcKnvljdf5iwWmBs4bYwC', DATE '1993-01-01');
INSERT INTO Users (user_name, first_name, last_name, email, affiliation, password_hash, birthday) VALUES
    ('kuyumcu', 'Arda'   , 'Kuyumcu', 'kuyumcu@seas.upenn.edu', 'UPenn' , '$2a$10$K.00iI.zGgfV3f63Zi.fMepK0r8WtNZ2TKHZm8wIYUEDKvyX5C9pq', DATE '1991-10-21');
INSERT INTO Users (user_name, first_name, last_name, email, affiliation, password_hash, birthday) VALUES
    ('suntzu' , 'Terry'  , 'Sun'    , 'sun@stwing.upenn.edu'  , 'STWing', '$2a$10$iBdrM9KkoX/CpVF3xkIEqOgF5zj59Z926zu.05qj3j9CLSA8VYjG2', DATE '1993-08-01');
           
INSERT INTO Interest (user_name, name) VALUES ('dange',   'astrophotography');
INSERT INTO Interest (user_name, name) VALUES ('dange',   'biology');
INSERT INTO Interest (user_name, name) VALUES ('dange',   'computer science');
INSERT INTO Interest (user_name, name) VALUES ('ricro',   'Doctor Who');
INSERT INTO Interest (user_name, name) VALUES ('ricro',   'My Little Pony');
INSERT INTO Interest (user_name, name) VALUES ('ricro',   'Apologizing for art');
INSERT INTO Interest (user_name, name) VALUES ('kuyumcu', 'I dunno what to put here');
INSERT INTO Interest (user_name, name) VALUES ('kuyumcu', 'computer science');
INSERT INTO Interest (user_name, name) VALUES ('suntzu',  'computer science');
INSERT INTO Interest (user_name, name) VALUES ('suntzu',  'Noodlesloups');
           
INSERT INTO Friendship (user_name, friend_name) VALUES ('dange'  , 'ricro');
INSERT INTO Friendship (user_name, friend_name) VALUES ('ricro'  , 'dange');
INSERT INTO Friendship (user_name, friend_name) VALUES ('dange'  , 'kuyumcu');
INSERT INTO Friendship (user_name, friend_name) VALUES ('kuyumcu', 'dange');
INSERT INTO Friendship (user_name, friend_name) VALUES ('dange'  , 'suntzu');
INSERT INTO Friendship (user_name, friend_name) VALUES ('suntzu' , 'dange');
INSERT INTO Friendship (user_name, friend_name) VALUES ('ricro'  , 'suntzu');
INSERT INTO Friendship (user_name, friend_name) VALUES ('suntzu' , 'ricro');
           
INSERT INTO Board (owner_name, name) VALUES ('dange',   'gifs');
INSERT INTO Board (owner_name, name) VALUES ('dange',   'Mildly amusing');
INSERT INTO Board (owner_name, name) VALUES ('ricro',   'Art');
INSERT INTO Board (owner_name, name) VALUES ('kuyumcu', 'NaNoWriMo');
INSERT INTO Board (owner_name, name) VALUES ('suntzu',  'Vladimir Putin');
           
-- Not sure if the multi-insert thing guarantees an order, but this will
-- certainly guarantee an order
INSERT INTO Object (type, url) VALUES ('photo', 'http://i.imgur.com/r1OK5bD.gif');
INSERT INTO Object (type, url) VALUES ('photo', 'http://i.imgur.com/Y7MlV.jpg');
INSERT INTO Object (type, url) VALUES ('photo', 'http://i.imgur.com/QFqtA.gif');
INSERT INTO Object (type, url) VALUES ('photo', 'http://i.imgur.com/gJO3nLB.gif');
INSERT INTO Object (type, url) VALUES ('photo', 'http://i.imgur.com/CGu8E.gif');
INSERT INTO Object (type, url) VALUES ('photo', 'http://i.imgur.com/1mRKPEh.gif');
INSERT INTO Object (type, url) VALUES ('pdf'  , 'https://research.microsoft.com/en-us/people/mickens/thenightwatch.pdf');
           
INSERT INTO Rating (object_id, source, user_name, rating) VALUES (1, 'Hazelnoot', 'dange',   4);
INSERT INTO Rating (object_id, source, user_name, rating) VALUES (1, 'Hazelnoot', 'ricro',   3);
INSERT INTO Rating (object_id, source, user_name, rating) VALUES (1, 'Hazelnoot', 'suntzu',  3);
INSERT INTO Rating (object_id, source, user_name, rating) VALUES (2, 'Hazelnoot', 'ricro',   3);
INSERT INTO Rating (object_id, source, user_name, rating) VALUES (2, 'Hazelnoot', 'kuyumcu', 3);
INSERT INTO Rating (object_id, source, user_name, rating) VALUES (2, 'Hazelnoot', 'suntzu',  4);
           
INSERT INTO Pin (object_id, source, user_name, board_name) VALUES (1, 'Hazelnoot', 'dange'  , 'gifs');
INSERT INTO Pin (object_id, source, user_name, board_name) VALUES (2, 'Hazelnoot', 'dange'  , 'gifs');
INSERT INTO Pin (object_id, source, user_name, board_name) VALUES (3, 'Hazelnoot', 'dange'  , 'gifs');
INSERT INTO Pin (object_id, source, user_name, board_name) VALUES (4, 'Hazelnoot', 'dange'  , 'gifs');
INSERT INTO Pin (object_id, source, user_name, board_name) VALUES (5, 'Hazelnoot', 'dange'  , 'gifs');
INSERT INTO Pin (object_id, source, user_name, board_name) VALUES (6, 'Hazelnoot', 'dange'  , 'gifs');
INSERT INTO Pin (object_id, source, user_name, board_name) VALUES (7, 'Hazelnoot', 'kuyumcu', 'NaNoWriMo');
           
INSERT INTO Tags (object_id, source, tag) VALUES (1, 'Hazelnoot', 'guinea pigs');
INSERT INTO Tags (object_id, source, tag) VALUES (1, 'Hazelnoot', 'nom');
INSERT INTO Tags (object_id, source, tag) VALUES (1, 'Hazelnoot', 'cute');
INSERT INTO Tags (object_id, source, tag) VALUES (2, 'Hazelnoot', 'mythbusters');
INSERT INTO Tags (object_id, source, tag) VALUES (2, 'Hazelnoot', 'walrus');
INSERT INTO Tags (object_id, source, tag) VALUES (3, 'Hazelnoot', 'llama');
INSERT INTO Tags (object_id, source, tag) VALUES (3, 'Hazelnoot', 'lama');
INSERT INTO Tags (object_id, source, tag) VALUES (3, 'Hazelnoot', 'eyebeams');
INSERT INTO Tags (object_id, source, tag) VALUES (4, 'Hazelnoot', 'art');
INSERT INTO Tags (object_id, source, tag) VALUES (5, 'Hazelnoot', 'kermit');
