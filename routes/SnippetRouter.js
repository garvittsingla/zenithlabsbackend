const express = require("express")
const SnippetRouter = express.Router()
const Snippet = require("../models/Snippetmodel")
const mongoose = require("mongoose")
const Instapuppet = require('../functions/instagramPuppet')
const auth = require("../middleware")
require("dotenv").config()
const getMetadata = require("../functions/GeminiAPIscript")
const Linkedinpuppet = require('../functions/LinkedinPuppet')
const getKeywords = require("../functions/Getdata")


SnippetRouter.use(express.json())
SnippetRouter.post("/create", auth, async (req, res) => {
    console.log("Creating snippet");
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({
                message: "URL is required"
            });
        }

        let data;
        
        if (url.includes("linkedin")) {
            const puppeteerResult = await Linkedinpuppet(url);
            console.log("I am in linkedin")
            if (!puppeteerResult[0]) {
                throw new Error('LinkedIn screenshot failed: ' + puppeteerResult[1]);
            }
            
            const metadataResult = await getMetadata(puppeteerResult[1]);
            if (!metadataResult[0]) {
                throw new Error('LinkedIn metadata failed: ' + metadataResult[1]);
            }
            
            data = metadataResult[1];
        } else {
            const puppeteerResult = await Instapuppet(url);
            if (!puppeteerResult[0]) {
                throw new Error('Instagram screenshot failed: ' + puppeteerResult[1]);
            }
            console.log("Screenshot saved successfully");
            
            const metadataResult = await getMetadata(puppeteerResult[1]);
            if (!metadataResult[0]) {
                throw new Error('Instagram metadata failed: ' + metadataResult[1]);
            }
            console.log("Metadata generated successfully");
            
            data = metadataResult[1];
        }

        if (!data || !data.title || !data.description || !data.platform || !data.keywords) {
            throw new Error('Invalid metadata received: Missing required fields');
        }

        const created = await Snippet.create({
            userId: req.userId,
            title: data.title,
            description: data.description,
            platform: data.platform,
            tags: data.keywords,
            url: url
        });

        return res.status(200).json({
            message: "Snippet created successfully",
        });

    } catch (error) {
        console.error('Error in snippet creation:', error);
        return res.status(500).json({
            message: error.message || "Failed to create snippet",
            error: error.toString()
        });
    }
});


SnippetRouter.get("/view",auth,async(req,res)=>{
   const userId = req.userId
   const data = await Snippet.find({userId:userId}).sort({createdAt:-1})
   if (data){
    return res.status(200).json(data)
   }else{
    return res.status(211).json({message:"Something went wrong"})
   }
        
    
})
SnippetRouter.post("/ai",auth,async(req,res)=>{
    const userId = req.userId
    console.log("userid",userId)
    const {prompt} = req.body
    const data = await Snippet.find({
        userId:userId
    })
    // console.log(data)
    const alltags = []
    data.forEach((snippet)=>{
        snippet.tags.forEach((tag)=>{
            if (alltags[tag]){
                alltags[tag] = alltags[tag]+1
            }else{
               alltags.push(tag)
            }
        })
    })
    console.log(alltags)
    const resultt = await getKeywords(prompt, alltags)
    console.log( "result",resultt )
   
    const finalresultt = JSON.parse(resultt)
    console.log(finalresultt)
    if (finalresultt == null ){
        return res.status(411).json({message:"Sorry no posts found"})
        
    }
    
    const matchingSnippets = []
    for (const tag of finalresultt) {
        const snippet = await Snippet.findOne({ "tags": { $regex: tag }, userId: userId })
        if (snippet) matchingSnippets.push(snippet)
    }
    console.log(matchingSnippets)
// console.log(matchingSnippets)
   const finalobj = []
   const seenIds = new Set()
   for (let i = 0; i < matchingSnippets.length; i++) {
        if (!seenIds.has(matchingSnippets[i]._id.toString())) {
            seenIds.add(matchingSnippets[i]._id.toString())
            finalobj.push(matchingSnippets[i])
        }
    }
    return res.status(200).json(finalobj)
 })
 

module.exports=SnippetRouter
