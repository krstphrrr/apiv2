
const Header = require('../models/dataHeader')
const SoilStab= require('../models/dataSoilStability')


exports.getSoilStab = (req, res, next) =>{
  // let whichSoilStab = req.params

  // Header.findAll({
  //   where: whichSoilStab,
  //   include: [
  //     {
  //       model: SoilStab,
  //       as: 'soilstab'
  //     }
  //   ],

  //   // limit:100,
  //   raw:true,

  // })

  // .then( r => {
  //   res.status(200).json(r)
  // })
  // .catch(err=>{console.log(err)})

  sql = `
  SELECT "dataHeader".*, "dataSoilStability".* 
  FROM (
    SELECT * FROM "dataHeader" AS "dataHeader" 
    ) 
  AS "dataHeader" 
  LEFT OUTER JOIN "dataSoilStability" AS "dataSoilStability" 
    ON "dataHeader"."PrimaryKey" = "dataSoilStability"."PrimaryKey"
  `
let values = []
let head = "WHERE "
if (Object.keys(req.query).length!==0){
let list = []
let count = 1

for(const [key,value] of Object.entries(req.query)){
console.log(key,value)
if(Array.isArray(value)){

for (i = 0; i<value.length; i++){
temp = `"dataSoilStability"."${key}" = $${count}`
count+=1
values.push(value[i])
list.push(temp)
}
} else {

temp = `"dataSoilStability"."${key}" = $${count}`
count+=1
values.push(value)
list.push(temp)    

}

}

sql = sql + head + list.join(" AND ")
console.log(sql)


}
pool.connect((err,client, release)=>{
res.contentType('application/json')
if(err){
return console.error("error ")
}
if (Object.keys(req.query).length!==0){

const query = new QueryStream(sql, values)
const stream = client.query(query)
stream.on('end',release)
stream.pipe(JSONStream.stringify()).pipe(res)
} else{
const query = new QueryStream(sql)
const stream = client.query(query)

stream.on('end',release)
stream.pipe(JSONStream.stringify()).pipe(res)
}
})

}