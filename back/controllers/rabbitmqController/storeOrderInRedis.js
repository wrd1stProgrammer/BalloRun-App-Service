const storeOrderInRedis = async (redisCli, orderData) => {
    console.log("저장ㅇ",orderData);
    const orderKey = `order:${orderData.userId}`;
    try {
      await redisCli.set(orderKey, JSON.stringify(orderData), { EX: 300 }); // 5분 TTL 설정
      console.log(`Order stored in Redis with key: ${orderKey}`);
    } catch (err) {
      console.error("Error storing order in Redis:", err);
    }
  };

  module.exports = {
    storeOrderInRedis,
  };