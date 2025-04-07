// Este archivo inicializa los datos si no existen en el localStorage
// También puede usarse para datos de prueba durante el desarrollo

// Si no hay pacientes en el localStorage, agregar algunos de ejemplo
if (!localStorage.getItem('weightTrackerPatients')) {
    const samplePatients = [
        {
            id: '1',
            name: 'Juan Pérez',
            age: 35,
            height: 175,
            initialWeight: 85.5,
            weights: [
                { date: '2023-01-01', weight: 85.5 },
                { date: '2023-02-01', weight: 83.2 },
                { date: '2023-03-01', weight: 81.8 },
                { date: '2023-04-01', weight: 80.5 },
                { date: '2023-05-01', weight: 79.0 },
                { date: '2023-06-01', weight: 78.2 }
            ]
        },
        {
            id: '2',
            name: 'María García',
            age: 28,
            height: 165,
            initialWeight: 62.0,
            weights: [
                { date: '2023-01-01', weight: 62.0 },
                { date: '2023-02-01', weight: 61.5 },
                { date: '2023-03-01', weight: 61.0 },
                { date: '2023-04-01', weight: 60.8 },
                { date: '2023-05-01', weight: 60.5 },
                { date: '2023-06-01', weight: 60.0 }
            ]
        }
    ];
    
    localStorage.setItem('weightTrackerPatients', JSON.stringify(samplePatients));
}