// Configuración Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "pico-w-f4dec.firebaseapp.com",
    databaseURL: "https://pico-w-f4dec-default-rtdb.firebaseio.com",
    projectId: "pico-w-f4dec",
    storageBucket: "pico-w-f4dec.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referencias a los nodos de Firebase
const semaforoRef = database.ref('semaforo');
const controlRef = database.ref('control');
const sensorRef = database.ref('sensor');

// Actualizar estado visual del semáforo
function actualizarEstado(estado) {
    document.getElementById('rojo').classList.toggle('activo', estado.rojo === "ON");
    document.getElementById('amarillo').classList.toggle('activo', estado.amarillo === "ON");
    document.getElementById('verde').classList.toggle('activo', estado.verde === "ON");
}

// Actualizar datos del sensor en la interfaz
function actualizarDatosSensor(data) {
    if (data) {
        const tempContainer = document.getElementById('temperaturaContainer');
        const tempElement = document.getElementById('temperatura');
        const humElement = document.getElementById('humedad');
        
        // Mostrar temperatura y humedad
        const temp = data.temperatura !== undefined ? Math.round(data.temperatura * 10) / 10 : '--';
        const hum = data.humedad !== undefined ? Math.round(data.humedad * 10) / 10 : '--';
        
        tempElement.textContent = `${temp}°C`;
        humElement.textContent = `${hum}%`;
        
        // Controlar ventilador animado y estilo de temperatura
        const ventilador = document.getElementById('ventilador');
        const estadoVentilador = document.getElementById('estadoVentilador');
        
        if (temp >= 30) {
            tempContainer.classList.add('alerta');
            ventilador.classList.add('girando');
            estadoVentilador.textContent = "Activado";
            estadoVentilador.classList.remove('inactivo');
            estadoVentilador.classList.add('activo');
        } else {
            tempContainer.classList.remove('alerta');
            ventilador.classList.remove('girando');
            estadoVentilador.textContent = "Inactivo";
            estadoVentilador.classList.remove('activo');
            estadoVentilador.classList.add('inactivo');
        }
    }
}

// Escuchar cambios en el estado del semáforo
semaforoRef.on('value', (snapshot) => {
    const data = snapshot.val() || {rojo:"OFF", amarillo:"OFF", verde:"OFF"};
    actualizarEstado(data);
});

// Escuchar cambios en los datos del sensor
sensorRef.on('value', (snapshot) => {
    const data = snapshot.val();
    actualizarDatosSensor(data);
});

// Control manual de luces (respuesta rápida)
function controlarLuz(luz) {
    // Cambiar a modo manual
    controlRef.set({modo: "manual"});
    
    const estado = {rojo:"OFF", amarillo:"OFF", verde:"OFF"};
    estado[luz] = "ON";
    semaforoRef.set(estado);
    
    document.getElementById('modoTexto').textContent = "Manual";
}

// Modos predefinidos con cambio rápido
function setModo(modo) {
    const estados = {
        detener: {rojo:"ON", amarillo:"OFF", verde:"OFF"},
        precaucion: {rojo:"OFF", amarillo:"ON", verde:"OFF"},
        avanzar: {rojo:"OFF", amarillo:"OFF", verde:"ON"},
        apagar: {rojo:"OFF", amarillo:"OFF", verde:"OFF"},
        automatico: {modo: "automatico"}
    };
    
    if (modo === "automatico") {
        controlRef.set(estados[modo]);
        document.getElementById('modoTexto').textContent = "Automático";
    } else {
        controlRef.set({modo: "manual"});
        semaforoRef.set(estados[modo]);
        document.getElementById('modoTexto').textContent = "Manual";
    }
}

// Mostrar el modo actual al cargar la página
controlRef.on('value', (snapshot) => {
    const data = snapshot.val() || {modo: "automatico"};
    document.getElementById('modoTexto').textContent = 
        data.modo === "automatico" ? "Automático" : "Manual";
});