CREATE TABLE papeis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    senha VARCHAR(500),
    id_papel INT,
    FOREIGN KEY (id_papel) REFERENCES papeis(id)
);
CREATE TABLE frases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_ DATE,
    autor VARCHAR(45),
    texto VARCHAR(500)
);