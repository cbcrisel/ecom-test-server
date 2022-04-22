const {pool}=require('../database/config');


const getCart=async(req,res)=>{
    const {user_id}= req.body;
    const cartResult= await pool.query('SELECT * FROM carts WHERE user_id=$1',[user_id]);
    const cart= cartResult.rows[0];
    console.log(cart);
    if(cart.status=='EMPTY'){
        res.status(200).json({
            msg:'Your cart is empty'
        });
    }
    else if (cart.status=='PENDING'){
        const orderResult= await pool.query('SELECT * FROM orders WHERE cart_id=$1 ORDER BY id DESC LIMIT 1' ,[cart.id]);
        const order= orderResult.rows[0];
        const detailsResult= await pool.query('SELECT  products.id as productId, products.name, products.photo_path, order_details.product_amount, order_details.price_by_unit, orders.total_price  FROM orders,order_details,products WHERE orders.id=order_details.order_id AND products.id=order_details.product_id AND orders.id=$1',[order.id])
        const details= detailsResult.rows;
        res.status(200).json(details);
    }
}

const addOrder=async(req,res)=>{
    const {id}= req.params;
    const {user_id,product_amount}= req.body;
    const cartResult= await pool.query('SELECT * FROM carts WHERE user_id=$1',[user_id]);
    const productResult= await pool.query('SELECT * FROM products WHERE id=$1',[id]);
    const cart= cartResult.rows[0];
    const product=productResult.rows[0];
    const total_price= product.price*product_amount;
    console.log(total_price);
    if(cart.status=='EMPTY'){
        
        const orderPost= await pool.query('INSERT INTO orders (date,total_price,cart_id) values (CURRENT_DATE, $1, $2)',[total_price,cart.id]);
        const orderResult= await pool.query('SELECT id FROM orders order by id desc LIMIT 1');
        const order= orderResult.rows[0];
        const updateCartResult = await pool.query ("UPDATE carts SET status='PENDING' WHERE id=$1",[cart.id]);
        const detailsResult= await pool.query('INSERT INTO order_details (product_id, order_id, product_amount, price_by_unit, total_product_price) VALUES ($1,$2,$3,$4,$5) ',[product.id, order.id, product_amount,product.price,total_price]);
    }else if (cart.status=='PENDING'){
        const lastOrderResult= await pool.query('SELECT * FROM orders WHERE cart_id=$1 ORDER BY id DESC',[cart.id]);
        const lastOrder= lastOrderResult.rows[0];                    
        const total= parseFloat(lastOrder.total_price)
        const orderUpdate= await pool.query("UPDATE orders SET total_price=$1 where id=$2",[total+total_price,lastOrder.id]);
        const ordeDetailsResult= await pool.query("INSERT INTO order_details (product_id, order_id, product_amount, price_by_unit, total_product_price) VALUES ($1,$2,$3,$4,$5) ",[product.id, lastOrder.id, product_amount,product.price,total_price]);
    }
    res.status(200).send('OKAY');
}


module.exports={
    getCart,addOrder
}