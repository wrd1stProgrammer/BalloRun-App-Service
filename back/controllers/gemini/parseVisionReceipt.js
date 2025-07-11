
module.exports = function parseVisionReceipt(raw) {
    // 1) 코드펜스 제거
    const txt = raw.replace(/```(?:json)?|```/gi, '').trim();
  
    // 2) 배열 JSON 추출
    const arrMatch = txt.match(/\[.*\]/s);
    if (!arrMatch) throw new Error('항목 배열을 찾지 못했습니다.');
    const list = JSON.parse(arrMatch[0]);
  
    // 3) total_co2_g 추출
    const totalMatch = txt.match(/total_co2_g\\s*[:=]\\s*(\\d+)/i);
    const total = totalMatch ? Number(totalMatch[1]) : 0;
  
    return { list, total_co2_g: total };
  };
  