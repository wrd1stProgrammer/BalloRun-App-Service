const Address = require('../../models/Address');
const User = require('../../models/User');

const addAddress = async (req, res) => {
    const { userId, address, detail, postalCode, addressType, riderNote, entranceCode, directions } = req.body;

    console.log('📌 요청된 데이터:', req.body); // 🔥 요청 데이터 출력

    try {
      if (!userId || !address || !addressType) {
        console.error('❌ 필수 필드 누락:', { userId, address, addressType });
        return res.status(400).json({ message: 'userId, address, addressType은 필수입니다.' });
      }

      const newAddress = await Address.create({
        userId,
        address,
        detail,
        postalCode,
        addressType,
        riderNote,
        entranceCode,
        directions,
      });

      await User.findByIdAndUpdate(userId, { $push: { addresses: newAddress._id } });

      res.status(201).json({ message: '주소 등록 완료', newAddress });
    } catch (error) {
      console.error('❌ 주소 등록 중 오류 발생:', error);
      res.status(500).json({ message: '서버 내부 오류 발생', error: error.message });
    }
};

const getUserAddresses = async (req, res) => {
    try {
        const { userId } = req.params;
        const addresses = await Address.find({ userId }); // Find addresses for the user
        res.status(200).json(addresses);
    } catch (error) {
        console.error('❌ Failed to fetch addresses:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};


module.exports = {
  addAddress,
  getUserAddresses
};