import prisma from './prisma'

/**
 * Create a new version for a job
 * @param {string} jobId - Job ID
 * @param {string} outputUrl - Output image URL
 * @param {object} parameters - Processing parameters
 * @param {string} note - Optional note
 * @returns {Promise<object>} Created version
 */
export async function createJobVersion(jobId, outputUrl, parameters = null, note = null) {
  // Get the latest version number
  const latestVersion = await prisma.jobVersion.findFirst({
    where: { jobId },
    orderBy: { version: 'desc' }
  })

  const newVersionNumber = latestVersion ? latestVersion.version + 1 : 1

  const version = await prisma.jobVersion.create({
    data: {
      jobId,
      version: newVersionNumber,
      outputUrl,
      parameters: parameters ? JSON.stringify(parameters) : null,
      note
    }
  })

  return version
}

/**
 * Get all versions for a job
 * @param {string} jobId - Job ID
 * @returns {Promise<array>} List of versions
 */
export async function getJobVersions(jobId) {
  const versions = await prisma.jobVersion.findMany({
    where: { jobId },
    orderBy: { version: 'desc' }
  })

  return versions.map(v => ({
    ...v,
    parameters: v.parameters ? JSON.parse(v.parameters) : null
  }))
}

/**
 * Get a specific version
 * @param {string} jobId - Job ID
 * @param {number} version - Version number
 * @returns {Promise<object>} Version details
 */
export async function getJobVersion(jobId, version) {
  const versionData = await prisma.jobVersion.findUnique({
    where: {
      jobId_version: {
        jobId,
        version
      }
    }
  })

  if (!versionData) {
    throw new Error('Version not found')
  }

  return {
    ...versionData,
    parameters: versionData.parameters ? JSON.parse(versionData.parameters) : null
  }
}

/**
 * Restore a specific version (make it the current output)
 * @param {string} jobId - Job ID
 * @param {number} version - Version number to restore
 * @returns {Promise<object>} Updated job
 */
export async function restoreJobVersion(jobId, version) {
  // Get the version to restore
  const versionData = await getJobVersion(jobId, version)

  // Update the job's output URL
  const updatedJob = await prisma.aIJob.update({
    where: { id: jobId },
    data: {
      outputUrl: versionData.outputUrl
    }
  })

  // Create a new version entry for this restoration
  await createJobVersion(
    jobId,
    versionData.outputUrl,
    versionData.parameters ? JSON.parse(versionData.parameters) : null,
    `Restored from version ${version}`
  )

  return updatedJob
}

/**
 * Add note to a version
 * @param {string} jobId - Job ID
 * @param {number} version - Version number
 * @param {string} note - Note text
 * @returns {Promise<object>} Updated version
 */
export async function addVersionNote(jobId, version, note) {
  const updatedVersion = await prisma.jobVersion.update({
    where: {
      jobId_version: {
        jobId,
        version
      }
    },
    data: { note }
  })

  return updatedVersion
}

/**
 * Delete a specific version
 * @param {string} jobId - Job ID
 * @param {number} version - Version number
 * @returns {Promise<void>}
 */
export async function deleteJobVersion(jobId, version) {
  // Don't allow deleting if it's the only version
  const versionCount = await prisma.jobVersion.count({
    where: { jobId }
  })

  if (versionCount <= 1) {
    throw new Error('Cannot delete the only version')
  }

  await prisma.jobVersion.delete({
    where: {
      jobId_version: {
        jobId,
        version
      }
    }
  })
}

/**
 * Compare two versions
 * @param {string} jobId - Job ID
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @returns {Promise<object>} Comparison data
 */
export async function compareVersions(jobId, version1, version2) {
  const [v1, v2] = await Promise.all([
    getJobVersion(jobId, version1),
    getJobVersion(jobId, version2)
  ])

  return {
    version1: {
      number: v1.version,
      outputUrl: v1.outputUrl,
      parameters: v1.parameters,
      note: v1.note,
      createdAt: v1.createdAt
    },
    version2: {
      number: v2.version,
      outputUrl: v2.outputUrl,
      parameters: v2.parameters,
      note: v2.note,
      createdAt: v2.createdAt
    },
    timeDifference: Math.abs(new Date(v2.createdAt) - new Date(v1.createdAt)),
    parametersDiff: JSON.stringify(v1.parameters) !== JSON.stringify(v2.parameters)
  }
}

/**
 * Get version statistics for a job
 * @param {string} jobId - Job ID
 * @returns {Promise<object>} Statistics
 */
export async function getVersionStats(jobId) {
  const versions = await prisma.jobVersion.findMany({
    where: { jobId },
    orderBy: { version: 'asc' }
  })

  if (versions.length === 0) {
    return {
      totalVersions: 0,
      firstVersion: null,
      latestVersion: null,
      totalDuration: 0
    }
  }

  const firstVersion = versions[0]
  const latestVersion = versions[versions.length - 1]
  const totalDuration = new Date(latestVersion.createdAt) - new Date(firstVersion.createdAt)

  return {
    totalVersions: versions.length,
    firstVersion: {
      number: firstVersion.version,
      createdAt: firstVersion.createdAt
    },
    latestVersion: {
      number: latestVersion.version,
      createdAt: latestVersion.createdAt
    },
    totalDuration,
    averageTimeBetweenVersions: versions.length > 1 ? totalDuration / (versions.length - 1) : 0
  }
}
