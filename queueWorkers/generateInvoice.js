const PDFDocument = require("pdfkit");

const LOGO_SRC = "logo.png";

const generateInvoice = (invoiceData) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoiceData);
  generateInvoiceTable(doc, invoiceData);
  generateFooter(doc);

  doc.end();

  return doc;
};

const generateHeader = (doc) => {
  doc
    .image(LOGO_SRC, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("T2Y Inc.", 110, 57)
    .fontSize(10)
    .text("T2Y Inc.", 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("NSW, AUSTRALIA, 10025", 200, 80, { align: "right" })
    .moveDown();
};

const generateCustomerInformation = (doc, invoice) => {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    // .text("Balance Due:", 50, customerInformationTop + 30)
    // .text(formatCurrency(invoice.amount), 150, customerInformationTop + 30)
    .text("Start Date: ", 50, customerInformationTop+ 30)
    .text(invoice.startDate, 150, customerInformationTop + 30)
    .text("End Date: ", 50, customerInformationTop + 45)
    .text(invoice.endDate, 150, customerInformationTop + 45)

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 400, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 400, customerInformationTop + 15)
    // .text(
    //   invoice.shipping.city +
    //     ", " +
    //     invoice.shipping.state,
    //   400,
    //   customerInformationTop + 30
    // )
    // .text(invoice.shipping.country + ", " + invoice.shipping.postal_code, 400, customerInformationTop + 45)
    .moveDown();

  generateHr(doc, 262);
};

const generateInvoiceTable = (doc, invoice) => {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Item Type",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.type,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.amount)
  );

  doc.font("Helvetica");
};

const generateFooter = (doc) => {
  doc
    .fontSize(10)
    .text(
      "Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
};

const generateHr = (doc, y) => {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

const formatCurrency = (amount) => {
  return `$${amount}`;
};

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "-" + month + "-" + day;
};

const generateTableRow = (
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) => {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 240, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
};

module.exports = generateInvoice;