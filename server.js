import { z } from "zod";
import http from "http";
import { URL } from "url";
import { groupProductsByCategory,postData } from "./index.js";

const productsData='https://api.escuelajs.co/api/v1/products';
const categoriesData='https://api.escuelajs.co/api/v1/categories?limit=5';
const exchangeRate='https://openexchangerates.org/api/latest.json?app_id=9484a5bfb9d146b08cb334373f89a599&symbols=';
const defaultCurrency="EGP";

const objSchema = z.string({
  title: z.string(),
  price: z.number(),
  description: z.string(),
  categoryId: z.number(),
  images: z.string().array(),
});

const requestListener = async (req, res) => {
  if (req.method === "GET") {
    const myUrl=new URL(req.url, `http://${req.headers.host}`);
    let currency= myUrl.searchParams.get('CUR');
   
    
    if(!currency){
       currency=defaultCurrency;
    }
        const transformed = await groupProductsByCategory(
            productsData,
            categoriesData,
            exchangeRate,
            currency
          );
    
    
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.write(JSON.stringify(transformed));
    res.end();


  } else if (req.method === "POST" && req.url ==="/products") {

    //postData(productsData)

    // objSchema.parse(req);
    // res.setHeader("Content-Type", "application/json");
    // res.writeHead(200);
    let reqBody = "";
    req.on("data", (chunk) => {
        reqBody += chunk;
      })
      .on("end",async () => {
        const validatedBody= objSchema.parse(reqBody);
       
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        const postedProduct= await postData(productsData,validatedBody);
        console.log(postedProduct);
        res.write(JSON.stringify(postedProduct))
        res.end();

      });
      //console.log(reqBody);
  }
};
const server = http.createServer(requestListener);

server.listen(3000, "localhost", () => {
  console.log("server running on 3000");
});
