const {Router}= require('express');
const { getCart, addOrder } = require('../controllers/cart');
const { validateJWT } = require('../helpers/jwt');



const router= new Router();


router.get('/api/cart',validateJWT,getCart);

router.post('/api/addToCart/:id',addOrder);


module.exports=router;