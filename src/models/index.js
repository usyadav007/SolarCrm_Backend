const sequelize = require("../config/db");

const Lead = require("./leadModel")(sequelize);
const Staff = require("./staffModel")(sequelize);
const LeadHistory = require("./leadHistoryModel")(sequelize);
const FollowUp = require("./followupModel")(sequelize, require("sequelize").DataTypes);
const Survey = require("./surveyModel")(sequelize, require("sequelize").DataTypes);
const Quotation = require("./quotationModel")(sequelize, require("sequelize").DataTypes);
const Installation = require("./installationModel")(sequelize, require("sequelize").DataTypes);
const Service = require("./serviceModel")(sequelize, require("sequelize").DataTypes);
const Invoice = require("./invoiceModel")(sequelize, require("sequelize").DataTypes);
const Payment = require("./paymentModel")(sequelize, require("sequelize").DataTypes);
const Attendance = require("./attendanceModel")(sequelize, require("sequelize").DataTypes);
const Salary = require("./salaryModel")(sequelize, require("sequelize").DataTypes);
const Document = require("./documentModel")(sequelize, require("sequelize").DataTypes);
const Product = require("./productModel")(sequelize, require("sequelize").DataTypes);
const Inventory = require("./inventoryModel")(sequelize, require("sequelize").DataTypes);
const Otp = require("./otpModel")(sequelize, require("sequelize").DataTypes);
const Customer = require("./customerModel")(sequelize, require("sequelize").DataTypes);

// ✅ RELATIONS

// Lead → History
Lead.hasMany(LeadHistory, {
  foreignKey: "lead_id"
});

LeadHistory.belongsTo(Lead, {
  foreignKey: "lead_id"
});

// Staff → History (kisne action kiya)
Staff.hasMany(LeadHistory, { foreignKey: "done_by" });

LeadHistory.belongsTo(Staff, { foreignKey: "done_by" });

// Optional (VERY USEFUL)
Lead.belongsTo(Staff, { foreignKey: "assigned_to", as: "assignedUser" });

// RELATIONS
Lead.hasMany(FollowUp, { foreignKey: "lead_id" });
FollowUp.belongsTo(Lead, { foreignKey: "lead_id" });

Staff.hasMany(FollowUp, { foreignKey: "user_id" });
FollowUp.belongsTo(Staff, { foreignKey: "user_id" });

// Relations
Lead.hasMany(Survey, { foreignKey: "lead_id" });
Survey.belongsTo(Lead, { foreignKey: "lead_id" });

Staff.hasMany(Survey, { foreignKey: "engineer_id" });
Survey.belongsTo(Staff, { foreignKey: "engineer_id" });

// Relations
Lead.hasMany(Quotation, { foreignKey: "lead_id" });
Quotation.belongsTo(Lead, { foreignKey: "lead_id" });

Survey.hasMany(Quotation, { foreignKey: "survey_id" });
Quotation.belongsTo(Survey, { foreignKey: "survey_id" });

// Relations
Lead.hasMany(Installation, { foreignKey: "lead_id" });
Installation.belongsTo(Lead, { foreignKey: "lead_id" });

Quotation.hasMany(Installation, { foreignKey: "quotation_id" });
Installation.belongsTo(Quotation, { foreignKey: "quotation_id" });

Staff.hasMany(Installation, { foreignKey: "technician_id" });
Installation.belongsTo(Staff, { foreignKey: "technician_id" });

// Relations
Lead.hasMany(Service, { foreignKey: "lead_id" });
Service.belongsTo(Lead, { foreignKey: "lead_id" });

Installation.hasMany(Service, { foreignKey: "installation_id" });
Service.belongsTo(Installation, { foreignKey: "installation_id" });

Staff.hasMany(Service, { foreignKey: "technician_id" });
Service.belongsTo(Staff, { foreignKey: "technician_id" });

// Relations
Lead.hasMany(Invoice, { foreignKey: "lead_id" });
Invoice.belongsTo(Lead, { foreignKey: "lead_id" });

Installation.hasMany(Invoice, { foreignKey: "installation_id" });
Invoice.belongsTo(Installation, { foreignKey: "installation_id" });

Invoice.hasMany(Payment, { foreignKey: "invoice_id" });
Payment.belongsTo(Invoice, { foreignKey: "invoice_id" });

// Relation
Staff.hasMany(Attendance, { foreignKey: "staff_id" });
Attendance.belongsTo(Staff, { foreignKey: "staff_id" });

Staff.hasMany(Salary, { foreignKey: "staff_id" });
Salary.belongsTo(Staff, { foreignKey: "staff_id" });

// Relations
Lead.hasMany(Document, { foreignKey: "lead_id" });
Document.belongsTo(Lead, { foreignKey: "lead_id" });

Installation.hasMany(Document, { foreignKey: "installation_id" });
Document.belongsTo(Installation, { foreignKey: "installation_id" });

Product.hasMany(Inventory, { foreignKey: "product_id" });
Inventory.belongsTo(Product, { foreignKey: "product_id" });

Customer.hasMany(Lead, { foreignKey: "customer_id" });
Lead.belongsTo(Customer, { foreignKey: "customer_id" });

Invoice.belongsTo(Lead, { foreignKey: "lead_id" });
Lead.hasMany(Invoice, { foreignKey: "lead_id" });

// Invoice → Lead
Invoice.belongsTo(Lead, { foreignKey: "lead_id" });
Lead.hasMany(Invoice, { foreignKey: "lead_id" });

// Lead → Customer
Lead.belongsTo(Customer, { foreignKey: "customer_id" });
Customer.hasMany(Lead, { foreignKey: "customer_id" });



const db = {};
db.sequelize = sequelize;

db.Lead = Lead;
db.Staff = Staff;
db.LeadHistory = LeadHistory;
db.FollowUp = FollowUp;
db.Survey = Survey;
db.Quotation = Quotation;
db.Installation = Installation;
db.Service = Service;
db.Invoice = Invoice;
db.Payment = Payment;
db.Attendance = Attendance;
db.Salary = Salary;
db.Document = Document;
db.Product = Product;
db.Inventory = Inventory;
db.Otp = Otp;
db.Customer = Customer;


module.exports = db;