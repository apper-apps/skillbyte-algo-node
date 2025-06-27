import React from 'react'

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
    primary: "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 dark:from-primary-900 dark:to-secondary-900 dark:text-primary-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700 dark:from-accent-900 dark:to-accent-800 dark:text-accent-300"
  }
  
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge