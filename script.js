document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmi-form');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const bmiValueElem = document.getElementById('bmi-value');
    const bmiCategoryElem = document.getElementById('bmi-category');
    const resetBtn = document.getElementById('reset-btn');
    const scaleMarker = document.getElementById('scale-marker');

    // Define BMI categories with their upper limit, label, and color
    const categories = {
        underweight: { limit: 18.5, label: 'Underweight', color: 'var(--underweight-color)' },
        normal: { limit: 25, label: 'Normal', color: 'var(--normal-color)' },
        overweight: { limit: 30, label: 'Overweight', color: 'var(--overweight-color)' },
        obese: { limit: Infinity, label: 'Obese', color: 'var(--obese-color)' }
    };

    // Define the visual range of the BMI scale for positioning the marker
    const SCALE_MIN_BMI = 15;
    const SCALE_MAX_BMI = 40;

    const calculateBMI = (e) => {
        e.preventDefault(); // Prevent form from reloading the page

        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);

        // --- Input Validation ---
        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            alert("Please enter valid positive numbers for weight and height.");
            resetCalculator();
            return;
        }

        // --- BMI Calculation ---
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const bmiRounded = bmi.toFixed(1);

        // --- Update UI ---
        updateResults(bmi, bmiRounded);
    };

    const updateResults = (bmi, bmiRounded) => {
        bmiValueElem.textContent = bmiRounded;

        let categoryInfo;
        if (bmi < categories.underweight.limit) categoryInfo = categories.underweight;
        else if (bmi < categories.normal.limit) categoryInfo = categories.normal;
        else if (bmi < categories.overweight.limit) categoryInfo = categories.overweight;
        else categoryInfo = categories.obese;
        
        bmiCategoryElem.textContent = categoryInfo.label;
        bmiValueElem.style.color = categoryInfo.color;
        
        updateMarkerPosition(bmi);
    };

    const updateMarkerPosition = (bmi) => {
        // Calculate the percentage position on the scale
        let percentage = ((bmi - SCALE_MIN_BMI) / (SCALE_MAX_BMI - SCALE_MIN_BMI)) * 100;
        
        // Clamp the value between 0% and 100% to keep the marker within the bar
        percentage = Math.max(0, Math.min(100, percentage));

        scaleMarker.style.left = `${percentage}%`;
        scaleMarker.style.opacity = '1';
    };

    const resetCalculator = () => {
        bmiForm.reset();
        bmiValueElem.textContent = '0.0';
        bmiCategoryElem.textContent = '-';
        bmiValueElem.style.color = 'var(--dark-text)'; // Reset to default color
        scaleMarker.style.opacity = '0';
        // Delay resetting position to allow fade-out animation
        setTimeout(() => {
           scaleMarker.style.left = '50%';
        }, 300);
    };

    // --- Event Listeners ---
    bmiForm.addEventListener('submit', calculateBMI);
    resetBtn.addEventListener('click', resetCalculator);
});