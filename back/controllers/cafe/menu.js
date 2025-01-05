const Menu = require("../../models/Menu");


const getMenusBycafeName = async(req,res) => {
    const { cafeName } = req.params;
    console.log("카페네임", cafeName, {cafeName});
    console.log("cafeName 타입:", typeof cafeName);
    try {
        const menus = await Menu.find({ cafeName: cafeName.trim() }); // cafeId에 맞는 메뉴
        console.log(menus,'메뉴');
        res.json(menus);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
}

module.exports = {
    getMenusBycafeName
}