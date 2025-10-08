import { processImageWithGemini } from './gemini'
import { uploadToCloudinary } from './cloudinary'
import {prisma} from './prisma'
import { deductCredits } from './credits'

/**
 * Execute a workflow with multiple AI operations in sequence
 * @param {string} inputUrl - Initial input image URL
 * @param {object} workflow - Workflow configuration
 * @param {string} userId - User ID
 * @returns {Promise<object>} Final result with output URL
 */
export async function executeWorkflow(inputUrl, workflow, userId) {
  // Handle steps - can be string or already parsed object
  const steps = typeof workflow.steps === 'string'
    ? JSON.parse(workflow.steps)
    : (workflow.steps || [])
  let currentImage = inputUrl
  let totalCreditsUsed = 0

  // Create workflow execution record
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: workflow.id,
      userId,
      status: 'processing',
      inputUrl,
      totalCredits: workflow.totalCredits,
    }
  })

  try {
    // Execute each step sequentially
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]

      // Update current step
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: { currentStep: i }
      })

      // Process image with Gemini
      const result = await processImageWithGemini(
        currentImage,
        step.operation,
        step.parameters || {}
      )

      // Deduct credits for this step
      await deductCredits(
        userId,
        step.creditsCost,
        `Workflow step ${i + 1}: ${step.operation}`,
        { workflowId: workflow.id, executionId: execution.id, step: i + 1 }
      )
      totalCreditsUsed += step.creditsCost

      // If Gemini returns an image, save it
      if (result.image) {
        const imageBase64 = `data:image/png;base64,${result.image}`
        currentImage = await uploadToCloudinary(imageBase64, 'remixly/workflow')
      }

      // If this is the last step, it's our final output
      if (i === steps.length - 1) {
        await prisma.workflowExecution.update({
          where: { id: execution.id },
          data: {
            status: 'completed',
            outputUrl: currentImage,
            currentStep: steps.length
          }
        })
      }
    }

    // Update workflow usage count
    await prisma.workflow.update({
      where: { id: workflow.id },
      data: { usageCount: { increment: 1 } }
    })

    return {
      success: true,
      executionId: execution.id,
      outputUrl: currentImage,
      creditsUsed: totalCreditsUsed,
      stepsCompleted: steps.length
    }

  } catch (error) {
    // Mark execution as failed
    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: 'failed',
        error: error.message
      }
    })

    throw error
  }
}

/**
 * Validate workflow steps before execution
 * @param {array} steps - Array of workflow steps
 * @returns {object} Validation result
 */
export function validateWorkflow(steps) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return { valid: false, error: 'Workflow must have at least one step' }
  }

  if (steps.length > 10) {
    return { valid: false, error: 'Workflow cannot exceed 10 steps' }
  }

  const validOperations = [
    'outfit_changer',
    'pose_generator',
    'expression_editor',
    'angle_shift',
    'photo_restoration',
    'headshot_generator',
    'photobooth',
    'product_studio',
    'background_remover',
    'image_enhancer'
  ]

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]

    if (!step.operation) {
      return { valid: false, error: `Step ${i + 1}: Missing operation` }
    }

    if (!validOperations.includes(step.operation)) {
      return { valid: false, error: `Step ${i + 1}: Invalid operation "${step.operation}"` }
    }

    if (!step.creditsCost || step.creditsCost < 1) {
      return { valid: false, error: `Step ${i + 1}: Invalid credit cost` }
    }
  }

  return { valid: true }
}

/**
 * Calculate total credit cost for a workflow
 * @param {array} steps - Array of workflow steps
 * @returns {number} Total credits
 */
export function calculateWorkflowCredits(steps) {
  return steps.reduce((total, step) => total + (step.creditsCost || 0), 0)
}

/**
 * Get workflow execution status with progress
 * @param {string} executionId - Execution ID
 * @returns {Promise<object>} Execution status
 */
export async function getWorkflowStatus(executionId) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: true,
      user: { select: { name: true, email: true } }
    }
  })

  if (!execution) {
    throw new Error('Workflow execution not found')
  }

  // Handle steps - can be string or already parsed object
  const steps = typeof execution.workflow.steps === 'string'
    ? JSON.parse(execution.workflow.steps)
    : (execution.workflow.steps || [])
  const progress = Math.round((execution.currentStep / steps.length) * 100)

  return {
    id: execution.id,
    status: execution.status,
    currentStep: execution.currentStep,
    totalSteps: steps.length,
    progress,
    inputUrl: execution.inputUrl,
    outputUrl: execution.outputUrl,
    error: execution.error,
    createdAt: execution.createdAt,
    updatedAt: execution.updatedAt
  }
}

/**
 * Preset workflow templates
 */
export const workflowTemplates = {
  professional_headshot: {
    name: 'Professional Headshot',
    description: 'Transform any photo into a LinkedIn-ready professional headshot',
    steps: [
      {
        operation: 'background_remover',
        parameters: { newBackground: 'professional gray gradient' },
        creditsCost: 5
      },
      {
        operation: 'expression_editor',
        parameters: { expression: 'confident professional smile' },
        creditsCost: 10
      },
      {
        operation: 'headshot_generator',
        parameters: {},
        creditsCost: 10
      },
      {
        operation: 'image_enhancer',
        parameters: {},
        creditsCost: 5
      }
    ]
  },

  product_photo: {
    name: 'Product Photo Studio',
    description: 'Transform casual product photos into professional catalog images',
    steps: [
      {
        operation: 'background_remover',
        parameters: { newBackground: 'clean white background' },
        creditsCost: 5
      },
      {
        operation: 'product_studio',
        parameters: { setting: 'optimal studio lighting' },
        creditsCost: 10
      },
      {
        operation: 'image_enhancer',
        parameters: {},
        creditsCost: 5
      }
    ]
  },

  vintage_restoration: {
    name: 'Vintage Photo Restoration',
    description: 'Restore and enhance old or damaged photographs',
    steps: [
      {
        operation: 'photo_restoration',
        parameters: {},
        creditsCost: 15
      },
      {
        operation: 'image_enhancer',
        parameters: {},
        creditsCost: 5
      }
    ]
  },

  social_media_ready: {
    name: 'Social Media Ready',
    description: 'Optimize photos for Instagram and social platforms',
    steps: [
      {
        operation: 'image_enhancer',
        parameters: {},
        creditsCost: 5
      },
      {
        operation: 'photobooth',
        parameters: { style: 'vibrant modern aesthetic' },
        creditsCost: 10
      }
    ]
  },

  complete_makeover: {
    name: 'Complete Photo Makeover',
    description: 'Comprehensive transformation with outfit, pose, and enhancement',
    steps: [
      {
        operation: 'background_remover',
        parameters: { newBackground: 'elegant studio backdrop' },
        creditsCost: 5
      },
      {
        operation: 'outfit_changer',
        parameters: { outfit: 'elegant professional attire' },
        creditsCost: 15
      },
      {
        operation: 'expression_editor',
        parameters: { expression: 'natural confident smile' },
        creditsCost: 10
      },
      {
        operation: 'image_enhancer',
        parameters: {},
        creditsCost: 5
      }
    ]
  }
}

/**
 * Create workflow from template
 * @param {string} templateName - Template name
 * @param {string} userId - User ID
 * @returns {Promise<object>} Created workflow
 */
export async function createWorkflowFromTemplate(templateName, userId) {
  const template = workflowTemplates[templateName]

  if (!template) {
    throw new Error('Template not found')
  }

  const totalCredits = calculateWorkflowCredits(template.steps)

  const workflow = await prisma.workflow.create({
    data: {
      userId,
      name: template.name,
      description: template.description,
      steps: JSON.stringify(template.steps),
      totalCredits,
      isTemplate: true
    }
  })

  return workflow
}
