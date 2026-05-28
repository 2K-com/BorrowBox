// ========================================
// BORROWBOX SECURE LOGIN JAVASCRIPT
// Nordic Minimalist Architecture
// ========================================

document.addEventListener('DOMContentLoaded', () => {
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

        strengthProgress.className = 'strength-progress';
        if (strength.score === 1) {
            strengthProgress.classList.add('weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#EF4444'; // Error Red
        } else if (strength.score === 2) {
            strengthProgress.classList.add('medium');
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#F59E0B'; // Warning Amber
        } else if (strength.score === 3) {
            strengthProgress.classList.add('strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#10B981'; // Secure Emerald
        } else {
            strengthText.textContent = '-';
            strengthText.style.color = '#64748B'; // Text Muted
        }
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    if (!password) return { score: 0 };
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
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
            if (!/^\d$/.test(value)) {
                e.target.value = '';
                return;
            }
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                otpInputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            if (!/^\d+$/.test(pastedData)) return;

            pastedData.split('').forEach((char, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = char;
                }
            });
            const lastIndex = Math.min(pastedData.length, otpInputs.length - 1);
            otpInputs[lastIndex].focus();
        });
    });

    const resendBtn = document.querySelector('.resend-otp');
    if (resendBtn) {
        resendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleResendOTP();
        });
    }
}

function handleResendOTP() {
    const resendBtn = document.querySelector('.resend-otp');
    const originalText = resendBtn.textContent;
    
    resendBtn.textContent = 'Sending...';
    resendBtn.style.pointerEvents = 'none';
    
    setTimeout(() => {
        showNotification('OTP sent successfully!', 'success');
        resendBtn.textContent = originalText;
        resendBtn.style.pointerEvents = 'auto';
        
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

    const nextStep1Btn = document.getElementById('next-step-1');
    if (nextStep1Btn) {
        nextStep1Btn.addEventListener('click', () => {
            if (validateStep1()) {
                sendOTP();
                goToStep(2);
            }
        });
    }

    const verifyOTPBtn = document.getElementById('verify-otp');
    if (verifyOTPBtn) {
        verifyOTPBtn.addEventListener('click', () => {
            if (validateOTP()) {
                goToStep(3);
            }
        });
    }

    const backStep2Btn = document.getElementById('back-step-2');
    const backStep3Btn = document.getElementById('back-step-3');

    if (backStep2Btn) backStep2Btn.addEventListener('click', () => goToStep(1));
    if (backStep3Btn) backStep3Btn.addEventListener('click', () => goToStep(2));

    function goToStep(stepNumber) {
        currentStep = stepNumber;
        const stepIndicators = document.querySelectorAll('.step');
        const formSteps = document.querySelectorAll('.form-step');

        stepIndicators.forEach((step, index) => {
            const num = index + 1;
            step.classList.remove('active', 'completed');
            if (num < currentStep) step.classList.add('completed');
            else if (num === currentStep) step.classList.add('active');
        });

        formSteps.forEach(step => step.classList.remove('active'));
        const currentFormStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (currentFormStep) currentFormStep.classList.add('active');
    }

    function validateStep1() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();

        if (!name) { showNotification('Please enter your full name', 'error'); return false; }
        if (!email || !isValidCollegeEmail(email)) { showNotification('Please enter a valid .edu email', 'error'); return false; }
        if (!phone || !isValidPhone(phone)) { showNotification('Please enter a valid phone number', 'error'); return false; }
        return true;
    }

    function sendOTP() {
        const email = document.getElementById('signup-email').value;
        const emailDisplay = document.getElementById('verify-email-display');
        if (emailDisplay) emailDisplay.textContent = email;
        showNotification('OTP sent to your email!', 'success');
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

    document.getElementById('signup-form').reset();
    document.querySelectorAll('.otp-digit').forEach(input => input.value = '');

    const strengthProgress = document.querySelector('.strength-progress');
    const strengthText = document.querySelector('.strength-text strong');
    if (strengthProgress) strengthProgress.className = 'strength-progress';
    if (strengthText) {
        strengthText.textContent = '-';
        strengthText.style.color = '#64748B';
    }
}

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================
function initFormValidation() {
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignIn();
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignUp();
        });
    }

    const signupEmail = document.getElementById('signup-email');
    if (signupEmail) {
        signupEmail.addEventListener('blur', () => {
            const email = signupEmail.value.trim();
            if (email && !isValidCollegeEmail(email)) {
                signupEmail.style.borderColor = '#EF4444'; // Error Red
                showNotification('Please use a valid college email (.edu domain)', 'error');
            } else if (email) {
                signupEmail.style.borderColor = '#10B981'; // Secure Emerald
            }
        });
    }

    const confirmPassword = document.getElementById('signup-confirm-password');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            const password = document.getElementById('signup-password').value;
            const confirm = confirmPassword.value;
            if (confirm && password !== confirm) {
                confirmPassword.style.borderColor = '#EF4444';
            } else if (confirm) {
                confirmPassword.style.borderColor = '#10B981';
            }
        });
    }
}

function handleSignIn() {
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) { showNotification('Please fill in all fields', 'error'); return; }
    if (!isValidCollegeEmail(email)) { showNotification('Please use a valid college email', 'error'); return; }

    const submitBtn = document.querySelector('#signin-form .form-submit-btn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Authenticating...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        showNotification('Authentication successful.', 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    }, 1500);
}

function handleSignUp() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAgreed = document.getElementById('terms-agreement').checked;

    if (password !== confirmPassword) { showNotification('Passwords do not match', 'error'); return; }
    if (password.length < 8) { showNotification('Password must be at least 8 characters', 'error'); return; }
    if (!termsAgreed) { showNotification('You must agree to the protocol terms.', 'error'); return; }

    const submitBtn = document.querySelector('#signup-form .form-submit-btn[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Securing Vault...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        showNotification('Verification complete.', 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    }, 2000);
}

function isValidCollegeEmail(email) {
    const eduPattern = /^[^\s@]+@[^\s@]+\.edu$/i;
    return eduPattern.test(email);
}

function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };

    notification.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification { position: fixed; top: 100px; right: 24px; background: white; padding: 16px 24px; border: 1px solid var(--border-clean); border-radius: var(--radius-md); box-shadow: var(--shadow-md); display: flex; align-items: center; gap: 12px; z-index: 10000; transform: translateX(120%); transition: transform var(--transition-base); font-family: var(--font-secondary); font-size: 0.9rem; font-weight: 500; color: var(--text-main); }
    .notification.show { transform: translateX(0); }
    .notification i { font-size: 1.25rem; }
    .notification-success i { color: var(--accent-secure); }
    .notification-error i { color: var(--error-red); }
    .notification-info i { color: var(--text-main); }
    @media (max-width: 480px) { .notification { right: 16px; left: 16px; justify-content: center; top: 16px; } }
`;
document.head.appendChild(notificationStyles);

// Auto-format phone number
const phoneInput = document.getElementById('signup-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        if (value.length > 6) value = `+1 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
        else if (value.length > 3) value = `+1 (${value.slice(0, 3)}) ${value.slice(3)}`;
        else if (value.length > 0) value = `+1 (${value}`;
        e.target.value = value;
    });
}