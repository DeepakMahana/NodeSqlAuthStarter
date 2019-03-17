//Make this global to use all over the application
let DATABASE = {} 

DATABASE.app          = process.env.APP   || 'dev';
DATABASE.port         = process.env.PORT  || '3000';

DATABASE.db_dialect   = process.env.DB_DIALECT    || 'mysql';
DATABASE.db_host      = process.env.DB_HOST       || 'localhost';
DATABASE.db_port      = process.env.DB_PORT       || '3306';
DATABASE.db_name      = process.env.DB_NAME       || 'nodesql';
DATABASE.db_user      = process.env.DB_USER       || 'root';
DATABASE.db_password  = process.env.DB_PASSWORD   || 'Dmahana@123';

DATABASE.jwt_encryption  = process.env.JWT_ENCRYPTION || 'jwt_auth_token';
DATABASE.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

module.exports = DATABASE;