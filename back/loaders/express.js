// loaders/express.js
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

module.exports = async (app, server) => {  // server 추가
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(morgan('dev'));


    console.log('Express  설정 완료');
};
