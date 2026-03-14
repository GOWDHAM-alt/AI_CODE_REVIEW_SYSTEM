const {saveReview,getReviewByUser,getReviewById,deleteReview}=require('../models/reviewModel');
const {reviewCode}=require('../services/aiService');
const SUPPORTED_LANGUAGES = [
  'javascript', 'python', 'java', 'c', 'c++',
  'typescript', 'php', 'ruby', 'go', 'rust'
];

const submitCode = async (req, res) => {
    
    try{
        const {code,language}=req.body;
        const userId=req.user.id;

        if(!code || !language)
        {
            return res.status(400).json({ message: 'Code and language are required' });
        }
        if(!SUPPORTED_LANGUAGES.includes(language))
        {
            return res.status(400).json({ message: `Language not supported. Supported: ${SUPPORTED_LANGUAGES.join(', ')}` });
        }
        const review =await reviewCode(code,language);
        await saveReview(userId,language,code,review);

        res.json({
          message:"Code Reviewed successfully",review
        });
    }
    catch(err)
    {
       res.status(500).json({message:"Server error",error:err.message})
    }

};

const getHistory=async(req,res)=>{
    try{
        const userId=req.user.id;
        const reviews=await getReviewByUser(userId);
        res.json({reviews});
    }
    catch(err)
    {
        res.status(500).json(
          {    
              message:"Server error",
              error:err.message
          }
        )
    }
}

const getSingleReview=async(req,res)=>{
    try{
       const{userId,reviewId}=req.body;

       const review=await getReviewById(userId,reviewId);
       if(!review)
       {
          return res.status(404).json({message:"No review found"})
       }
       res.json({review});
    }
    catch(err)
    {
        res.status(500).json({
          message:"Server error",
          error:err.message
        })
    }
}

const removeReview=async(req,res)=>{
  try{
    const {reviewId,userId}=req.body;
    await deleteReview(reviewId,userId);

    res.json({
        message:"Review deleted successfully"
    });
  }
  catch(err)
  {
     res.send(500).json({
        message:"Server Error",
        error:err.message
     })
  }
}

module.exports={submitCode,getHistory,getSingleReview,removeReview};