const expressLoader = require('./loaders/express'); 
const routeLoader = require('./loaders/routes');
const mongoose = require("mongoose");
const socketLoader = require('./loaders/socket');

//dotenv 왜 안돼
const uri = `mongodb+srv://kicoa24:PAD0MzMGKxsDGwsR@appcluster1.f4jfg.mongodb.net/`
//const uri = `mongodb+srv://kicoa24:${process.env.MONGO_PW}@hhr.q7myyqa.mongodb.net/`
mongoose.connect(uri)
  .then(() => console.log('mongoDB 연결 '))
  .catch((error) => console.log('mongoDB 실패 ',error))


module.exports = async (app) => {
    await expressLoader(app);
    await routeLoader(app);

    const io = app.get('io'); // app에서 io 가져오기
    //console.log(io);
    socketLoader(io);  // socket.io 로드
};

//kicoa24 , 이전 pxqWjDWO30Q3hHFZ 몽고db  최신 PAD0MzMGKxsDGwsR
