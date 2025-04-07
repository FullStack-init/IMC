// Variables globales
let patients = [];
let currentPatientId = null;
let weightChart = null;

// Elementos del DOM
const patientSelect = document.getElementById('patient-select');
const newPatientBtn = document.getElementById('new-patient-btn');
const deletePatientBtn = document.getElementById('delete-patient-btn');
const patientModal = document.getElementById('patient-modal');
const closeModal = document.querySelector('.close');
const patientForm = document.getElementById('patient-form');
const addWeightBtn = document.getElementById('add-weight-btn');
const newWeightInput = document.getElementById('new-weight');
const weightDateInput = document.getElementById('weight-date');
const weightTable = document.getElementById('weight-table').querySelector('tbody');

// Elementos de información del paciente
const patientNameElement = document.getElementById('patient-name');
const patientAgeElement = document.getElementById('patient-age');
const patientHeightElement = document.getElementById('patient-height');
const initialWeightElement = document.getElementById('initial-weight');
const initialDateElement = document.getElementById('initial-date');

// Elementos de métricas
const weekChangeElement = document.getElementById('week-change');
const weeklyAverageElement = document.getElementById('weekly-average');
const currentBmiElement = document.getElementById('current-bmi');
const bmiClassificationElement = document.getElementById('bmi-classification');
const healthAdviceElement = document.getElementById('health-advice');

// Gráfico
const chartCanvas = document.getElementById('progress-chart');

// Inicializar la aplicación
function init() {
    // Configurar fecha actual como valor predeterminado
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    weightDateInput.value = formattedDate;
    
    // Cargar pacientes desde el almacenamiento local
    loadPatients();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Actualizar la interfaz
    updateUI();
}

// Configurar event listeners
function setupEventListeners() {
    // Selector de pacientes
    patientSelect.addEventListener('change', (e) => {
        currentPatientId = e.target.value;
        updateUI();
    });
    
    // Botón nuevo paciente
    newPatientBtn.addEventListener('click', () => {
        patientModal.style.display = 'block';
    });
    
    // Botón eliminar paciente
    deletePatientBtn.addEventListener('click', deleteCurrentPatient);
    
    // Cerrar modal
    closeModal.addEventListener('click', () => {
        patientModal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === patientModal) {
            patientModal.style.display = 'none';
        }
    });
    
    // Formulario de nuevo paciente
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewPatient();
    });
    
    // Agregar nuevo peso
    addWeightBtn.addEventListener('click', addWeight);
    
    // Editar peso inicial
    document.getElementById('edit-initial-weight').addEventListener('click', editInitialWeight);
    
    // Editar fecha inicial
    document.getElementById('edit-initial-date').addEventListener('click', editInitialDate);
}

// Cargar pacientes desde el almacenamiento local
function loadPatients() {
    const savedPatients = localStorage.getItem('weightTrackerPatients');
    if (savedPatients) {
        patients = JSON.parse(savedPatients);
    } else {
        // Datos de ejemplo si no hay pacientes guardados
        patients = [
            {
                id: '1',
                name: 'Juan Pérez',
                age: 35,
                height: 175,
                initialWeight: 85.5,
                weights: [
                    { date: '2023-06-01', weight: 78.2 },
                    { date: '2023-05-01', weight: 79.0 },
                    { date: '2023-04-01', weight: 80.5 },
                    { date: '2023-03-01', weight: 81.8 },
                    { date: '2023-02-01', weight: 83.2 },
                    { date: '2023-01-01', weight: 85.5 }
                ]
            },
            {
                id: '2',
                name: 'María García',
                age: 28,
                height: 165,
                initialWeight: 62.0,
                weights: [
                    { date: '2023-06-01', weight: 60.0 },
                    { date: '2023-05-01', weight: 60.5 },
                    { date: '2023-04-01', weight: 60.8 },
                    { date: '2023-03-01', weight: 61.0 },
                    { date: '2023-02-01', weight: 61.5 },
                    { date: '2023-01-01', weight: 62.0 }
                ]
            }
        ];
        savePatients();
    }
    updatePatientSelect();
}

// Guardar pacientes en el almacenamiento local
function savePatients() {
    localStorage.setItem('weightTrackerPatients', JSON.stringify(patients));
    updatePatientSelect();
}

// Actualizar el selector de pacientes
function updatePatientSelect() {
    patientSelect.innerHTML = '<option value="">Seleccionar paciente</option>';
    
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        patientSelect.appendChild(option);
    });
    
    // Seleccionar el paciente actual si existe
    if (currentPatientId && patients.some(p => p.id === currentPatientId)) {
        patientSelect.value = currentPatientId;
    } else {
        currentPatientId = null;
    }
}

// Agregar nuevo paciente
function addNewPatient() {
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseInt(document.getElementById('height').value);
    const startingWeight = parseFloat(document.getElementById('starting-weight').value);
    
    if (isNaN(age)) {
        alert('Por favor ingrese una edad válida');
        return;
    }
    
    if (isNaN(height) || height <= 0) {
        alert('Por favor ingrese una altura válida (en cm)');
        return;
    }
    
    if (isNaN(startingWeight) || startingWeight <= 0) {
        alert('Por favor ingrese un peso inicial válido');
        return;
    }
    
    const newPatient = {
        id: Date.now().toString(),
        name,
        age,
        height,
        initialWeight: startingWeight,
        weights: [{
            date: new Date().toISOString().split('T')[0],
            weight: startingWeight
        }]
    };
    
    patients.push(newPatient);
    savePatients();
    
    // Limpiar el formulario
    patientForm.reset();
    
    // Cerrar el modal
    patientModal.style.display = 'none';
    
    // Seleccionar el nuevo paciente
    currentPatientId = newPatient.id;
    updateUI();
}

// Eliminar paciente actual
function deleteCurrentPatient() {
    if (!currentPatientId) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar este paciente y todos sus datos?')) {
        patients = patients.filter(p => p.id !== currentPatientId);
        savePatients();
        currentPatientId = null;
        updateUI();
    }
}

// Obtener paciente actual
function getCurrentPatient() {
    return patients.find(p => p.id === currentPatientId);
}

// Agregar nuevo peso
function addWeight() {
    if (!currentPatientId) {
        alert('Por favor, selecciona un paciente primero');
        return;
    }
    
    const weight = parseFloat(newWeightInput.value);
    const date = weightDateInput.value;
    
    if (isNaN(weight)) {
        alert('Por favor, ingresa un peso válido');
        return;
    }
    
    if (!date) {
        alert('Por favor, selecciona una fecha');
        return;
    }
    
    const patient = getCurrentPatient();
    patient.weights.unshift({
        date,
        weight
    });
    
    savePatients();
    updateUI();
    
    // Limpiar inputs
    newWeightInput.value = '';
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    weightDateInput.value = formattedDate;
}

// Editar peso inicial
function editInitialWeight() {
    const patient = getCurrentPatient();
    if (!patient) return;
    
    const newWeight = prompt('Ingrese el nuevo peso inicial (kg):', patient.initialWeight);
    if (newWeight && !isNaN(newWeight)) {
        const weightNum = parseFloat(newWeight);
        patient.initialWeight = weightNum;
        
        // Actualizar también el registro más antiguo si existe
        if (patient.weights.length > 0) {
            const oldestWeight = patient.weights.reduce((prev, current) => 
                new Date(prev.date) < new Date(current.date) ? prev : current
            );
            oldestWeight.weight = weightNum;
        }
        
        savePatients();
        updateUI();
    }
}

// Editar fecha inicial
function editInitialDate() {
    const patient = getCurrentPatient();
    if (!patient || patient.weights.length === 0) return;
    
    const oldestWeight = patient.weights.reduce((prev, current) => 
        new Date(prev.date) < new Date(current.date) ? prev : current
    );
    
    const newDate = prompt('Ingrese la nueva fecha inicial (YYYY-MM-DD):', oldestWeight.date);
    if (newDate) {
        oldestWeight.date = newDate;
        savePatients();
        updateUI();
    }
}

// Actualizar la tabla de pesos
function updateWeightTable() {
    weightTable.innerHTML = '';
    
    const patient = getCurrentPatient();
    if (!patient || !patient.weights) return;
    
    // Ordenar por fecha (más reciente primero)
    const sortedWeights = [...patient.weights].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedWeights.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Celda de fecha editable
        const dateCell = document.createElement('td');
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = entry.date;
        dateInput.addEventListener('change', (e) => {
            entry.date = e.target.value;
            savePatients();
            updateUI();
        });
        dateCell.appendChild(dateInput);
        
        // Celda de peso editable
        const weightCell = document.createElement('td');
        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.step = '0.1';
        weightInput.value = entry.weight;
        weightInput.addEventListener('change', (e) => {
            const newWeight = parseFloat(e.target.value);
            if (!isNaN(newWeight)) {
                entry.weight = newWeight;
                savePatients();
                updateUI();
            }
        });
        weightCell.appendChild(weightInput);
        
        // Celda de IMC
        const bmiCell = document.createElement('td');
        const bmi = calculateBMI(entry.weight, patient.height);
        bmiCell.textContent = bmi.toFixed(1);
        bmiCell.className = getBmiClass(bmi);
        
        // Celda de acciones
        const actionsCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteWeightEntry(index));
        actionsCell.appendChild(deleteBtn);
        
        row.appendChild(dateCell);
        row.appendChild(weightCell);
        row.appendChild(bmiCell);
        row.appendChild(actionsCell);
        
        weightTable.appendChild(row);
    });
}

// Eliminar entrada de peso
function deleteWeightEntry(index) {
    const patient = getCurrentPatient();
    if (!patient) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar este registro de peso?')) {
        patient.weights.splice(index, 1);
        savePatients();
        updateUI();
    }
}

// Calcular IMC
function calculateBMI(weight, height) {
    // Convertir altura de cm a metros
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

// Obtener clase CSS para el IMC
function getBmiClass(bmi) {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
}

// Obtener clasificación de IMC
function getBmiClassification(bmi) {
    if (bmi < 18.5) return '(Bajo peso)';
    if (bmi < 25) return '(Normal)';
    if (bmi < 30) return '(Sobrepeso)';
    if (bmi < 35) return '(Obesidad Grado I)';
    if (bmi < 40) return '(Obesidad Grado II)';
    return '(Obesidad Grado III)';
}

// Obtener consejos de salud según IMC
function getHealthAdvice(bmi) {
    if (bmi < 18.5) {
        return 'Recomendaciones:<br><br>• Consulte a un nutricionista para un plan de aumento de peso saludable<br>• Asegure una ingesta calórica adecuada<br>• Combine proteínas, carbohidratos y grasas saludables<br>• Realice entrenamiento de fuerza para ganar masa muscular';
    } else if (bmi < 25) {
        return 'Recomendaciones:<br><br>• Mantenga sus hábitos saludables<br>• Continúe con una dieta balanceada<br>• Realice ejercicio regularmente (150 minutos semanales)<br>• Controle su peso periódicamente';
    } else if (bmi < 30) {
        return 'Recomendaciones:<br><br>• Aumente actividad física (30 minutos diarios)<br>• Modere porciones de alimentos<br>• Reduzca consumo de azúcares y grasas saturadas<br>• Incremente consumo de frutas y verduras<br>• Controle su peso semanalmente';
    } else {
        return 'Recomendaciones:<br><br>• Consulte a un profesional de salud para un plan personalizado<br>• Realice actividad física guiada<br>• Siga una dieta balanceada y controlada en calorías<br>• Establezca metas realistas de pérdida de peso<br>• Controle su progreso regularmente';
    }
}

// Calcular cambio en la última semana
function calculateWeeklyChange() {
    const patient = getCurrentPatient();
    if (!patient || !patient.weights || patient.weights.length < 2) {
        weekChangeElement.textContent = '-';
        weekChangeElement.className = '';
        return;
    }

    const latestWeight = patient.weights[0].weight;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Buscar el peso más cercano a una semana atrás
    let closestWeight = null;
    let closestDiff = Infinity;
    
    for (let i = 1; i < patient.weights.length; i++) {
        const entryDate = new Date(patient.weights[i].date);
        const diff = Math.abs(oneWeekAgo - entryDate);
        
        if (diff < closestDiff) {
            closestDiff = diff;
            closestWeight = patient.weights[i].weight;
        }
    }
    
    if (closestWeight !== null) {
        const change = latestWeight - closestWeight;
        weekChangeElement.textContent = formatWeightChange(change);
        weekChangeElement.className = getChangeClass(change);
    } else {
        weekChangeElement.textContent = '-';
        weekChangeElement.className = '';
    }
}

// Calcular promedio semanal de cambio
function calculateWeeklyAverage() {
    const patient = getCurrentPatient();
    if (!patient || !patient.weights || patient.weights.length < 2) {
        weeklyAverageElement.textContent = '-';
        weeklyAverageElement.className = '';
        return;
    }

    // Ordenar por fecha (más antiguo primero)
    const sortedWeights = [...patient.weights].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    const firstDate = new Date(sortedWeights[0].date);
    const lastDate = new Date(sortedWeights[sortedWeights.length - 1].date);
    const totalDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    const totalWeeks = totalDays / 7;
    
    if (totalWeeks > 0) {
        const totalChange = sortedWeights[sortedWeights.length - 1].weight - 
                         sortedWeights[0].weight;
        const weeklyAvg = totalChange / totalWeeks;
        
        weeklyAverageElement.textContent = formatWeightChange(weeklyAvg) + '/semana';
        weeklyAverageElement.className = getChangeClass(weeklyAvg);
    } else {
        weeklyAverageElement.textContent = '-';
        weeklyAverageElement.className = '';
    }
}

// Formatear cambio de peso
function formatWeightChange(change) {
    if (change > 0) {
        return `+${change.toFixed(1)} kg`;
    } else if (change < 0) {
        return `${change.toFixed(1)} kg`;
    } else {
        return '0 kg';
    }
}

// Obtener clase CSS para cambio de peso
function getChangeClass(change) {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
}

// Formatear fecha
function formatDate(dateString) {
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (e) {
        return dateString;
    }
}

// Actualizar gráfico
function updateChart() {
    if (weightChart) {
        weightChart.destroy();
    }
    
    const patient = getCurrentPatient();
    if (!patient || !patient.weights || patient.weights.length === 0) {
        return;
    }
    
    // Ordenar pesos por fecha (más antiguo primero para el gráfico)
    const sortedWeights = [...patient.weights].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Convertir fechas a objetos Date para el gráfico
    const dates = sortedWeights.map(entry => new Date(entry.date));
    const weights = sortedWeights.map(entry => entry.weight);
    
    const ctx = chartCanvas.getContext('2d');
    
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Peso (kg)',
                data: weights,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'dd MMM yyyy',
                        displayFormats: {
                            day: 'dd MMM'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Peso (kg)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return formatDate(context[0].label);
                        },
                        afterLabel: function(context) {
                            const patient = getCurrentPatient();
                            if (!patient) return '';
                            const weight = context.raw;
                            const bmi = calculateBMI(weight, patient.height);
                            return `IMC: ${bmi.toFixed(1)} (${getBmiClassification(bmi).replace(/[()]/g, '')})`;
                        }
                    }
                }
            }
        }
    });
}

// Actualizar consejos de salud
function updateHealthAdvice() {
    const patient = getCurrentPatient();
    
    if (!patient) {
        healthAdviceElement.innerHTML = 'Seleccione un paciente para ver recomendaciones personalizadas.';
        return;
    }
    
    if (!patient.weights || patient.weights.length === 0) {
        healthAdviceElement.innerHTML = 'Registre su primer peso para obtener recomendaciones.';
        return;
    }
    
    const currentWeight = patient.weights[0].weight;
    const bmi = calculateBMI(currentWeight, patient.height);
    
    let advice = getHealthAdvice(bmi);
    
    // Agregar consejos basados en la tendencia si hay suficientes datos
    if (patient.weights.length > 1) {
        const latestWeight = patient.weights[0].weight;
        const previousWeight = patient.weights[1].weight;
        const change = latestWeight - previousWeight;
        
        if (change < 0) {
            advice += '<br><br>¡Buen trabajo! Estás bajando de peso. ';
            if (weekChangeElement.textContent.includes('-')) {
                advice += 'El ritmo de pérdida es adecuado.';
            } else {
                advice += 'El ritmo es lento pero constante.';
            }
        } else if (change > 0) {
            advice += '<br><br>Parece que estás subiendo de peso. ';
            advice += 'Considera revisar tus hábitos alimenticios y nivel de actividad física.';
        }
    }
    
    healthAdviceElement.innerHTML = advice;
}

// Actualizar toda la interfaz
function updateUI() {
    const patient = getCurrentPatient();
    
    if (patient) {
        // Actualizar información básica del paciente
        patientNameElement.textContent = patient.name;
        patientAgeElement.textContent = patient.age;
        patientHeightElement.textContent = `${patient.height} cm`;
        initialWeightElement.textContent = `${patient.initialWeight.toFixed(1)} kg`;
        
        // Actualizar IMC si hay registros
        if (patient.weights && patient.weights.length > 0) {
            const currentWeight = patient.weights[0].weight;
            const currentBmi = calculateBMI(currentWeight, patient.height);
            
            // Mostrar IMC actual y clasificación
            currentBmiElement.textContent = currentBmi.toFixed(1);
            bmiClassificationElement.textContent = getBmiClassification(currentBmi);
            currentBmiElement.className = getBmiClass(currentBmi);
            bmiClassificationElement.className = getBmiClass(currentBmi);
            
            // Mostrar fecha inicial (la más antigua)
            const oldestWeight = patient.weights.reduce((prev, current) => 
                new Date(prev.date) < new Date(current.date) ? prev : current
            );
            initialDateElement.textContent = formatDate(oldestWeight.date);
            
            // Actualizar métricas de cambio
            calculateWeeklyChange();
            calculateWeeklyAverage();
            
            // Mostrar información de progreso hacia el siguiente IMC
            updateBmiProgressInfo(currentBmi, patient.height, currentWeight);
        } else {
            // No hay registros de peso aún
            currentBmiElement.textContent = '-';
            bmiClassificationElement.textContent = '';
            initialDateElement.textContent = '-';
            weekChangeElement.textContent = '-';
            weeklyAverageElement.textContent = '-';
        }
        
        // Actualizar tabla de pesos
        updateWeightTable();
        
        // Actualizar gráfico con escala de tiempo correcta
        updateChart();
        
        // Actualizar consejos de salud
        updateHealthAdvice();
        
        // Actualizar tabla informativa de IMC
        updateBmiInfoTable();
        
    } else {
        // Limpiar toda la interfaz si no hay paciente seleccionado
        patientNameElement.textContent = 'Seleccione un paciente';
        patientAgeElement.textContent = '-';
        patientHeightElement.textContent = '- cm';
        initialWeightElement.textContent = '- kg';
        initialDateElement.textContent = '-';
        currentBmiElement.textContent = '-';
        bmiClassificationElement.textContent = '';
        weekChangeElement.textContent = '-';
        weeklyAverageElement.textContent = '-';
        healthAdviceElement.innerHTML = 'Seleccione un paciente para ver recomendaciones personalizadas.';
        weightTable.innerHTML = '';
        document.getElementById('bmi-info-container').innerHTML = '';
        
        if (weightChart) {
            weightChart.destroy();
            weightChart = null;
        }
    }
}

// Función auxiliar para mostrar información de progreso hacia el siguiente IMC
function updateBmiProgressInfo(currentBmi, height, currentWeight) {
    const bmiCategories = [
        { name: 'Bajo peso', max: 18.5 },
        { name: 'Normal', max: 25 },
        { name: 'Sobrepeso', max: 30 },
        { name: 'Obesidad Grado I', max: 35 },
        { name: 'Obesidad Grado II', max: 40 },
        { name: 'Obesidad Grado III', max: Infinity }
    ];
    
    const currentCategoryIndex = bmiCategories.findIndex(cat => currentBmi < cat.max);
    let progressInfo = '';
    
    if (currentCategoryIndex > 0 && currentBmi > bmiCategories[1].max) {
        // Si está en sobrepeso u obesidad, mostrar cuánto necesita bajar para llegar a normal
        const targetBmi = bmiCategories[1].max - 0.1; // Justo debajo del límite superior de "Normal"
        const targetWeight = (targetBmi * Math.pow(height / 100, 2)).toFixed(1);
        const weightToLose = (currentWeight - targetWeight).toFixed(1);
        
        progressInfo = `Para IMC Normal (≤24.9): bajar ${weightToLose} kg`;
        
    } else if (currentCategoryIndex === 0) {
        // Si está en bajo peso, mostrar cuánto necesita subir para llegar a normal
        const targetBmi = bmiCategories[0].max;
        const targetWeight = (targetBmi * Math.pow(height / 100, 2)).toFixed(1);
        const weightToGain = (targetWeight - currentWeight).toFixed(1);
        
        progressInfo = `Para IMC Normal (≥18.5): subir ${weightToGain} kg`;
    }
    
    // Actualizar elemento en el DOM (asegúrate de tener un elemento con id="bmi-progress-info")
    const progressElement = document.getElementById('bmi-progress-info');
    if (progressElement) {
        progressElement.textContent = progressInfo;
        progressElement.className = currentCategoryIndex > 1 ? 'negative' : 'positive';
    }
}

// Mostrar tabla informativa de IMC
function updateBmiInfoTable() {
    const patient = getCurrentPatient();
    if (!patient || !patient.weights || patient.weights.length === 0) {
        document.getElementById('bmi-info-container').innerHTML = '';
        return;
    }

    const currentWeight = patient.weights[0].weight;
    const currentBmi = calculateBMI(currentWeight, patient.height);
    
    const bmiCategories = [
        { name: 'Bajo peso', max: 18.5 },
        { name: 'Normal', max: 25 },
        { name: 'Sobrepeso', max: 30 },
        { name: 'Obesidad Grado I', max: 35 },
        { name: 'Obesidad Grado II', max: 40 },
        { name: 'Obesidad Grado III', max: Infinity }
    ];
    
    let currentCategoryIndex = bmiCategories.findIndex(cat => currentBmi < cat.max);
    if (currentCategoryIndex === -1) currentCategoryIndex = bmiCategories.length - 1;
    
    let html = `
        <div class="bmi-info-card">
            <h3>Información de IMC</h3>
            <table class="bmi-table">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Rango IMC</th>
                        <th>Estado</th>
                        <th>Diferencia</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    bmiCategories.forEach((category, index) => {
        const isCurrent = index === currentCategoryIndex;
        let difference = '';
        
        if (isCurrent) {
            if (index > 0) {
                // Calcular cuánto falta para bajar a la categoría anterior
                const targetBmi = bmiCategories[index - 1].max - 0.1;
                const targetWeight = (targetBmi * Math.pow(patient.height / 100, 2)).toFixed(1);
                const weightDiff = (currentWeight - targetWeight).toFixed(1);
                difference = `Bajar ${weightDiff} kg para categoría ${bmiCategories[index - 1].name}`;
            } else if (index < bmiCategories.length - 1) {
                // Calcular cuánto falta para subir a la categoría siguiente
                const targetBmi = bmiCategories[index].max;
                const targetWeight = (targetBmi * Math.pow(patient.height / 100, 2)).toFixed(1);
                const weightDiff = (targetWeight - currentWeight).toFixed(1);
                difference = `Subir ${weightDiff} kg para categoría ${bmiCategories[index + 1].name}`;
            }
        }
        
        const minBmi = index === 0 ? 0 : bmiCategories[index - 1].max;
        const maxBmi = category.max === Infinity ? '∞' : category.max;
        
        html += `
            <tr class="${isCurrent ? 'current-category' : ''}">
                <td>${category.name}</td>
                <td>${minBmi.toFixed(1)} - ${maxBmi}</td>
                <td>${isCurrent ? 'Actual' : ''}</td>
                <td>${isCurrent ? difference : ''}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('bmi-info-container').innerHTML = html;
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);