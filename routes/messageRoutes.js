import express from "express";
import {
  getMessages,
  getMessage,
  postMessage,
  deleteMessageById,
} from "../controllers/messageController.js";

const router = express.Router();

// Get all messages
router.get("/", getMessages);

// Get single message
router.get("/:id", getMessage);

// Create new message (authenticated users only)
router.post("/", postMessage);

// Delete message (admin only)
router.delete("/:id", deleteMessageById);

export default router;
