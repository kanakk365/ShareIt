import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { ContentModel } from "../db/db";
const contentRouter = Router()

contentRouter.get("./test", (req: Request, res: Response) => {
    res.json({
        message: "testing /content/test route"
    })
})

contentRouter.post("/create", async (req: Request, res: Response) => {
    try {
        const { link, type, title, description, tags, userId } = req.body

        await ContentModel.create({
            link,
            type,
            title,
            description,
            date: Date.now(),
            tags,
            userId
        })
        res.status(201).json({
            message: "Content created"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error something went wrong",
            error: error
        })
    }
})

contentRouter.delete("/remove", async (req: Request, res: Response): Promise<void> => {
    try {
        const { contentId, userId } = req.body;

        if (!contentId || !userId) {
            res.status(400).json({
                message: "Content ID and User ID are required"

            })
            return
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            res.status(400).json({
                message: "Invalid Content id"
            })
            return
        }
        const content = await ContentModel.findById(contentId)
        if (!content) {
            res.status(404).json({
                message: "Content not found"
            })
            return
        }
        if (content.userId && content.userId.toString() !== userId) {
            res.status(403).json({
                message: "You are not authorized to delete this content"
            })
        }

        await ContentModel.findByIdAndDelete(contentId)

        res.status(200).json({
            message:"Content deleted successfully"
        })
        return
    } catch (error) {
        console.error("Error deleting content : " , error)
        res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
})

export default contentRouter