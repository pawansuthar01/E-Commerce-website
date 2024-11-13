import Notification from "../module/Notification.module.js";
import { io } from "../server.js";

export const CreateNotification = async (userId, message, type) => {
  try {
    if (!userId || !message || !type) {
      console.log("cerate notification to All filed is required..", 400);
    }
    let notificationId;
    if (type === "comment" || type === "like") {
      const AdminId = "??";
      notificationId = AdminId;
    } else {
      notificationId = userId;
    }

    const CreateNotification = new Notification({
      userId,
      message,
      type,
    });
    if (!CreateNotification) {
      console.log("cerate notification is fail ..", 400);
    }
    await CreateNotification.save();

    if (type === "comment" || type === "like") {
      io.to(notificationId).emit("new Notification", message);
      console.log("Notification created and sent to only Admin:", message);
    } else {
      io.emit("new Notification", message);
      console.log("Notification created and sent to all users:", message);
    }
  } catch (e) {
    console.log("Error creating notification:", e.message);
  }
};
