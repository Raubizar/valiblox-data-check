import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if the File System Access API is supported in the current browser
 */
export function supportsFileSystemAccessAPI(): boolean {
  return 'showDirectoryPicker' in window &&
         'showOpenFilePicker' in window &&
         'showSaveFilePicker' in window
}

/**
 * Check if the browser is a modern browser that supports the features we need
 */
export function isModernBrowser(): boolean {  // Check for key modern browser features
  const hasPromises = typeof Promise !== 'undefined'
  const hasAsync = typeof async function() {} === 'function'
  const hasMap = typeof Map !== 'undefined'
  const hasSet = typeof Set !== 'undefined'
  const hasArrayMethods = Array.prototype.includes !== undefined && 
                          Array.prototype.find !== undefined && 
                          Array.prototype.flatMap !== undefined
  
  return hasPromises && hasAsync && hasMap && hasSet && hasArrayMethods
}

/**
 * Get browser information for compatibility warnings
 */
export function getBrowserInfo(): { name: string, version: string } {
  const userAgent = navigator.userAgent
  let browserName = "Unknown"
  let browserVersion = "Unknown"

  try {
    // Chrome
    if (/Chrome/.test(userAgent) && !/Chromium|Edge|Edg|OPR|Opera/.test(userAgent)) {
      browserName = "Chrome"
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/)
      browserVersion = match ? match[1] : "Unknown"
    } 
    // Firefox
    else if (/Firefox/.test(userAgent)) {
      browserName = "Firefox"
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/)
      browserVersion = match ? match[1] : "Unknown"
    } 
    // Safari
    else if (/Safari/.test(userAgent) && !/Chrome|Chromium|Edge|Edg|OPR|Opera/.test(userAgent)) {
      browserName = "Safari"
      const match = userAgent.match(/Version\/(\d+\.\d+)/)
      browserVersion = match ? match[1] : "Unknown"
    } 
    // Edge
    else if (/Edg|Edge/.test(userAgent)) {
      browserName = "Edge"
      const match = userAgent.match(/Edg(?:e)?\/(\d+\.\d+)/)
      browserVersion = match ? match[1] : "Unknown"
    } 
    // Opera
    else if (/OPR|Opera/.test(userAgent)) {
      browserName = "Opera"
      const match = userAgent.match(/OPR\/(\d+\.\d+)/)
      browserVersion = match ? match[1] : "Unknown"
    }
  } catch (error) {
    console.warn('Error detecting browser info:', error)
  }

  return { name: browserName, version: browserVersion }
}
