const ExcelJS = require("exceljs");

exports.generateExcel = async (columns, rows, res, fileName) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  // Columns
  sheet.columns = columns;

  // Rows
  rows.forEach((row) => {
    sheet.addRow(row);
  });

  // Styling header
  sheet.getRow(1).font = { bold: true };

  // Response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${fileName}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
};