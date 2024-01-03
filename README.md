npm install sass
npm i --save-dev @types/jsonwebtoken
npm install @types/next@latest --save-dev
npm install react-datepicker or yarn add react-datepicker ( npm i --save-dev @types/react-datepicker  )
npm install clsx
npm install react-query

### 메모장
CREATE TABLE subscription (
    Subs_Index INT AUTO_INCREMENT PRIMARY KEY,
    User_Index INT NOT NULL,
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
