const express = require("express")
const router = express.Router()
const fetchuser = require("../middlewares/fetchUser")
const Notes = require("../models/notes")
const {body, validationResult} = require("express-validator")

// ROUTE 1 --> Get All the Notes using : GET "/api/auth/fetchallnotes". Login Required.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try{
        const notes = await Notes.find({user : req.user.id})
        res.status(200).json(notes)
    }
    catch(err){
        console.log(err);
        res.status(501).json({
            status : "Success",
            msg : err.message
        })
    }
})

// ROUTE 2 --> Add a new note using POST "/api/auth/addnote". Login required
router.post("/addnote", fetchuser, [
    body('title', 'Enter a valid title').isLength({min : 3}),
    body('description', 'Description ,must be atleat 5 characters').isLength({min : 3})
], async(req, res) => {
    try{
        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                status : "failure",
                errors : errors.array()
            })
        }
        const note = new Notes({
            title, 
            description,
            tag,
            user : req.user.id
        })
    
        const result = await note.save()
        res.status(200).json({
            status : "Success",
            result : result
        })
    }
    catch(err){
        console.log(err);
        res.status(501).json({
            status : "Success",
            msg : err.message
        })
    }
})

// ROUTE 3 --> Update an existing note using : PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async(req, res) => {
    try{
        const {title, description, tag} = req.body
        // creating a new note object
        const newNote = {};
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}
    
        // Find the note to be updated and update it
        const note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).json({
                status : "Failure",
                message : "Requested note not found !!!"
            })
        }
        // allow updation only if users owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).json({
                status : "failure",
                messsage : "Not allowed !!!"
            })
        }
    
        const notes = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new : true})
        res.status(200).json({
            status : "Success",
            result : notes
        })

    }
    catch(err){
        console.log(err);
        res.status(501).json({
            status : "Success",
            msg : err.message
        })
    }
})

// ROUTE 4 --> Update an existing note using : DELETE "/api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchuser, async(req, res) => {
    try{
        // Find the note to be deleted and delete it
        const note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).json({
                status : "Failure",
                message : "Requested note not found !!!"
            })
        }
        // allow deletion only if users owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).json({
                status : "failure",
                messsage : "Not allowed !!!"
            })
        }
    
        const notes = await Notes.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status : "Success",
            result : notes
        })

    }
    catch(err){
        console.log(err);
        res.status(501).json({
            status : "Success",
            msg : err.message
        })
    }

})


module.exports = router;