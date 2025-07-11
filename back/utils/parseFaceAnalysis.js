module.exports = function parseFaceAnalysis(raw) {
    // 코드 펜스 제거
    const txt = raw.replace(/```(?:json)?|```/gi, '').trim();
  
    try {
      // 전체 텍스트가 JSON 객체 형식이라고 가정하고 파싱
      const obj = JSON.parse(txt);
      const {
        expression,
        face_shape,
        atmosphere,
        style,
        physiognomy,
        total,
      } = obj;
      return { expression, face_shape, atmosphere, style, physiognomy, total};
    } catch (e) {
      throw new Error('JSON 파싱 실패: ' + e.message);
    }
  };
  