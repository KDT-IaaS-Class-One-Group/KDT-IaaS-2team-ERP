npm install sass
npm i --save-dev @types/jsonwebtoken
npm install @types/next@latest --save-dev
npm install react-datepicker or yarn add react-datepicker ( npm i --save-dev @types/react-datepicker  )
npm install clsx
npm install react-query

사용한 쿼리문

### Board (고객센터 관련)

CREATE TABLE Board ( boardKey INT AUTO_INCREMENT PRIMARY KEY, User_Index INT NOT NULL, title VARCHAR(100) NOT NULL, content VARCHAR(500) NOT NULL, date TIMESTAMP NULL NOT DEFAULT CURRENT_TIMESTAMP, password VARCHAR(50) NOT NULL);