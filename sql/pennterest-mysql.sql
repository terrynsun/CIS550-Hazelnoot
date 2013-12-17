-- Create the Pennterest database (log in as pennterest)
 
CREATE TABLE Users (
    first_name VARCHAR(32)  NOT NULL,
    last_name VARCHAR(32)   NOT NULL,
    user_name VARCHAR(32)   NOT NULL,
    email VARCHAR(64)       NOT NULL,
    affiliation VARCHAR(64),
    password_hash CHAR(60),
    birthday DATE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_name),
    UNIQUE (email)
);

CREATE TABLE Interest (
    user_name VARCHAR(32)   NOT NULL,
    name VARCHAR(32)        NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_name) REFERENCES Users(user_name),
    PRIMARY KEY (user_name, name)
);

CREATE TABLE Friendship (
    user_name VARCHAR(32)   NOT NULL,
    friend_name VARCHAR(32) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_name, friend_name),
    FOREIGN KEY (user_name)   REFERENCES Users(user_name),
    FOREIGN KEY (friend_name) REFERENCES Users(user_name)
);

CREATE TABLE Board (
    owner_name VARCHAR(32)  NOT NULL,
    name VARCHAR(64)        NOT NULL,
    description VARCHAR(512),
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (owner_name, name),
    FOREIGN KEY (owner_name) REFERENCES Users(user_name)
);

CREATE TABLE Object (
    id INTEGER              NOT NULL AUTO_INCREMENT,
    source VARCHAR(32)      DEFAULT 'Hazelnoot',
    type VARCHAR(16)        NOT NULL,
    url VARCHAR(256)        NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, source),
    UNIQUE (url)
);

CREATE TABLE Rating (
    object_id INTEGER       NOT NULL,
    source VARCHAR(32),
    user_name VARCHAR(32)   NOT NULL,
    rating INTEGER          NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (object_id, source, user_name),
    FOREIGN KEY (object_id, source) REFERENCES Object(id, source),
    FOREIGN KEY (user_name) REFERENCES Users(user_name)
);

CREATE TABLE Pin (
    object_id INTEGER,
    source VARCHAR(32),
    user_name VARCHAR(32),
    board_name VARCHAR(64),
    description VARCHAR(512),
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (object_id, source, user_name, board_name),
    FOREIGN KEY (object_id, source) REFERENCES Object(id, source),
    FOREIGN KEY (user_name) REFERENCES Users(user_name),
    FOREIGN KEY (user_name, board_name) REFERENCES BoaRD(owner_name, name)
);

CREATE TABLE Tags (
    object_id INTEGER       NOT NULL,
    source VARCHAR(32),
    tag VARCHAR(64)         NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (object_id, source, tag),
    FOREIGN KEY (object_id, source) REFERENCES Object(id, source)
);
