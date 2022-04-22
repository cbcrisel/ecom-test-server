const {pool}=require('../database/config');


const getProductsByCategory=async(req,res)=>{
    const {id}= req.params;
    console.log(id);
    const result = await pool.query('SELECT * FROM products WHERE products.category_id = $1 ',[id]);
    res.status(200).json(result.rows);
}

const postProduct=async(req,res)=>{
    try {
        const {name,price,category_id} = req.body;
        const path= req.file.path;
        const result= await pool.query('INSERT INTO products (name,price,photo_path,category_id) VALUES ($1, $2, $3, $4)',[name,price,path,category_id]);
        res.status(200).send( 'Product Added')
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Server Error'
        })
    }
}



module.exports={
    getProductsByCategory, postProduct
}