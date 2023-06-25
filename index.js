import axios from 'axios';

// Fetch API data
async function getData(url) {
    const response =
     await axios.get(url)
    .then(response => response.data)
    .catch(error => error);
    return response;
  }

  export async function postData(url , body){
    const response =
     await axios.post(url,body)
    .then(response => response.data)
    .catch(error => error);
    return response;
  }
  
  // Group products by category
 export async function groupProductsByCategory(productsData ,categoriesData, exchangeRate ,currency) {
    const categories = await getData(categoriesData);
    let products = await getData(productsData);
    products= await transformPrices(products,exchangeRate,currency);
    let result = [];
    result.push(categories.map(categories => ({id: categories.id, name: categories.name, products:[]})));
    for(let i=0;i<products.length;i++){
      for(let j=0;j<categories.length;j++){
        if(products[i].category.id===categories[j].id){
         
          result[0][j].products.push(products[i]);
        }
      }
    }

        
    return result;
  }


  
  
  //  transform prices from dollars to EGP using Open Exchange Rates API
  async function transformPrices(products,url,currency) {
    
    const data= await getData(url)
    const cur =currency;
    console.log(cur)
    const rate = data.rates[cur];
    console.log(rate)
    
    const transformedProducts = products.map((product) => {
      product.price = Math.round(product.price * rate * 100) / 100;
      return product;
    });
    return transformedProducts;
  }

  // const transformed= await groupProductsByCategory(productsData ,categoriesData, exchangeRate);
  // console.log(JSON.stringify(transformed,null,4));