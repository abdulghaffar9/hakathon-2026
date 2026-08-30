import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { protect } from '../middleware/authMiddleware.js'
import {
  uploadProfilePicture,
  removeProfilePicture,
} from '../controllers/profileController.js'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDirectory = path.join(
  __dirname,
  '../uploads/profiles'
)

// Create the folder automatically if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory)
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()

    cb(
      null,
      `${req.user._id}-${Date.now()}${extension}`,
    )
  },
})

const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        new Error(
          'Only JPG, PNG and WEBP images are allowed'
        )
      )
    }
  },
})

router.patch(
  '/picture',
  protect,
  upload.single('profilePicture'),
  uploadProfilePicture,
)

router.delete(
  '/picture',
  protect,
  removeProfilePicture,
)

export default router