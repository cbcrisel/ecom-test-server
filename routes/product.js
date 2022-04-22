const {Router}= require('express');
const multer= require('multer');
const { postProduct, getProductsByCategory } = require('../controllers/product');


const router= new Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        const ext=file.originalname.split('.').pop();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+'.'+ext);
    }
  })
  
const upload = multer({storage:storage})




router.get('/api/products/:id',getProductsByCategory);


router.post('/api/product',upload.single('file'),postProduct);


module.exports=router;