export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  return password.length >= 8;
}

export function validateForm(formData, rules) {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const rule = rules[field];

    if (rule.required && !value) {
      errors[field] = `${field} is required`;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = `${field} is invalid`;
    }
  });
  return errors;
}