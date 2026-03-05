const express = require("express")
const QRCode = require("qrcode")
const { v4: uuidv4 } = require("uuid")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(express.static("public"))

const file = path.join(__dirname, "../data/payments.json")

app.get("/api/generate", async (req, res) => {

const amount = req.query.amount || 1
const txnId = uuidv4()

const upiId = req.query.upiId ?? "deepakkumawat@nyes"
// const upiId = req.query.amount ?? "imranibb@ybl"
// const upiId = "9413512582@mbk"
// const upiId = "deepakkumawat@nyes"

// const upiUrl =
const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('DemoStore')}&am=${encodeURIComponent(amount)}&cu=INR&tr=${encodeURIComponent(txnId)}&tid=${encodeURIComponent(txnId)}&tn=${encodeURIComponent('Payment for Order ' + txnId)}`;
const qr = await QRCode.toDataURL(upiUrl)

let data = []

if(fs.existsSync(file)){
data = JSON.parse(fs.readFileSync(file))
}

data.push({
txnId,
amount,
upiUrl,
date:new Date()
})

fs.writeFileSync(file,JSON.stringify(data,null,2))

res.json({
txnId,
amount,
qr
})

})
const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Server running on port " + PORT)
})

