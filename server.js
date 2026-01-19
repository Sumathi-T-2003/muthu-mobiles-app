const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

console.log("🚀 MUTHU MOBILES - Professional Server Starting...");

// API to Receive & Record Payments
app.post('/api/save-payment', (req, res) => {
    const { customerName, category, amount, paymentId } = req.body;
    
    console.log("-------------------------------------------");
    console.log("💰 NEW DIGITAL BILL GENERATED");
    console.log(`👤 Customer: ${customerName}`);
    console.log(`🛠️ Service : ${category}`);
    console.log(`💵 Amount  : Rs. ${amount}`);
    console.log(`🆔 Pay ID  : ${paymentId}`);
    console.log("-------------------------------------------");

    res.json({ status: "success", message: "Bill Recorded Successfully!" });
});

app.listen(5000, () => console.log("✅ Server Ready on Port 5000"));