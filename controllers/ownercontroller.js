const {registrationSchema} = require('../middlewares/validater');
const owner = require('../models/ownerModel');

exports.submit = async (req, res) => {
  const { email,name, wheeler, address,price } = req.body;

  // Validate input using Joi schema
  const { error } = registrationSchema.validate({ email, name });
  if (error) {
    return res.status(400).json({ success: false, message: 'Schema not matched', details: error.details });
  }

  try {
    const existingOwner = await owner.findOne({ address, wheeler,email });

    if (existingOwner) {
      return res.status(409).json({ success: false, message: 'You have already registered your space' });
    }
    const newOwner = new owner({ email,name, wheeler, address,price });
    await newOwner.save();

    return res.status(201).json({ success: true, message: 'Your registration is complete' });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
exports.search = async (req, res) => {
  const { address, wheeler } = req.body;
  try {
    const existingOwner = await owner.findOne({ address, wheeler });
    if (!existingOwner) {
      return res.status(404).json({ success: false, message: 'No parking found' });
    }
    return res.status(200).json({ success: true, existingOwner });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.share=async(req,res)=>{
  const{address,wheeler}=req.body
  try {
const existingOwner=await owner.findOne({address,wheeler})
if(!existingOwner)
{
   return res.status(409).json({success:false,message:'No any parking found their'})
}
return res.status(201).json({success:true,message:'Parking found there', existingOwner})
  } catch (error) {
    return res.status(500).json({success:false,message:'server failed'})
  }
  
}