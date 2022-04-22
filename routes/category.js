const {Router}= require('express');
const { postCategory, getCategories } = require('../controllers/category');


const router= new Router();


router.get('/api/categories',getCategories);
router.post('/api/category',postCategory);


module.exports=router;