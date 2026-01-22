/**
 * Form Validators - Utility functions for form validation
 */

export const validators = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isValidPassword: (password) => {
    return password && password.length >= 8;
  },

  // Validate name (not empty)
  isValidName: (name) => {
    return name && name.trim().length > 0;
  },

  // Check if passwords match
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },

  // Validate registration form
  validateRegisterForm: (formData) => {
    const errors = {};

    if (!validators.isValidName(formData.firstName)) {
      errors.firstName = "First name is required";
    }

    if (!validators.isValidName(formData.lastName)) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!validators.isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!validators.isValidPassword(formData.password)) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (!validators.passwordsMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = "Passwords do not match";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Validate login form
  validateLoginForm: (email, password) => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!validators.isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
