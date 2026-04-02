import { useEffect, useState } from "react";
import { usePDF } from "react-to-pdf";
import QRCode from "qrcode";
import Button from "./Button";
import { Printer, Download, X } from "lucide-react";

const PrintableBill = ({ bill, onClose }) => {
  const [qrDataURL, setQrDataURL] = useState("");

  // react-to-pdf hook with targetRef
  const { toPDF, targetRef } = usePDF({
    filename: `NCB_BILL_${bill.billNumber}.pdf`,
  });

  // Generate QR code when bill changes
  useEffect(() => {
    const generateQR = async () => {
      if (!bill) {
        setQrDataURL("");
        return;
      }
      try {
        const qrData = {
          billNumber: bill.billNumber,
          totalAmount: bill.totalAmount,
          date: bill.paidAt,
          phone: bill.customerDetails?.phone || "",
        };
        const dataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
        setQrDataURL(dataUrl);
      } catch (err) {
        console.error("QR generation error", err);
        setQrDataURL("");
      }
    };
    generateQR();
  }, [bill]);

  if (!bill) return null;

  // Download PDF
  const downloadPDF = async () => {
    try {
      await toPDF();
    } catch (err) {
      console.error("PDF download error", err);
      alert("PDF generation failed");
    }
  };

  // Print receipt - opens new window for better thermal printing
  const printReceipt = () => {
    const printWindow = window.open("", "PRINT", "height=600,width=350");
    if (!printWindow) {
      alert("Please allow popups to print.");
      return;
    }

    const receiptHtml = renderReceiptHTML(bill, qrDataURL);
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Helper: produce HTML string for printing window
  const renderReceiptHTML = (billData, qrUrl = "") => {
    return `
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt ${billData.billNumber}</title>
  <style>
    body { 
      font-family: "Courier New", monospace; 
      font-size:12px; 
      width:300px; 
      margin:0; 
      padding:10px; 
      color:#000;
    }
    .center { text-align:center; }
    .line { border-top:1px dashed #000; margin:8px 0; }
    table { width:100%; border-collapse: collapse; font-size:12px; }
    td { padding:2px 0; vertical-align:top; }
    .right { text-align:right; }
    .bold { font-weight:700; }
    .items td { padding:4px 0; }
    .qr { text-align:center; margin-top:8px; }
  </style>
</head>
<body>
  <div class="center">
    <div>🍽️ NCB RESTAURANT</div>
  </div>
  <div class="line"></div>
  
  <div><strong>Bill No:</strong> ${billData.billNumber}</div>
  <div><strong>Date:</strong> ${new Date(billData.paidAt).toLocaleString()}</div>
  <div><strong>Order Type:</strong> ${billData.orderType}</div>
  <div><strong>Payment:</strong> ${billData.paymentMethod}</div>
  
  <div class="line"></div>
  
  <div><strong>Customer:</strong> ${billData.customerDetails?.name || "-"}</div>
  <div><strong>Phone:</strong> ${billData.customerDetails?.phone || "-"}</div>
  
  <div class="line"></div>
  
  <table class="items">
    <thead>
      <tr>
        <td class="bold">#</td>
        <td class="bold">Item</td>
        <td class="bold right">Qty</td>
        <td class="bold right">Amt</td>
      </tr>
    </thead>
    <tbody>
      ${billData.items.map((it, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${escapeHtml(it.foodName)}</td>
          <td class="right">${it.quantity}</td>
          <td class="right">₹${Number(it.subtotal).toFixed(0)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
  
  <div class="line"></div>
  
  <table style="width:100%; font-size:12px;">
    <tr>
      <td>Subtotal</td>
      <td class="right">₹${Number(billData.subtotal).toFixed(0)}</td>
    </tr>
    <tr>
      <td>Discount</td>
      <td class="right">₹${Number(billData.discount || 0).toFixed(0)}</td>
    </tr>
    <tr>
      <td class="bold">Total</td>
      <td class="bold right">₹${Number(billData.totalAmount).toFixed(0)}</td>
    </tr>
  </table>
  
  <div class="line"></div>
  
  ${qrUrl ? `<div class="qr"><img src="${qrUrl}" width="120"/></div>` : ""}
  
  <div class="center" style="margin-top:8px;">
    Thank you for visiting! 😊
  </div>
</body>
</html>
    `;
  };

  // Escape HTML
  const escapeHtml = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh] max-w-md">
        {/* Header with action buttons */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Bill Preview</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              icon={<Download className="w-4 h-4" />}
              onClick={downloadPDF}
            >
              PDF
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={<Printer className="w-4 h-4" />}
              onClick={printReceipt}
            >
              Print
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt preview - captured by react-to-pdf */}
        <div className="p-4 bg-gray-100">
          <div
            ref={targetRef}
            style={{
              width: 300,
              padding: 12,
              fontFamily: '"Courier New", monospace',
              color: "#000",
              background: "#fff",
              lineHeight: 1.2,
              margin: "0 auto",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                🍽️ NCB RESTAURANT
              </div>
            </div>
            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

            {/* Bill Info */}
            <div style={{ fontSize: 11, marginBottom: 4 }}>
              <div>
                <strong>Bill No:</strong> {bill.billNumber}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(bill.paidAt).toLocaleString()}
              </div>
              <div>
                <strong>Order Type:</strong> {bill.orderType}
              </div>
              <div>
                <strong>Payment:</strong> {bill.paymentMethod}
              </div>
            </div>
            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

            {/* Customer Info */}
            <div style={{ fontSize: 11, marginBottom: 4 }}>
              <div>
                <strong>Customer:</strong> {bill.customerDetails?.name || "-"}
              </div>
              <div>
                <strong>Phone:</strong> {bill.customerDetails?.phone || "-"}
              </div>
            </div>
            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

            {/* Items header */}
            <div style={{ display: "flex", fontSize: 11, fontWeight: 700 }}>
              <div style={{ width: 20 }}>#</div>
              <div style={{ flex: 1 }}>Item</div>
              <div style={{ width: 32, textAlign: "right" }}>Qty</div>
              <div style={{ width: 56, textAlign: "right" }}>Amt</div>
            </div>
            <div style={{ height: 6 }} />

            {/* Items list */}
            {bill.items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  fontSize: 11,
                  marginBottom: 3,
                }}
              >
                <div style={{ width: 20 }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>{it.foodName}</div>
                <div style={{ width: 32, textAlign: "right" }}>
                  {it.quantity}
                </div>
                <div style={{ width: 56, textAlign: "right" }}>
                  ₹{Number(it.subtotal).toFixed(0)}
                </div>
              </div>
            ))}

            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

            {/* Totals */}
            <div style={{ fontSize: 11 }}>
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>Subtotal</div>
                <div>₹{Number(bill.subtotal).toFixed(0)}</div>
              </div>
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>Discount</div>
                <div>₹{Number(bill.discount || 0).toFixed(0)}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                  fontWeight: 700,
                }}
              >
                <div>Total</div>
                <div>₹{Number(bill.totalAmount).toFixed(0)}</div>
              </div>
            </div>

            <div style={{ borderTop: "1px dashed #000", margin: "8px 0" }} />

            {/* QR Code */}
            {qrDataURL && (
              <div style={{ textAlign: "center", marginTop: 6 }}>
                <img src={qrDataURL} alt="qr" width={120} />
                <div style={{ fontSize: 10, marginTop: 4 }}>Scan to view</div>
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                marginTop: 8,
                textAlign: "center",
                fontSize: 11,
              }}
            >
              Thank you for visiting! 😊
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableBill;
