const Menu = require("../../models/Menu");

const getMenusBycafeName = async (req, res) => {
  const { cafeName } = req.params;
  // Redis 클라이언트 가져오기
  const redisClient = req.app.get("redisClient");
  const redisCli = redisClient.v4;

  const emitSocketTest = req.app.get("emitSocketTest");

  try {
    
    // 1. Redis에서 데이터 확인
    const cacheKey = `menus:${cafeName}`; // Redis 캐싱 키

    const cachedMenus = await redisCli.get(cacheKey);


    if (cachedMenus) {
      emitSocketTest(`Cached menus for ${cachedMenus}`);
      console.log("Redis 캐시에서 메뉴 로드");
      return res.json(JSON.parse(cachedMenus)); // 캐시된 데이터 반환
    }

    // 2. Redis에 데이터가 없으면 MongoDB에서 조회
    const menus = await Menu.find({ cafeName: cafeName.trim() });

    if (!menus || menus.length === 0) {
      console.log("메뉴 데이터 없음");
      return res.status(404).json({ error: "해당 카페의 메뉴를 찾을 수 없습니다." });
    }

    const stringifiedMenus = JSON.stringify(menus); // 배열 데이터를 문자열로 변환
    await redisCli.set(cacheKey, stringifiedMenus, { EX: 300 }); // TTL: 300초
    console.log("Redis에 메뉴 캐싱 완료");

    emitSocketTest(`Loaded menus for ${stringifiedMenus}`);
    // 클라이언트에 응답
    res.json(menus);
  } catch (error) {
    console.error("메뉴 조회 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
};



module.exports = {
    getMenusBycafeName
}