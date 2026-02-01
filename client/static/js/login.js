// ========================================
// BORROWBOX LOGIN PAGE JAVASCRIPT
// Campus-Verified Rental Platform
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initFormSwitching();
    initPasswordToggle();
    initPasswordStrength();
    initOTPInput();
    initStepNavigation();
    initFormValidation();
});

// ========================================
// FORM SWITCHING (Sign In <-> Sign Up)
// ========================================
function initFormSwitching() {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showSigninBtn = document.getElementById('show-signin');

    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signinForm.classList.remove('active');
            signupForm.classList.add('active');
            resetSignupForm();
        });
    }

    if (showSigninBtn) {
        showSigninBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.remove('active');
            signinForm.classList.add('active');
        });
    }
}

// ========================================
// PASSWORD TOGGLE VISIBILITY
// ========================================
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = button.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// ========================================
// PASSWORD STRENGTH METER
// ========================================
function initPasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    const strengthProgress = document.querySelector('.strength-progress');
    const strengthText = document.querySelector('.strength-text strong');

    if (!passwordInput || !strengthProgress) return;

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);

        // Update progress bar
        strengthProgress.className = 'strength-progress';
        if (strength.score === 1) {
            strengthProgress.classList.add('weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#D04049';
        } else if (strength.score === 2) {
            strengthProgress.classList.add('medium');
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#FFA500';
        } else if (strength.score === 3) {
            strengthProgress.classList.add('strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#10B981';
        } else {
            strengthText.textContent = '-';
            strengthText.style.color = '#ADB5BD';
        }
    });
}

function calculatePasswordStrength(password) {
    let score = 0;

    if (!password) return { score: 0 };

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    // Cap at 3
    score = Math.min(3, Math.floor(score / 2) + 1);

    return { score };
}

// ========================================
// OTP INPUT HANDLING
// ========================================
function initOTPInput() {
    const otpInputs = document.querySelectorAll('.otp-digit');

    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;

            // Only allow numbers
            if (!/^\d$/.test(value)) {
                e.target.value = '';
                return;
            }

            // Move to next input if exists
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            // Handle backspace
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }

            // Handle arrow keys
            if (e.key === 'ArrowLeft' && index > 0) {
                otpInputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            
            if (!/^\d+$/.test(pastedData)) return;

            pastedData.split('').forEach((char, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = char;
                }
            });

            // Focus last filled input or last input
            const lastIndex = Math.min(pastedData.length, otpInputs.length - 1);
            otpInputs[lastIndex].focus();
        });
    });

    // Resend OTP handler
    const resendBtn = document.querySelector('.resend-otp');
    if (resendBtn) {
        resendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleResendOTP();
        });
    }
}

function handleResendOTP() {
    // Simulate OTP resend
    const resendBtn = document.querySelector('.resend-otp');
    const originalText = resendBtn.textContent;
    
    resendBtn.textContent = 'Sending...';
    resendBtn.style.pointerEvents = 'none';
    
    setTimeout(() => {
        showNotification('OTP sent successfully!', 'success');
        resendBtn.textContent = originalText;
        resendBtn.style.pointerEvents = 'auto';
        
        // Clear OTP inputs
        document.querySelectorAll('.otp-digit').forEach(input => {
            input.value = '';
        });
        document.querySelector('.otp-digit').focus();
    }, 1500);
}

// ========================================
// STEP NAVIGATION (Sign Up Multi-Step)
// ========================================
function initStepNavigation() {
    let currentStep = 1;
    const totalSteps = 3;

    // Step 1 -> Step 2 (Send OTP)
    const nextStep1Btn = document.getElementById('next-step-1');
    if (nextStep1Btn) {
        nextStep1Btn.addEventListener('click', () => {
            if (validateStep1()) {
                sendOTP();
                goToStep(2);
            }
        });
    }

    // Verify OTP -> Step 3
    const verifyOTPBtn = document.getElementById('verify-otp');
    if (verifyOTPBtn) {
        verifyOTPBtn.addEventListener('click', () => {
            if (validateOTP()) {
                goToStep(3);
            }
        });
    }

    // Back buttons
    const backStep2Btn = document.getElementById('back-step-2');
    const backStep3Btn = document.getElementById('back-step-3');

    if (backStep2Btn) {
        backStep2Btn.addEventListener('click', () => goToStep(1));
    }

    if (backStep3Btn) {
        backStep3Btn.addEventListener('click', () => goToStep(2));
    }

    function goToStep(stepNumber) {
        currentStep = stepNumber;

        // Update step indicators
        const stepIndicators = document.querySelectorAll('.step');
        const formSteps = document.querySelectorAll('.form-step');

        stepIndicators.forEach((step, index) => {
            const num = index + 1;
            step.classList.remove('active', 'completed');
            
            if (num < currentStep) {
                step.classList.add('completed');
            } else if (num === currentStep) {
                step.classList.add('active');
            }
        });

        // Show current form step
        formSteps.forEach(step => step.classList.remove('active'));
        const currentFormStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (currentFormStep) {
            currentFormStep.classList.add('active');
        }
    }

    function validateStep1() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();

        if (!name) {
            showNotification('Please enter your full name', 'error');
            return false;
        }

        if (!email || !isValidCollegeEmail(email)) {
            showNotification('Please enter a valid college email address', 'error');
            return false;
        }

        if (!phone || !isValidPhone(phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return false;
        }

        return true;
    }

    function sendOTP() {
        const email = document.getElementById('signup-email').value;
        const emailDisplay = document.getElementById('verify-email-display');
        
        if (emailDisplay) {
            emailDisplay.textContent = email;
        }

        // Simulate OTP sending
        showNotification('OTP sent to your email!', 'success');
        
        // Auto-focus first OTP input
        setTimeout(() => {
            const firstOTPInput = document.querySelector('.otp-digit');
            if (firstOTPInput) firstOTPInput.focus();
        }, 300);
    }

    function validateOTP() {
        const otpInputs = document.querySelectorAll('.otp-digit');
        const otp = Array.from(otpInputs).map(input => input.value).join('');

        if (otp.length !== 6) {
            showNotification('Please enter complete OTP', 'error');
            return false;
        }

        // Simulate OTP verification (replace with actual API call)
        // For demo, accept "123456" as valid OTP
        if (otp === '123456') {
            showNotification('Email verified successfully!', 'success');
            return true;
        } else {
            showNotification('Invalid OTP. Try "123456" for demo.', 'error');
            return false;
        }
    }
}

function resetSignupForm() {
    // Reset to step 1
    const stepIndicators = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');

    stepIndicators.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) step.classList.add('active');
    });

    formSteps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === 0) step.classList.add('active');
    });

    // Clear all inputs
    document.getElementById('signup-form').reset();
    
    // Clear OTP inputs
    document.querySelectorAll('.otp-digit').forEach(input => {
        input.value = '';
    });

    // Reset password strength
    const strengthProgress = document.querySelector('.strength-progress');
    const strengthText = document.querySelector('.strength-text strong');
    if (strengthProgress) {
        strengthProgress.className = 'strength-progress';
    }
    if (strengthText) {
        strengthText.textContent = '-';
        strengthText.style.color = '#ADB5BD';
    }
}

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================
function initFormValidation() {
    // Sign In Form
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignIn();
        });
    }

    // Sign Up Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignUp();
        });
    }

    // Real-time email validation
    const signupEmail = document.getElementById('signup-email');
    if (signupEmail) {
        signupEmail.addEventListener('blur', () => {
            const email = signupEmail.value.trim();
            if (email && !isValidCollegeEmail(email)) {
                signupEmail.style.borderColor = '#D04049';
                showNotification('Please use a valid college email (.edu domain)', 'error');
            } else if (email) {
                signupEmail.style.borderColor = '#10B981';
            }
        });
    }

    // Password confirmation matching
    const confirmPassword = document.getElementById('signup-confirm-password');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            const password = document.getElementById('signup-password').value;
            const confirm = confirmPassword.value;

            if (confirm && password !== confirm) {
                confirmPassword.style.borderColor = '#D04049';
            } else if (confirm) {
                confirmPassword.style.borderColor = '#10B981';
            }
        });
    }
}

function handleSignIn() {
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidCollegeEmail(email)) {
        showNotification('Please use a valid college email address', 'error');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#signin-form .form-submit-btn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing In...</span>';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

        // For demo purposes - always show success
        showNotification('Sign in successful!', 'success');
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

function handleSignUp() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAgreed = document.getElementById('terms-agreement').checked;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }

    if (!termsAgreed) {
        showNotification('Please agree to Terms of Service and Community Rules', 'error');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#signup-form .form-submit-btn[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Creating Account...</span>';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

        // Show success
        showNotification('Account created successfully!', 'success');
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// ========================================
// VALIDATION HELPERS
// ========================================
function isValidCollegeEmail(email) {
    // Check if email ends with .edu
    const eduPattern = /^[^\s@]+@[^\s@]+\.edu$/i;
    return eduPattern.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it has 10 digits (US format) or 11 (with country code)
    return cleaned.length >= 10 && cleaned.length <= 11;
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-family: var(--font-secondary);
        font-size: 0.9rem;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification i {
        font-size: 1.25rem;
    }

    .notification-success {
        border-left: 4px solid #10B981;
    }

    .notification-success i {
        color: #10B981;
    }

    .notification-error {
        border-left: 4px solid #D04049;
    }

    .notification-error i {
        color: #D04049;
    }

    .notification-info {
        border-left: 4px solid #6D90B9;
    }

    .notification-info i {
        color: #6D90B9;
    }

    @media (max-width: 480px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// ADDITIONAL ENHANCEMENTS
// ========================================

// Add enter key handling for OTP inputs
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const activeStep = document.querySelector('.form-step.active');
        if (!activeStep) return;

        const stepNum = activeStep.getAttribute('data-step');
        
        if (stepNum === '2') {
            // If in OTP step, trigger verify
            const verifyBtn = document.getElementById('verify-otp');
            if (verifyBtn) verifyBtn.click();
        }
    }
});

// Auto-format phone number
const phoneInput = document.getElementById('signup-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        if (value.length > 6) {
            value = `+1 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
        } else if (value.length > 3) {
            value = `+1 (${value.slice(0, 3)}) ${value.slice(3)}`;
        } else if (value.length > 0) {
            value = `+1 (${value}`;
        }
        
        e.target.value = value;
    });
}

console.log('BorrowBox Login System Initialized ✓');