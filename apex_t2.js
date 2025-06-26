class ContactFormValidator {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.initializeEventListeners();
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            phone: {
                required: false,
                pattern: /^(\+91[\s\-]?)?[6-9]\d{4}\-?\d{5}$|^(\+91[\s\-]?)?[6-9]\d{9}$/
            },
            inquiryType: {
                required: true
            },
            subject: {
                required: true,
                minLength: 5
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 500
            },
            terms: {
                required: true
            }
        };
    }
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearErrors(e.target));
        });
        const messageField = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        messageField.addEventListener('input', () => {
            const count = messageField.value.length;
            charCount.textContent = count;
            charCount.style.color = count > 450 ? '#e53e3e' : count > 400 ? '#d69e2e' : '#718096';
        });
        this.form.addEventListener('reset', () => {
            setTimeout(() => {
                this.clearAllErrors();
                document.getElementById('charCount').textContent = '0';
            }, 0);
        });
    }
    validateField(field) {
        const fieldName = field.name;
        const rules = this.validationRules[fieldName];
        if (!rules) return true;
        const value = field.value.trim();
        const errors = [];
        if (rules.required && !value) {
            errors.push(`${this.getFieldLabel(fieldName)} is required`);
        }
        if (value) {
            if (rules.pattern && !rules.pattern.test(value)) {
                errors.push(this.getPatternError(fieldName));
            }
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`);
            }
            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`${this.getFieldLabel(fieldName)} must not exceed ${rules.maxLength} characters`);
            }
        }
        if (field.type === 'checkbox' && rules.required && !field.checked) {
            errors.push(`You must agree to the terms and conditions`);
        }
        this.displayFieldErrors(field, errors);
        return errors.length === 0;
    }
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) {
            this.showFormErrors();
            return;
        }
        this.submitForm();
    }
    async submitForm() {
        const submitBtn = this.form.querySelector('.btn-primary');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');    
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        try {
            await this.simulateFormSubmission();            
            this.showSuccessMessage();            
        } catch (error) {
            this.showSubmissionError(error.message);
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }
    simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error. Please try again.'));
                }
            }, 2000);
        });
    }
    showSuccessMessage() {
        const successDiv = document.getElementById('successMessage');
        successDiv.style.display = 'block';
        successDiv.scrollIntoView({ behavior: 'smooth' });
        this.form.style.display = 'none';
    }
    showSubmissionError(message) {
        let errorDiv = document.querySelector('.form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                background: #fed7d7;
                border: 1px solid #e53e3e;
                color: #c53030;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
            `;
            this.form.parentNode.insertBefore(errorDiv, this.form);
        }        
        errorDiv.textContent = message;
        errorDiv.scrollIntoView({ behavior: 'smooth' });
    }
    showFormErrors() {
        const firstError = this.form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    displayFieldErrors(field, errors) {
        const fieldGroup = field.closest('.form-group');
        const errorSpan = fieldGroup.querySelector('.error-message');        
        if (errors.length > 0) {
            fieldGroup.classList.add('error');
            fieldGroup.classList.remove('valid');
            errorSpan.textContent = errors[0];
        } else {
            fieldGroup.classList.remove('error');
            if (field.value.trim()) {
                fieldGroup.classList.add('valid');
            }
            errorSpan.textContent = '';
        }
    }
    clearErrors(field) {
        const fieldGroup = field.closest('.form-group');
        const errorSpan = fieldGroup.querySelector('.error-message');
        
        fieldGroup.classList.remove('error');
        errorSpan.textContent = '';
    }
    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.error-message');
        const fieldGroups = this.form.querySelectorAll('.form-group');
        
        errorElements.forEach(el => el.textContent = '');
        fieldGroups.forEach(group => {
            group.classList.remove('error', 'valid');
        });
    }
    getFieldLabel(fieldName) {
        const labelMap = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email Address',
            phone: 'Phone Number',
            inquiryType: 'Inquiry Type',
            subject: 'Subject',
            message: 'Message',
            terms: 'Terms and Conditions'
        };
        return labelMap[fieldName] || fieldName;
    }
    getPatternError(fieldName) {
        const errorMap = {
            firstName: 'First name can only contain letters and spaces',
            lastName: 'Last name can only contain letters and spaces',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid Indian mobile number (10 digits starting with 6-9)'
        };
        return errorMap[fieldName] || 'Invalid format';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormValidator();
});
function resetForm() {
    const form = document.getElementById('contactForm');
    const validator = new ContactFormValidator();    
    form.reset();
    validator.clearAllErrors();
    document.getElementById('charCount').textContent = '0';
    const successDiv = document.getElementById('successMessage');
    successDiv.style.display = 'none';
    form.style.display = 'block';
}
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('contactForm');
        form.dispatchEvent(new Event('submit'));
    }
});
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('91') && value.length > 2) {
            value = value.substring(0, 12); 
        if (value.length > 2) {
            if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{0,5})/, '+$1 $2');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,5})/, '+$1 $2-$3');
            }
        }
    } else {
            value = value.substring(0, 10); 
        if (value.length > 5) {
            value = value.replace(/(\d{5})(\d{0,5})/, '$1-$2');
        }
    }   
    e.target.value = value;
});