const moment = require("moment");
const { LeadHistory } = require("../models");

exports.getToday = () => {
  return moment().format("YYYY-MM-DD");
};



exports.addLeadHistory = async ({
  lead_id,
  action,
  old_value,
  new_value,
  done_by
}) => {
  await LeadHistory.create({
    lead_id,
    action,
    old_value,
    new_value,
    done_by
  });
};