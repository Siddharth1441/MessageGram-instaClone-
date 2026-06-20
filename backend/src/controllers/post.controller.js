const postModel = require("../models/post.model");
const Imagekit = require('@imagekit/nodejs')
const { toFile } = require("@imagekit/nodejs");
const likeModel = require("../models/like.model");
const savedPostModel = require("../models/savedPost.model")
const commentModel = require("../models/comment.model")
const notificationModel = require("../models/notification.model")
const asyncHandler = require("../utils/asyncHandler")
const { extractTags } = require("../utils/postText")

const imagekit = new Imagekit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

function mediaTypeFromMime(mimeType = "") {
    return mimeType.startsWith("video/") ? "video" : "image"
}

async function uploadToImageKit(uploadedFile) {
    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(uploadedFile.buffer), uploadedFile.originalname || 'file'),
        fileName: uploadedFile.originalname || "uploaded-file",
        folder: "cohort2-insta-clone"
    })

    return {
        url:file.url,
        type:mediaTypeFromMime(uploadedFile.mimetype),
        thumbnailUrl:file.thumbnailUrl,
        fileId:file.fileId
    }
}

async function serializePost(post, viewerId) {
    const [likesCount, commentsCount, isLiked, isSaved] = await Promise.all([
        likeModel.countDocuments({ post:post._id }),
        commentModel.countDocuments({ post:post._id }),
        viewerId ? likeModel.exists({ post:post._id, user:viewerId }) : null,
        viewerId ? savedPostModel.exists({ post:post._id, user:viewerId }) : null
    ])

    return {
        ...post,
        likesCount,
        commentsCount,
        isLiked:Boolean(isLiked),
        isSaved:Boolean(isSaved)
    }
}

const createPostController = asyncHandler(async function createPostController(req,res){
    const uploadedFiles = req.files?.length ? req.files : (req.file ? [req.file] : [])

    if (!uploadedFiles.length) {
        return res.status(400).json({
            message: "At least one image or video file is required"
        })
    }

    if (uploadedFiles.length > 10) {
        return res.status(400).json({ message:"Carousel posts can contain up to 10 files" })
    }

    const unsupportedFile = uploadedFiles.find(file => !file.mimetype?.startsWith("image/") && !file.mimetype?.startsWith("video/"))
    if (unsupportedFile) {
        return res.status(400).json({ message:"Only image and video uploads are supported" })
    }

    const media = await Promise.all(uploadedFiles.map(uploadToImageKit))
    const { hashtags, mentions } = extractTags(req.body.caption)

    const post = await postModel.create({
        caption: req.body.caption,
        imageUrl: media[0].url,
        media,
        hashtags,
        mentions,
        user: req.user.id,
        visibility:req.body.visibility || "public"
    })

    res.status(201).json({
        Message:"Post created",
        post
    })

})

const getPostController = asyncHandler(async function getPostController(req,res){

    const userId = req.user.id 
    const limit = Math.min(Number(req.query.limit) || 20, 50)
    const page = Math.max(Number(req.query.page) || 1, 1)

    const posts = await postModel.find({
        user:userId
    }).populate("user","username name profileImage").sort({createdAt:-1}).skip((page - 1) * limit).limit(limit).lean()

    res.status(200)
    .json({
        message:"Post fetched",
        posts:await Promise.all(posts.map(post => serializePost(post, userId))),
        page,
        limit
    })

})

const getPostDetails = asyncHandler(async function getPostDetails(req,res) {
    
    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId).populate("user","username name profileImage").lean()
    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }

    return res.status(200).json({
        message:"Post fetched",
        post:await serializePost(post, userId)
    })
})

const likePostController = asyncHandler(async function likePostController(req,res) {
    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }
    const like = await likeModel.findOneAndUpdate(
        { post:postId, user:userId },
        { post:postId, user:userId },
        { upsert:true, new:true, setDefaultsOnInsert:true }
    )

    if (post.user.toString() !== userId) {
        await notificationModel.findOneAndUpdate(
            { recipient:post.user, actor:userId, type:"like", post:postId },
            { recipient:post.user, actor:userId, type:"like", post:postId },
            { upsert:true, new:true, setDefaultsOnInsert:true }
        )
    }

    res.status(200).json({
        message:"Post liked successfully",
        like
    })



})

const unlikePostController = asyncHandler(async function unlikePostController(req,res) {
    const postId  = req.params.postId
    const userId = req.user.id 

    const isLiked = await likeModel.findOne({
        post : postId,
        user:userId

    })

    if(!isLiked){
        return res.status(400).json({
            message:"Post didn't like "
        })
    }

   await likeModel.findOneAndDelete({_id:isLiked._id})

   return res.status(200).json({
    message:"Post unliked"
   })
})




const getFeedController = asyncHandler(async function getFeedController(req,res) {

    const user = req.user;
    const limit = Math.min(Number(req.query.limit) || 20, 50)
    const page = Math.max(Number(req.query.page) || 1, 1)

    const posts = await postModel.find()
        .populate("user","username name profileImage")
        .sort({createdAt:-1,_id:-1})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    res.status(200).json({
        message: "Posts fetched successfully",
        posts:await Promise.all(posts.map(post => serializePost(post, user.id))),
        page,
        limit,
        hasMore:posts.length === limit
    });
})

const deletePostController = asyncHandler(async function deletePostController(req,res) {
    const post = await postModel.findById(req.params.postId)

    if (!post) {
        return res.status(404).json({ message:"Post not found" })
    }

    if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message:"You can only delete your own posts" })
    }

    await Promise.all([
        post.deleteOne(),
        likeModel.deleteMany({ post:post._id }),
        commentModel.deleteMany({ post:post._id }),
        savedPostModel.deleteMany({ post:post._id })
    ])

    res.status(200).json({ message:"Post deleted" })
})

const updatePostController = asyncHandler(async function updatePostController(req,res) {
    const post = await postModel.findById(req.params.postId)

    if (!post) {
        return res.status(404).json({ message:"Post not found" })
    }

    if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message:"You can only edit your own posts" })
    }

    const { hashtags, mentions } = extractTags(req.body.caption || "")
    post.caption = req.body.caption ?? post.caption
    post.hashtags = hashtags
    post.mentions = mentions
    await post.save()

    res.status(200).json({ message:"Post updated", post })
})

const searchPostsController = asyncHandler(async function searchPostsController(req,res) {
    const q = (req.query.q || "").trim()
    const tag = (req.query.tag || "").replace(/^#/, "").toLowerCase()
    const limit = Math.min(Number(req.query.limit) || 20, 50)

    const filter = tag ? { hashtags:tag } : q ? { $text:{ $search:q } } : {}
    const posts = await postModel.find(filter)
        .populate("user","username name profileImage")
        .sort({createdAt:-1})
        .limit(limit)
        .lean()

    res.status(200).json({
        message:"Posts searched",
        posts:await Promise.all(posts.map(post => serializePost(post, req.user.id)))
    })
})


module.exports = {
    createPostController,
    getPostController,
    getPostDetails,
    likePostController,
    getFeedController,
    unlikePostController,
    deletePostController,
    updatePostController,
    searchPostsController
}
