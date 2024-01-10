npm install sass
npm i --save-dev @types/jsonwebtoken
npm install @types/next@latest --save-dev
npm install react-datepicker or yarn add react-datepicker ( npm i --save-dev @types/react-datepicker  )
npm install clsx
npm install react-query

## 데이터베이스 쿼리문 / 그냥 기본 틀이니까 열 추가나 삭제 필요하면 하면서 해주세요!

### User (사용자 정보)  order_Index 외래키로 Orderdetails 테이블에서 구독내용 확인 (자동연장시 갱신x추가해야함)      
CREATE TABLE Users (
    User_Index INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(16) NOT NULL,
    birth DATE NOT NULL,
    phone VARCHAR(16) NOT NULL,
    email VARCHAR(50) NOT NULL,
    address VARCHAR(300) NOT NULL,
    gender CHAR(1) NOT NULL,
    cash INT NULL,
    join_data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isWithdrawn CHAR(1) NOT NULL DEFAULT 'N',
    order_Index int DEFAULT NULL                                              
    FOREIGN KEY (Order_Index) REFERENCES Orderdetails(orderdetails),
);  

### Subscription (구독 서비스 제어) 구독 고유번호가 유저고유번호와 연결, 상품고유번호와도 연결되어 어떤 상품들을 선택했는지 확인 가능, 상품 개수만큼 행이 추가됨
CREATE TABLE Subscription (
    Subs_Index INT AUTO_INCREMENT PRIMARY KEY,
    product_Index INT NOT NULL,
    User_Index INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    week INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (product_Index) REFERENCES Products(Product_Index),
    FOREIGN KEY (User_Index) REFERENCES User(User_Index)
);

<!-- ### Order (고객이 주문하면 여기 저장됩니다.) 유저고유번호와 구독고유번호로 어떤 사용자가 어떤 종료의 구독서비스를 이용하는지 확인가능
CREATE TABLE Order (
    Order_Index INT AUTO_INCREMENT PRIMARY KEY,
    Subs_Index_Subscription INT NOT NULL,
    User_Index INT NOT NULL,
    Subs_Index_Order INT NOT NULL,
    price INT NOT NULL,
    Subs_Start TIMESTAMP NOT NULL,
    Subs_End TIMESTAMP NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(16) NOT NULL,
    address VARCHAR(300) NOT NULL,
    zipCode VARCHAR(8) NOT NULL,
    tel VARCHAR(16) NOT NULL,
    req VARCHAR(300) NULL,
    status INT DEFAULT 0,
    FOREIGN KEY (Subs_Index_Subscription) REFERENCES Subscription(Subs_Index),
    FOREIGN KEY (User_Index) REFERENCES User(User_Index),
    FOREIGN KEY (Subs_Index_Order) REFERENCES Subscription(Subs_Index)
); -->

### CREATE TABLE Orderdetails (고객이 주문하면 여기 저장됩니다. 유저고유번호와 구독고유번호로 어떤 사용자가 어떤 종료의 구독서비스를 이용하는지 확인가능)
    Order_Index INT AUTO_INCREMENT PRIMARY KEY,
    subs_index INT(11) NOT NULL,
    user_Index INT(11) NOT NULL,
    price INT NOT NULL,
    Subs_Start TIMESTAMP NOT NULL,
    Subs_End TIMESTAMP NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE;
    FOREIGN KEY (subs_index) REFERENCES subscription(subs_index),
    FOREIGN KEY (user_Index) REFERENCES users(user_Index)
;


### CREATE TABLE Orderproduct (위의 orderdeatils 에 저장된 구독에 어떤 원두가 선택되었는지 확인하는 테이블)
     OrderProduct_Index  int(11) NOT NULL PRIMARY KEY,
     Order_Index int(11)
     product_id  int(11)
     FOREIGN KEY (Order_Index) REFERENCES Orderdetails(orderdetails),
    FOREIGN KEY (product_id) REFERENCES product(product_id)

### Board (고객센터 관련)
CREATE TABLE Board (
    boardKey INT AUTO_INCREMENT PRIMARY KEY,
    User_Index INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(500) NOT NULL,
    date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(50) NOT NULL,
    image VARCHAR(500) NULL,
    FOREIGN KEY (User_Index) REFERENCES User(User_Index)
);

### Product 상품 정보 (원두 종류가 들어갑니다.)
CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    sale INT NULL,
    stock_quantity INT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    img1 VARCHAR(500) NULL,
    img2 VARCHAR(500) NULL,
    delete_status TINYINT(1) NULL DEFAULT 0,
    display_status TINYINT(1) NULL DEFAULT 0
);

### Category 카테고리 관련
CREATE TABLE Category (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(50) NOT NULL,
    parentCategoryID INT NULL
);

### Cart 추가
CREATE TABLE Cart (
    Cart_Index INT AUTO_INCREMENT PRIMARY KEY,
    User_Index INT NOT NULL,
    Product_Index INT NOT NULL,
    quantity INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_Index) REFERENCES User(User_Index),
    FOREIGN KEY (Product_Index) REFERENCES Product(Product_Index)
);

-------------------------------------------------------------------------------
## NULL 설정은 편의성을 위해 해뒀는데 후에 다시 수정해야 합니다.

CREATE TABLE `orderdetails` (
	`Order_Index` INT(11) NOT NULL AUTO_INCREMENT,
	`subs_index` INT(11) NULL DEFAULT NULL,
	`user_Index` INT(11) NULL DEFAULT NULL,
	`Subs_Start` TIMESTAMP NULL DEFAULT NULL,
	`Subs_End` TIMESTAMP NULL DEFAULT NULL,
	`order_name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`order_phone` INT(50) NULL DEFAULT NULL,
	`address` VARCHAR(300) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`zip_code` INT(30) NULL DEFAULT NULL,
	`auto_renew` TINYINT(1) NULL DEFAULT '1',
	`staus` TINYINT(4) NULL DEFAULT NULL,
	PRIMARY KEY (`Order_Index`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=106
;



### orderproduct 테이블
CREATE TABLE `orderproduct` (
	`OrderProduct_Index` INT(11) NOT NULL AUTO_INCREMENT,
	`Order_Index` INT(11) NULL DEFAULT NULL,
	`product_id` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`OrderProduct_Index`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=44
;


### product 테이블
CREATE TABLE `product` (
	`product_id` INT(11) NOT NULL AUTO_INCREMENT,
	`category_id` INT(11) NULL DEFAULT NULL,
	`product_name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`price` INT(11) NOT NULL,
	`sale` INT(11) NULL DEFAULT NULL,
	`stock_quantity` INT(11) NOT NULL,
	`timestamp` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`img1` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`img2` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`delete_status` TINYINT(1) NULL DEFAULT '0',
	`display_status` TINYINT(1) NULL DEFAULT '0',
	`info` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`product_id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=6
;


### subscription 테이블
CREATE TABLE `subscription` (
	`subs_index` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`week` INT(11) NOT NULL,
	`size` INT(11) NOT NULL,
	`price` INT(11) NOT NULL,
	PRIMARY KEY (`subs_index`) USING BTREE,
	CONSTRAINT `week` CHECK (`week` MOD 4 = 0),
	CONSTRAINT `size` CHECK (`size` MOD 4 = 0)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=7
;

### users 테이블
CREATE TABLE `users` (
	`User_Index` INT(11) NOT NULL AUTO_INCREMENT,
	`userId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`birth` DATE NOT NULL,
	`phone` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`email` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`address` VARCHAR(300) NOT NULL COLLATE 'utf8mb4_general_ci',
	`gender` CHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`cash` INT(11) NULL DEFAULT NULL,
	`timestamp` TIMESTAMP NULL DEFAULT current_timestamp(),
	`signout` CHAR(1) NOT NULL DEFAULT 'N' COLLATE 'utf8mb4_general_ci',
	`admin` TINYINT(1) NULL DEFAULT NULL,
	`RegiMethod` TINYINT(1) NOT NULL,
	`order_Index` TINYINT(4) NULL DEFAULT NULL,
	PRIMARY KEY (`User_Index`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=3002
;
