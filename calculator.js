const shapeSelect = document.getElementById('shape');
const diameterGroup = document.getElementById('diameterGroup');
const pipeDiameterGroup = document.getElementById('pipeDiameterGroup');
const pipeThicknessGroup = document.getElementById('pipeThicknessGroup');
const squarePipeGroup = document.getElementById('squarePipeGroup');
const squarePipeThicknessGroup = document.getElementById('squarePipeThicknessGroup');
const squareGroup = document.getElementById('squareGroup');
const flatGroup = document.getElementById('flatGroup');
const hexGroup = document.getElementById('hexGroup');
const weightPerMeterEl = document.getElementById('weightPerMeter');
const totalWeightEl = document.getElementById('totalWeight');
const areaEl = document.getElementById('area');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const calculatorForm = document.getElementById('weightCalculator');
const presetButtons = document.querySelectorAll('[data-preset-shape]');

const densityFactor = 0.785; // kg per m for 1 cm^2 cross-section

const toCm = (value, unit) => {
    if (unit === 'mm') return value / 10;
    if (unit === 'cm') return value;
    if (unit === 'inch') return value * 2.54;
    return value;
};

const toMeters = (value, unit) => {
    if (unit === 'm') return value;
    if (unit === 'cm') return value / 100;
    if (unit === 'mm') return value / 1000;
    if (unit === 'inch') return value * 0.0254;
    if (unit === 'ft') return value * 0.3048;
    return value;
};

const toggleFields = () => {
    const shape = shapeSelect.value;
    diameterGroup.classList.toggle('d-none', shape !== 'round');
    pipeDiameterGroup.classList.toggle('d-none', shape !== 'pipe');
    pipeThicknessGroup.classList.toggle('d-none', shape !== 'pipe');
    squarePipeGroup.classList.toggle('d-none', shape !== 'squarePipe');
    squarePipeThicknessGroup.classList.toggle('d-none', shape !== 'squarePipe');
    squareGroup.classList.toggle('d-none', shape !== 'square');
    flatGroup.classList.toggle('d-none', shape !== 'flat');
    hexGroup.classList.toggle('d-none', shape !== 'hex');
};

const calculateArea = () => {
    const shape = shapeSelect.value;
    if (shape === 'round') {
        const diameter = parseFloat(document.getElementById('diameter').value) || 0;
        const unit = document.getElementById('diameterUnit').value;
        const diameterCm = toCm(diameter, unit);
        const radiusCm = diameterCm / 2;
        return Math.PI * radiusCm * radiusCm;
    }
    if (shape === 'pipe') {
        const outerDiameter = parseFloat(document.getElementById('pipeOuterDiameter').value) || 0;
        const thickness = parseFloat(document.getElementById('pipeThickness').value) || 0;
        const outerUnit = document.getElementById('pipeOuterDiameterUnit').value;
        const thicknessUnit = document.getElementById('pipeThicknessUnit').value;
        const outerCm = toCm(outerDiameter, outerUnit);
        const thicknessCm = toCm(thickness, thicknessUnit);
        const outerRadiusCm = outerCm / 2;
        const innerRadiusCm = outerRadiusCm - thicknessCm;
        return Math.PI * (outerRadiusCm * outerRadiusCm - innerRadiusCm * innerRadiusCm);
    }
    if (shape === 'square') {
        const side = parseFloat(document.getElementById('squareSize').value) || 0;
        const unit = document.getElementById('squareUnit').value;
        const sideCm = toCm(side, unit);
        return sideCm * sideCm;
    }
    if (shape === 'squarePipe') {
        const outerSide = parseFloat(document.getElementById('squarePipeOuter').value) || 0;
        const thickness = parseFloat(document.getElementById('squarePipeThickness').value) || 0;
        const outerUnit = document.getElementById('squarePipeOuterUnit').value;
        const thicknessUnit = document.getElementById('squarePipeThicknessUnit').value;
        const outerCm = toCm(outerSide, outerUnit);
        const thicknessCm = toCm(thickness, thicknessUnit);
        const innerSideCm = outerCm - 2 * thicknessCm;
        const outerArea = outerCm * outerCm;
        const innerArea = innerSideCm * innerSideCm;
        return outerArea - innerArea;
    }
    if (shape === 'flat') {
        const width = parseFloat(document.getElementById('flatWidth').value) || 0;
        const thickness = parseFloat(document.getElementById('flatThickness').value) || 0;
        const widthUnit = document.getElementById('flatWidthUnit').value;
        const thicknessUnit = document.getElementById('flatThicknessUnit').value;
        const widthCm = toCm(width, widthUnit);
        const thicknessCm = toCm(thickness, thicknessUnit);
        return widthCm * thicknessCm;
    }
    const acrossFlats = parseFloat(document.getElementById('hexAcrossFlats').value) || 0;
    const unit = document.getElementById('hexUnit').value;
    const acrossFlatsCm = toCm(acrossFlats, unit);
    return (Math.sqrt(3) / 2) * acrossFlatsCm * acrossFlatsCm;
};

const updateResults = () => {
    const shape = shapeSelect.value;
    let hasError = false;
    let errorMsg = '';

    if (shape === 'pipe') {
        const outerDiameter = parseFloat(document.getElementById('pipeOuterDiameter').value) || 0;
        const thickness = parseFloat(document.getElementById('pipeThickness').value) || 0;
        const outerUnit = document.getElementById('pipeOuterDiameterUnit').value;
        const thicknessUnit = document.getElementById('pipeThicknessUnit').value;
        const outerCm = toCm(outerDiameter, outerUnit);
        const thicknessCm = toCm(thickness, thicknessUnit);

        const thicknessPercent = (thicknessCm / outerCm) * 100;
        if (thicknessPercent > 50) {
            hasError = true;
            errorMsg = `Wall thickness (${thicknessPercent.toFixed(1)}%) exceeds 50% of outer diameter! This would result in a negative inner diameter.`;
        }
    }

    if (shape === 'squarePipe') {
        const outerSide = parseFloat(document.getElementById('squarePipeOuter').value) || 0;
        const thickness = parseFloat(document.getElementById('squarePipeThickness').value) || 0;
        const outerUnit = document.getElementById('squarePipeOuterUnit').value;
        const thicknessUnit = document.getElementById('squarePipeThicknessUnit').value;
        const outerCm = toCm(outerSide, outerUnit);
        const thicknessCm = toCm(thickness, thicknessUnit);

        const thicknessPercent = (thicknessCm / outerCm) * 100;
        if (thicknessPercent > 50) {
            hasError = true;
            errorMsg = `Wall thickness (${thicknessPercent.toFixed(1)}%) exceeds 50% of outer side! This would result in a negative inner dimension.`;
        }
    }

    if (hasError) {
        errorMessage.classList.remove('d-none');
        errorText.textContent = errorMsg;
        weightPerMeterEl.textContent = '-- kg/m';
        totalWeightEl.textContent = '-- kg';
        areaEl.textContent = '-- cm²';
        return;
    }

    errorMessage.classList.add('d-none');
    const length = parseFloat(document.getElementById('length').value) || 0;
    const lengthUnit = document.getElementById('lengthUnit').value;
    const lengthM = toMeters(length, lengthUnit);
    const area = calculateArea();
    const weightPerMeter = area * densityFactor;
    const totalWeight = weightPerMeter * lengthM;

    weightPerMeterEl.textContent = `${weightPerMeter.toFixed(2)} kg/m`;
    totalWeightEl.textContent = `${totalWeight.toFixed(2)} kg`;
    areaEl.textContent = `${area.toFixed(2)} cm²`;

    [weightPerMeterEl, totalWeightEl, areaEl].forEach((el) => {
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 220);
    });
};

const unitSelects = calculatorForm.querySelectorAll('select');
unitSelects.forEach((select) => {
    select.addEventListener('change', updateResults);
});

shapeSelect.addEventListener('change', () => {
    toggleFields();
    updateResults();
});

calculatorForm.addEventListener('input', updateResults);
calculatorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    updateResults();
});

presetButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const shape = button.getAttribute('data-preset-shape');
        shapeSelect.value = shape;
        if (shape === 'round') {
            document.getElementById('diameter').value = button.getAttribute('data-preset-size');
            document.getElementById('diameterUnit').value = 'mm';
        }
        if (shape === 'flat') {
            document.getElementById('flatWidth').value = button.getAttribute('data-preset-width');
            document.getElementById('flatThickness').value = button.getAttribute('data-preset-thickness');
            document.getElementById('flatWidthUnit').value = 'mm';
            document.getElementById('flatThicknessUnit').value = 'mm';
        }
        document.getElementById('length').value = button.getAttribute('data-preset-length');
        document.getElementById('lengthUnit').value = 'mm';
        toggleFields();
        updateResults();
    });
});

toggleFields();
updateResults();
