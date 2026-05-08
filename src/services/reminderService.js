const cron = require("node-cron");
const { FollowUp, Staff } = require("../models");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/emailService");

exports.startReminderJob = () => {
  console.log("⏰ Reminder Job Started...");

  // Run every day at 9 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("🔔 Running Follow-up Reminder Job...");

    const today = new Date().toISOString().split("T")[0];

    try {
      // Today's followups
      const todayData = await FollowUp.findAll({
        where: {
          next_followup: {
            [Op.between]: [
              new Date(today + " 00:00:00"),
              new Date(today + " 23:59:59")
            ]
          }
        }
      });

      // Overdue followups
      const overdueData = await FollowUp.findAll({
        where: {
          next_followup: {
            [Op.lt]: new Date()
          }
        }
      });

      console.log(`📅 Today Followups: ${todayData.length}`);
      console.log(`⚠️ Overdue Followups: ${overdueData.length}`);
      //await sendEmail(user.email, "Follow-up Reminder", "You have 3 followups today");

      for (let item of todayData) {
        const user = await Staff.findByPk(item.user_id);
      
        if (user?.email) {
          await sendEmail(
            user.email,
            "Today's Follow-up Reminder",
            `You have a follow-up scheduled today. Notes: ${item.notes}`
          );
        }
      }

      // 👉 Yaha future me email / whatsapp laga sakte ho

    } catch (err) {
      console.error("Reminder Error:", err);
    }
  });
};