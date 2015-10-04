process.env.HOST = 'http://192.168.91.74:7791/';
process.env.PORT = 7791;

process.env.DB_HOST = 'mongodb://192.168.90.51:27017/mgovermentDB,192.168.90.52:27017/mgovermentDB,192.168.91.74:27017/mgovermentDB';
process.env.DB_NAME = "mgovermentDB";
process.env.DB_PORT = 27017;
process.env.DB_REPLICASET = 'mgovReplicaset';

process.env.MAIL_SERVICE = 'SendGrid';
process.env.MAIL_USERNAME = 'istvan.nazarovits';
process.env.MAIL_PASSWORD = 'sendGridpassw365';