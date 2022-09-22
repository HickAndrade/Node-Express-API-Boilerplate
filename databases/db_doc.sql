/* create and modify tables with mssql extension */ 

-- 21/09/2022
CREATE TABLE TB_USERS (
    USER_ID INT NOT NULL IDENTITY(1,1), /* demo only */
    USER_EMAIL VARCHAR(254),
    USER_PASSWD CHAR(60)
)

DROP TABLE TB_PRODS

CREATE TABLE TB_PRODS (
    PRODS_ID INT NOT NULL IDENTITY(1,1), /* demo only */
    PROD_COD VARCHAR(100),
    PROD_DESC VARCHAR(255),
    PROD_VALUE FLOAT,
    PROD_IMGPATH VARCHAR(255)
)

