const shapeSelect = document.getElementById('shape');
const diameterGroup = document.getElementById('diameterGroup');
const pipeDiameterGroup = document.getElementById('pipeDiameterGroup');
const pipeThicknessGroup = document.getElementById('pipeThicknessGroup');
const squarePipeGroup = document.getElementById('squarePipeGroup');
const squarePipeThicknessGroup = document.getElementById('squarePipeThicknessGroup');
const squareGroup = document.getElementById('squareGroup');
const flatGroup = document.getElementById('flatGroup');
const hexGroup = document.getElementById('hexGroup');
const cSectionGroup = document.getElementById('cSectionGroup');
const iSectionGroup = document.getElementById('iSectionGroup');
const flatHollowGroup = document.getElementById('flatHollowGroup');
const angleGroup = document.getElementById('angleGroup');
const densityInput = document.getElementById('density');
const weightPerMeterEl = document.getElementById('weightPerMeter');
const totalWeightEl = document.getElementById('totalWeight');
const areaEl = document.getElementById('area');
const formulaTextEl = document.getElementById('formulaText');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const calculatorForm = document.getElementById('weightCalculator');

// Formula display texts for each shape
const formulas = {
    round: 'Area = π × (D/2)² = π × D² / 4',
    pipe: 'Area = π × (OD/2)² - π × (ID/2)² = π × (OD² - ID²) / 4',
    square: 'Area = Side²',
    squarePipe: 'Area = OuterSide² - (OuterSide - 2×t)²',
    flat: 'Area = Width × Thickness',
    flatHollow: 'Area = W×H - (W-2t)×(H-2t)',
    hex: 'Area = (√3 / 2) × AF² = 0.866 × AF²',
    cSection: 'Area = 2×B×tf + (H-2×tf)×tw',
    iSection: 'Area = 2×B×tf + (H-2×tf)×tw',
    angle: 'Area = A×t + B×t - t²'
};

const densityFactor = 0.785; // kg per meter for 1 cm² cross-section (steel density 7.85 g/cm³)
// Weight per meter (kg/m) = Area (cm²) × 0.785
// Total weight (kg) = Weight/m × Length (m)

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
    cSectionGroup.classList.toggle('d-none', shape !== 'cSection');
    iSectionGroup.classList.toggle('d-none', shape !== 'iSection');
    flatHollowGroup.classList.toggle('d-none', shape !== 'flatHollow');
    angleGroup.classList.toggle('d-none', shape !== 'angle');
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
    if (shape === 'flatHollow') {
        const outerWidth = parseFloat(document.getElementById('flatHollowOuterWidth').value) || 0;
        const outerHeight = parseFloat(document.getElementById('flatHollowOuterHeight').value) || 0;
        const thickness = parseFloat(document.getElementById('flatHollowThickness').value) || 0;
        const outerWidthUnit = document.getElementById('flatHollowOuterWidthUnit').value;
        const outerHeightUnit = document.getElementById('flatHollowOuterHeightUnit').value;
        const thicknessUnit = document.getElementById('flatHollowThicknessUnit').value;
        const outerWidthCm = toCm(outerWidth, outerWidthUnit);
        const outerHeightCm = toCm(outerHeight, outerHeightUnit);
        const thicknessCm = toCm(thickness, thicknessUnit);
        // Rectangular hollow section area
        // Outer area - Inner area = W×H - (W-2t)×(H-2t)
        const outerArea = outerWidthCm * outerHeightCm;
        const innerWidthCm = outerWidthCm - 2 * thicknessCm;
        const innerHeightCm = outerHeightCm - 2 * thicknessCm;
        const innerArea = innerWidthCm * innerHeightCm;
        return outerArea - innerArea;
    }
    if (shape === 'cSection') {
        const height = parseFloat(document.getElementById('cSectionHeight').value) || 0;
        const flangeWidth = parseFloat(document.getElementById('cSectionFlangeWidth').value) || 0;
        const webThickness = parseFloat(document.getElementById('cSectionWebThickness').value) || 0;
        const flangeThickness = parseFloat(document.getElementById('cSectionFlangeThickness').value) || 0;
        const heightUnit = document.getElementById('cSectionHeightUnit').value;
        const flangeWidthUnit = document.getElementById('cSectionFlangeWidthUnit').value;
        const webThicknessUnit = document.getElementById('cSectionWebThicknessUnit').value;
        const flangeThicknessUnit = document.getElementById('cSectionFlangeThicknessUnit').value;
        const heightCm = toCm(height, heightUnit);
        const flangeWidthCm = toCm(flangeWidth, flangeWidthUnit);
        const webThicknessCm = toCm(webThickness, webThicknessUnit);
        const flangeThicknessCm = toCm(flangeThickness, flangeThicknessUnit);
        // C-channel cross-sectional area
        // Area = 2 × (flange width × flange thickness) + (web height - 2 × flange thickness) × web thickness
        const flangeArea = 2 * (flangeWidthCm * flangeThicknessCm);
        const webArea = (heightCm - 2 * flangeThicknessCm) * webThicknessCm;
        return flangeArea + webArea;
    }
    if (shape === 'iSection') {
        const height = parseFloat(document.getElementById('iSectionHeight').value) || 0;
        const flangeWidth = parseFloat(document.getElementById('iSectionFlangeWidth').value) || 0;
        const webThickness = parseFloat(document.getElementById('iSectionWebThickness').value) || 0;
        const flangeThickness = parseFloat(document.getElementById('iSectionFlangeThickness').value) || 0;
        const heightUnit = document.getElementById('iSectionHeightUnit').value;
        const flangeWidthUnit = document.getElementById('iSectionFlangeWidthUnit').value;
        const webThicknessUnit = document.getElementById('iSectionWebThicknessUnit').value;
        const flangeThicknessUnit = document.getElementById('iSectionFlangeThicknessUnit').value;
        const heightCm = toCm(height, heightUnit);
        const flangeWidthCm = toCm(flangeWidth, flangeWidthUnit);
        const webThicknessCm = toCm(webThickness, webThicknessUnit);
        const flangeThicknessCm = toCm(flangeThickness, flangeThicknessUnit);
        // I-beam cross-sectional area
        // Area = 2 × (flange width × flange thickness) + (web height - 2 × flange thickness) × web thickness
        const flangeArea = 2 * (flangeWidthCm * flangeThicknessCm);
        const webArea = (heightCm - 2 * flangeThicknessCm) * webThicknessCm;
        return flangeArea + webArea;
    }
    if (shape === 'angle') {
        const longLeg = parseFloat(document.getElementById('angleLongLeg').value) || 0;
        const shortLeg = parseFloat(document.getElementById('angleShortLeg').value) || 0;
        const thickness = parseFloat(document.getElementById('angleThickness').value) || 0;
        const longLegUnit = document.getElementById('angleLongLegUnit').value;
        const shortLegUnit = document.getElementById('angleShortLegUnit').value;
        const thicknessUnit = document.getElementById('angleThicknessUnit').value;
        const longLegCm = toCm(longLeg, longLegUnit);
        const shortLegCm = toCm(shortLeg, shortLegUnit);
        const thicknessCm = toCm(thickness, thicknessUnit);
        // Equal angle cross-sectional area (L-section)
        // Area = A×t + B×t - t² (where t is thickness)
        return (longLegCm * thicknessCm) + (shortLegCm * thicknessCm) - (thicknessCm * thicknessCm);
    }
    const acrossFlats = parseFloat(document.getElementById('hexAcrossFlats').value) || 0;
    const unit = document.getElementById('hexUnit').value;
    const acrossFlatsCm = toCm(acrossFlats, unit);
    // Hexagon area formula using "across flats" (flat-to-flat distance)
    // Area = (√3 / 2) × AF² = 0.866 × AF² (in same unit)
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

    if (shape === 'flatHollow') {
        const outerWidth = parseFloat(document.getElementById('flatHollowOuterWidth').value) || 0;
        const outerHeight = parseFloat(document.getElementById('flatHollowOuterHeight').value) || 0;
        const thickness = parseFloat(document.getElementById('flatHollowThickness').value) || 0;
        const outerWidthUnit = document.getElementById('flatHollowOuterWidthUnit').value;
        const outerHeightUnit = document.getElementById('flatHollowOuterHeightUnit').value;
        const thicknessUnit = document.getElementById('flatHollowThicknessUnit').value;
        const outerWidthCm = toCm(outerWidth, outerWidthUnit);
        const outerHeightCm = toCm(outerHeight, outerHeightUnit);
        const thicknessCm = toCm(thickness, thicknessUnit);

        const smallerDimension = Math.min(outerWidthCm, outerHeightCm);
        const thicknessPercent = (thicknessCm / smallerDimension) * 100;
        if (thicknessPercent > 50) {
            hasError = true;
            errorMsg = `Wall thickness (${thicknessPercent.toFixed(1)}%) exceeds 50% of smaller dimension! This would result in a negative inner dimension.`;
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
    const pieces = parseFloat(document.getElementById('pieces').value) || 1;
    const lengthM = toMeters(length, lengthUnit);
    const area = calculateArea();
    const density = parseFloat(densityInput.value) || 7.85;
    // Area (cm²) * Length (m) * Factor = Weight (kg)
    // 1 m = 100 cm
    // Weight (g) = Area (cm²) * 100cm * Density (g/cm³)
    // Weight (kg) = (Area * 100 * Density) / 1000 = Area * Density * 0.1
    const dynamicDensityFactor = density * 0.1;
    const weightPerMeter = area * dynamicDensityFactor;
    const totalWeight = weightPerMeter * lengthM * pieces;

    weightPerMeterEl.textContent = `${weightPerMeter.toFixed(3)} kg/m`;
    totalWeightEl.textContent = `${totalWeight.toFixed(3)} kg`;
    areaEl.textContent = `${area.toFixed(3)} cm²`;

    [weightPerMeterEl, totalWeightEl, areaEl].forEach((el) => {
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 220);
    });
};

const unitSelects = calculatorForm.querySelectorAll('select');
unitSelects.forEach((select) => {
    select.addEventListener('change', updateResults);
});

densityInput.addEventListener('input', () => {
    updateResults();
    // Save density to localStorage
    localStorage.setItem('steelCalculatorDensity', densityInput.value);
});

shapeSelect.addEventListener('change', () => {
    toggleFields();
    updateResults();
    // Save shape to localStorage
    localStorage.setItem('steelCalculatorShape', shapeSelect.value);
    // Update formula text for selected shape
    const shape = shapeSelect.value;
    const density = parseFloat(densityInput.value) || 7.85;
    const densityFactor = (density / 1000).toFixed(4);
    formulaTextEl.innerHTML = formulas[shape] + '<br>Weight = Area × Length × ' + densityFactor;
});

calculatorForm.addEventListener('input', updateResults);
calculatorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    updateResults();
});

// Load saved preferences from localStorage
const savedShape = localStorage.getItem('steelCalculatorShape');
const savedDensity = localStorage.getItem('steelCalculatorDensity');

// Restore saved shape if available
if (savedShape) {
    shapeSelect.value = savedShape;
}

// Restore saved density if available
if (savedDensity) {
    densityInput.value = savedDensity;
}

toggleFields();
updateResults();
// Set initial formula text on page load
const initialShape = shapeSelect.value;
const initialDensity = parseFloat(densityInput.value) || 7.85;
const initialDensityFactorDisplay = (initialDensity * 0.1).toFixed(4);
formulaTextEl.innerHTML = formulas[initialShape] + '<br>Weight = Area × Length × ' + initialDensityFactorDisplay;
