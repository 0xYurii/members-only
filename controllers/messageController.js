import { getAllMessages, getMessageById, createMessage, deleteMessage } from "../db/queries.js";

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    
    // Format messages based on user's membership status
    const formattedMessages = messages.map(msg => {
      const formatted = {
        id: msg.id,
        title: msg.title,
        text: msg.text,
        timestamp: msg.timestamp
      };

      // Only show author info to members
      if (req.isAuthenticated() && req.user.is_member) {
        formatted.author = `${msg.first_name} ${msg.last_name}`;
        formatted.username = msg.username;
      } else {
        formatted.author = 'Anonymous';
      }

      return formatted;
    });

    res.json({ success: true, messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Error fetching messages" });
  }
};

// Get single message
export const getMessage = async (req, res) => {
  try {
    const message = await getMessageById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, message });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ success: false, message: "Error fetching message" });
  }
};

// Create new message
export const postMessage = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { title, text } = req.body;
    
    if (!title || !text) {
      return res.status(400).json({ success: false, message: "Title and text are required" });
    }

    const message = await createMessage(title, text, req.user.id);
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ success: false, message: "Error creating message" });
  }
};

// Delete message (admin only)
export const deleteMessageById = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    if (!req.user.is_admin) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    await deleteMessage(req.params.id);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Error deleting message" });
  }
};
