const bcrypt = require('bcryptjs');
const {createHmac}=require('crypto')
const doHash = async (data, saltRounds) => {
  const result= await bcrypt.hash(data, saltRounds);
  return result
};

const doHashValidation = async (data, hashed) => {
 const result= await bcrypt.compare(data, hashed);
 return result
};
const hmacProcess=(value,key)=>{
  const result=createHmac('sha256',key).update(value).digest('hex')
  return result
}
module.exports = { doHash, doHashValidation,hmacProcess };
