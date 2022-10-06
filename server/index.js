const express = require('express')
const fsPromises = require('fs').promises
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000
const dataFiles = path.join(__dirname,'data.json')//create and combine the paths
//support posting of data with url encoded
app.use(express.urlencoded({extended:true}))
//allow cors
app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");

   next();
});
app.get('/poll',async (req,res)=>{
   let data = JSON.parse(await fsPromises.readFile(dataFiles,'utf-8'))//convert data to native js object
   //total amount of votes
   const totalVotes = Object.values(data).reduce((total,n)=>total += n,0)//takes total +n and 0
    //it will basically give the total of the votes

   data = Object.entries(data)//gives 2d array
         .map(([label,votes])=>{
            return {
                //it will return an array of key as label and value as votes of each choice * 100
                //divided by the total votes
             label,
             percentage: (((100 * votes)/totalVotes) || 0).toFixed(0)
            }
         })//to convert every key-value pair into label-percentage format
   res.json(data)
})
//post the 
app.post('/poll',async (req,res)=>{
    //retrive the data
    const data = JSON.parse(await fsPromises.readFile(dataFiles,'utf-8'))//convert data to native js object
   /*if (req.body.add !== "JAVASCRIPT" ||req.body.add !== "TYPESCRIPT" ||req.body.add !== "BOTH" ) {
    return  res.send('error')
    
   }*/
    data[req.body.add]++//basically whatever we have 
   //lets say JAVASCRIPT as req.body.add and increment it by 1
   //write to data.json
   await fsPromises.writeFile(dataFiles,JSON.stringify(data))//we write in the form of string
   res.end()
})
app.listen(PORT,()=>{
    console.log(`running at port ${PORT}`);
})