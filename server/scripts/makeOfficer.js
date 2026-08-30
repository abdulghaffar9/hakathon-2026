// Usage: node scripts/makeOfficer.js someone@example.com
import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

const email = process.argv[2]
if (!email) {
  console.error('Usage: node scripts/makeOfficer.js <email>')
  process.exit(1)
}
await mongoose.connect(process.env.MONGO_URI)
const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { role: 'officer' }, { new: true })
console.log(user ? `${user.email} is now an officer.` : `No user found with email ${email}`)
await mongoose.disconnect()
