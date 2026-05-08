const { Staff, Lead } = require("../models");

let lastAssignedIndex = 0;

exports.autoAssignLead = async (leadId) => {
  const telecallers = await Staff.findAll({
    where: { role: "telecaller" }
  });

  if (telecallers.length === 0) return null;

  const user = telecallers[lastAssignedIndex % telecallers.length];

  lastAssignedIndex++;

  await Lead.update(
    { assigned_to: user.id },
    { where: { id: leadId } }
  );

  return user.id;
};