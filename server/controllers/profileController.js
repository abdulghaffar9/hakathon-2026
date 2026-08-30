import fs from 'fs'
import path from 'path'
import User from '../models/User.js'

export async function uploadProfilePicture(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please select an image',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    // Delete the previous profile picture
    if (user.profilePicture) {
      const oldFile = path.join(
        process.cwd(),
        user.profilePicture.replace(/^\/+/, ''),
      )

      if (fs.existsSync(oldFile)) {
        fs.unlinkSync(oldFile)
      }
    }

    user.profilePicture = `/uploads/profiles/${req.file.filename}`

    await user.save()

    res.json({
      message: 'Profile picture updated successfully',
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export async function removeProfilePicture(req, res, next) {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (user.profilePicture) {
      const oldFile = path.join(
        process.cwd(),
        user.profilePicture.replace(/^\/+/, ''),
      )

      if (fs.existsSync(oldFile)) {
        fs.unlinkSync(oldFile)
      }
    }

    user.profilePicture = ''

    await user.save()

    res.json({
      message: 'Profile picture removed',
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}