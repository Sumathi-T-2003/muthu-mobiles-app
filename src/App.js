import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function App() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('Mobile Service');

  const downloadBill = (paymentId) => {
    const doc = new jsPDF();
    
    // Header Branding
    doc.setFontSize(26);
    doc.setTextColor(26, 115, 232);
    doc.text("MUTHU MOBILES", 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Professional Sales & Service Center", 105, 28, { align: 'center' });
    doc.text("No: 123, Main Road, Madurai | Cell: +91 98765 43210", 105, 34, { align: 'center' });
    
    doc.setDrawColor(26, 115, 232);
    doc.line(15, 40, 195, 40);

    // Bill Details
    doc.autoTable({
      startY: 50,
      head: [['DESCRIPTION', 'DETAILS']],
      body: [
        ['Customer Name', name.toUpperCase()],
        ['Category', category],
        ['Payment ID', paymentId],
        ['Amount Paid', `Rs. ${amount}.00`],
        ['Payment Status', 'SUCCESSFUL']
      ],
      theme: 'grid',
      headStyles: { fillColor: [26, 115, 232], fontSize: 12 },
      styles: { cellPadding: 5, fontSize: 11 }
    });

    let finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.text("Authorized Signature", 160, finalY + 30);
    doc.text("Terms: No refund on spare parts after installation.", 15, finalY + 40);
    doc.text("Thank You! Visit Again.", 105, finalY + 50, { align: 'center' });

    doc.save(`Muthu_Mobiles_Bill_${name}.pdf`);
  };

  const handlePayment = () => {
    if(!name || !amount) return alert("Customer Name and Amount are required!");

    const options = {
      key: "rzp_live_Rz4I3MbWqEHFIs", // Your Live Key
      amount: amount * 100,
      currency: "INR",
      name: "Muthu Mobiles",
      description: `${category} Bill`,
      handler: async (response) => {
        try {
          await axios.post('http://localhost:5000/api/save-payment', {
            customerName: name, category, amount, paymentId: response.razorpay_payment_id
          });
          downloadBill(response.razorpay_payment_id);
          alert("Payment Received & Bill Generated!");
        } catch (e) {
          downloadBill(response.razorpay_payment_id);
        }
      }
    };
    new window.Razorpay(options).open();
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>MUTHU MOBILES</h1>
        <p style={subtitleStyle}>Professional Billing & Payment</p>
        
        <label style={labelStyle}>Customer Name</label>
        <input style={inputStyle} onChange={e => setName(e.target.value)} placeholder="Enter Name" />

        <label style={labelStyle}>Service Category</label>
        <select style={inputStyle} onChange={e => setCategory(e.target.value)}>
          <option>Mobile Service</option>
          <option>Accessories Sales</option>
          <option>Display/Touch Change</option>
          <option>Software/Unlocking</option>
        </select>

        <label style={labelStyle}>Amount (₹)</label>
        <input style={inputStyle} type="number" onChange={e => setAmount(e.target.value)} placeholder="0.00" />

        <button onClick={handlePayment} style={buttonStyle}>PAY & GENERATE BILL</button>
      </div>
    </div>
  );
}

// High-Tech UI Styles
const containerStyle = { backgroundColor: '#f0f4f8', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial' };
const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' };
const titleStyle = { color: '#1a73e8', margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' };
const subtitleStyle = { color: '#666', marginBottom: '30px' };
const labelStyle = { display: 'block', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px', color: '#333' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };

export default App;