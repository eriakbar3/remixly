import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const creditCosts = {
  outfit_changer: parseInt(process.env.CREDIT_COSTS_OUTFIT_CHANGER || '10'),
  pose_generator: parseInt(process.env.CREDIT_COSTS_POSE_GENERATOR || '8'),
  expression_editor: parseInt(process.env.CREDIT_COSTS_EXPRESSION_EDITOR || '8'),
  angle_shift: parseInt(process.env.CREDIT_COSTS_ANGLE_SHIFT || '8'),
  photo_restoration: parseInt(process.env.CREDIT_COSTS_PHOTO_RESTORATION || '12'),
  headshot_generator: parseInt(process.env.CREDIT_COSTS_HEADSHOT_GENERATOR || '10'),
  photobooth: parseInt(process.env.CREDIT_COSTS_PHOTOBOOTH || '8'),
  product_studio: parseInt(process.env.CREDIT_COSTS_PRODUCT_STUDIO || '10'),
  broll_generator: parseInt(process.env.CREDIT_COSTS_BROLL_GENERATOR || '15'),
  background_remover: parseInt(process.env.CREDIT_COSTS_BACKGROUND_REMOVER || '5'),
  image_enhancer: parseInt(process.env.CREDIT_COSTS_IMAGE_ENHANCER || '10'),
  image_generator: parseInt(process.env.CREDIT_COSTS_IMAGE_GENERATOR || '15'),
  custom_edit: parseInt(process.env.CREDIT_COSTS_CUSTOM_EDIT || '12'),
}

export const jobTypeNames = {
  outfit_changer: 'AI Outfit Changer',
  pose_generator: 'Pose Generator',
  expression_editor: 'Expression Editor',
  angle_shift: 'Angle & Perspective Shift',
  photo_restoration: 'Photo Restoration',
  headshot_generator: 'Headshot Generator',
  photobooth: 'Photobooth AI',
  product_studio: 'Product Photo Studio',
  broll_generator: 'B-Roll Generator',
  background_remover: 'Background Remover',
  image_enhancer: 'AI Image Enhancer',
  image_generator: 'AI Image Generator',
  custom_edit: 'Custom Edit',
}
