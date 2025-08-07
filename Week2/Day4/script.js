class TipCalculator {
    constructor() {
        this.billInput = document.getElementById('bill');
        this.customTipInput = document.getElementById('custom-tip');
        this.peopleInput = document.getElementById('people');
        this.tipButtons = document.querySelectorAll('.tip-btn');
        this.tipAmountDisplay = document.getElementById('tip-amount');
        this.totalAmountDisplay = document.getElementById('total-amount');
        this.resetBtn = document.getElementById('reset-btn');
        this.errorMessage = document.getElementById('error-message');

        this.currentTipPercentage = 0;
        this.billAmount = 0;
        this.numberOfPeople = 0;
        this.isCalculating = false;

        this.init();
    }

    init() {
        // Add event listeners
        this.billInput.addEventListener('input', () => this.handleBillInput());
        this.customTipInput.addEventListener('input', () => this.handleCustomTipInput());
        this.peopleInput.addEventListener('input', () => this.handlePeopleInput());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Add tip button listeners with ripple effect
        this.tipButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
                this.handleTipButtonClick(button);
            });
        });

        // Custom tip input focus/blur handlers
        this.customTipInput.addEventListener('focus', () => this.clearTipButtons());
        this.customTipInput.addEventListener('blur', () => this.handleCustomTipBlur());

        // Add ripple effect to reset button
        this.resetBtn.addEventListener('click', (e) => {
            this.createRipple(e, this.resetBtn);
        });

        // Initial calculation
        this.calculate();
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleBillInput() {
        this.billAmount = parseFloat(this.billInput.value) || 0;
        this.animateCalculation();
    }

    handleTipButtonClick(button) {
        // Clear custom tip input
        this.customTipInput.value = '';
        
        // Remove active class from all buttons
        this.tipButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button with animation
        button.classList.add('active');
        
        // Set tip percentage
        this.currentTipPercentage = parseInt(button.dataset.tip);
        this.animateCalculation();
    }

    handleCustomTipInput() {
        this.clearTipButtons();
        this.currentTipPercentage = parseFloat(this.customTipInput.value) || 0;
        this.animateCalculation();
    }

    handleCustomTipBlur() {
        if (!this.customTipInput.value) {
            this.currentTipPercentage = 0;
            this.animateCalculation();
        }
    }

    handlePeopleInput() {
        const value = parseInt(this.peopleInput.value) || 0;
        
        if (value === 0 && this.peopleInput.value !== '') {
            this.showError();
            this.numberOfPeople = 0;
        } else {
            this.hideError();
            this.numberOfPeople = value;
        }
        
        this.animateCalculation();
    }

    clearTipButtons() {
        this.tipButtons.forEach(btn => btn.classList.remove('active'));
    }

    showError() {
        this.errorMessage.classList.add('show');
        this.peopleInput.classList.add('error');
    }

    hideError() {
        this.errorMessage.classList.remove('show');
        this.peopleInput.classList.remove('error');
    }

    animateCalculation() {
        if (this.isCalculating) return;
        
        this.isCalculating = true;
        
        // Add calculating class for loading animation
        this.tipAmountDisplay.parentElement.classList.add('calculating');
        this.totalAmountDisplay.parentElement.classList.add('calculating');
        
        // Simulate calculation delay for smooth animation
        setTimeout(() => {
            this.calculate();
            this.isCalculating = false;
            
            // Remove calculating class
            this.tipAmountDisplay.parentElement.classList.remove('calculating');
            this.totalAmountDisplay.parentElement.classList.remove('calculating');
        }, 300);
    }

    animateValue(element, start, end, duration = 500) {
        const startTime = performance.now();
        const startValue = start;
        const endValue = end;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOut;
            
            element.textContent = `$${currentValue.toFixed(2)}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Add success pulse animation when complete
                element.classList.add('success-pulse');
                setTimeout(() => {
                    element.classList.remove('success-pulse');
                }, 600);
            }
        };
        
        requestAnimationFrame(animate);
    }

    calculate() {
        if (this.billAmount > 0 && this.numberOfPeople > 0 && this.currentTipPercentage >= 0) {
            const tipAmount = (this.billAmount * this.currentTipPercentage / 100) / this.numberOfPeople;
            const totalAmount = (this.billAmount / this.numberOfPeople) + tipAmount;

            // Get current values for animation
            const currentTip = parseFloat(this.tipAmountDisplay.textContent.replace('$', '')) || 0;
            const currentTotal = parseFloat(this.totalAmountDisplay.textContent.replace('$', '')) || 0;

            // Add updating class for animation
            this.tipAmountDisplay.classList.add('updating');
            this.totalAmountDisplay.classList.add('updating');

            // Animate the values
            this.animateValue(this.tipAmountDisplay, currentTip, tipAmount);
            this.animateValue(this.totalAmountDisplay, currentTotal, totalAmount);
            
            // Remove updating class after animation
            setTimeout(() => {
                this.tipAmountDisplay.classList.remove('updating');
                this.totalAmountDisplay.classList.remove('updating');
            }, 500);
            
            this.resetBtn.classList.add('active');
        } else {
            // Animate to zero
            const currentTip = parseFloat(this.tipAmountDisplay.textContent.replace('$', '')) || 0;
            const currentTotal = parseFloat(this.totalAmountDisplay.textContent.replace('$', '')) || 0;
            
            this.animateValue(this.tipAmountDisplay, currentTip, 0);
            this.animateValue(this.totalAmountDisplay, currentTotal, 0);
            
            if (this.billAmount === 0 && this.numberOfPeople === 0 && this.currentTipPercentage === 0) {
                this.resetBtn.classList.remove('active');
            }
        }
    }

    reset() {
        // Clear all inputs with animation
        this.billInput.value = '';
        this.customTipInput.value = '';
        this.peopleInput.value = '';

        // Reset values
        this.billAmount = 0;
        this.numberOfPeople = 0;
        this.currentTipPercentage = 0;

        // Clear active states
        this.clearTipButtons();
        this.hideError();
        this.resetBtn.classList.remove('active');

        // Animate reset to zero
        const currentTip = parseFloat(this.tipAmountDisplay.textContent.replace('$', '')) || 0;
        const currentTotal = parseFloat(this.totalAmountDisplay.textContent.replace('$', '')) || 0;
        
        this.animateValue(this.tipAmountDisplay, currentTip, 0);
        this.animateValue(this.totalAmountDisplay, currentTotal, 0);
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TipCalculator();
});