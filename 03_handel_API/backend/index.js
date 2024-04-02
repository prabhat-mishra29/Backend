import express from 'express'

const app = express();

const port=process.env.PORT || 3000;

//Standardized form:-
    //Get a list of five products:-
    app.get('/api/products', (req, res) => {

        const productss=[
            {
                id:1,
                name:'table metal',
                price:230
            },
            {
                id:2,
                name:'table wood',
                price:240
            },
            {
                id:3,
                name:'table polyster',
                price:200
            },
            {
                id:4,
                name:'table plastic',
                price:260
            },
            {
                id:5,
                name:'table synthetic',
                price:300
            },
        ];

        //We give an inputfield so that you can filter in the basis of name.
        //http://localhost:3000/api/products?search=metal
        // ? -> query parameter
        
        if(req.query.search){
            //'req' joo araha hai usme puchte hain ki 'search' present hai yaa nahi?
            //Agar hai toh filter karr do
            const filterProducts=productss.filter( (product)=>( product.name.includes(req.query.search)) ) ;
            res.send(filterProducts);

            //Remember:-[otherwise it could crash our application]
            return; 
        }

        //We donot need immediate respose , so we want some delay.
        setTimeout(()=>{
            res.send(productss);
        },3000);

})


app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`)
});