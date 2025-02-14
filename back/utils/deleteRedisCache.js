

const invalidateOnGoingOrdersCache = async (userId, redisCli) => {
    const cacheKey = `OnGoingOrders:${userId}`;
    try {
      await redisCli.del(cacheKey);
      console.log(`[CACHE] !!!! 진행중 주문 캐시 삭제 완료: 사용자 ${userId}`);
    } catch (error) {
      console.error('캐시 삭제 실패:', error);
      throw error; // 상위에서 에러 처리 가능하도록 전파
    }
  };

  const invalidateCompletedOrdersCache = async (userId, redisCli) => {
    const cacheKey = `completedOrders:${userId}`;
    try {
      await redisCli.del(cacheKey);
      console.log(`[CACHE]!!!!  완료 주문 캐시 삭제 완료: 사용자 ${userId}`);
    } catch (error) {
      console.error('캐시 삭제 실패:', error);
      throw error; // 상위에서 에러 처리 가능하도록 전파
    }
  };

  module.exports = {
    invalidateOnGoingOrdersCache,
    invalidateCompletedOrdersCache
  };