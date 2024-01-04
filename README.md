npm install sass
npm i --save-dev @types/jsonwebtoken
npm install @types/next@latest --save-dev
npm install react-datepicker or yarn add react-datepicker ( npm i --save-dev @types/react-datepicker  )
npm install clsx
npm install react-query

npm i --save-dev @types/react-slick
npm install slick-carousel
users 테이블 명령어
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    userId VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    birthdate DATE,
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    address VARCHAR(255),
    gender VARCHAR(255),
    cash INT(11),
    joinDate DATE,
    isWithdrawn TINYINT(1),
    PRIMARY KEY (id)
);


### 메모장
CREATE TABLE order (
    Order INT AUTO_INCREMENT PRIMARY KEY,
    User_Indexerp INT NOT NULL,
    Detail_Index INT NOT NULL,
    price INT NOT NULL,
    Subs_Start TIMESTAMP NOT NULL,
    Subs_End TIMESTAMP NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    name VARCHAR(16) NOT NULL,
    address VARCHAR(300) NOT NULL,
    zipCode VARCHAR(8) NOT NULL,
    tel VARCHAR(16) NOT NULL,
    req VARCHAR(300),
    status VARCHAR(16),
    UNIQUE (Subs_Index),
    <!-- FOREIGN KEY (User_Index) REFERENCES user(User_Index),
    FOREIGN KEY (Detail_Index) REFERENCES detail(Detail_Index) -->
);

CREATE TABLE subscription (
    Subs_Index INT AUTO_INCREMENT PRIMARY KEY,
    Product_Index INT NOT NULL,
    Name VARCHAR(50) NOT NULL,
    Price INT NOT NULL,
    Week INT NOT NULL
);