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

// Actualizar estado visual del semáforo
function actualizarEstado(estado) {
    document.getElementById('rojo').classList.toggle('activo', estado.rojo === "ON");
    document.getElementById('amarillo').classList.toggle('activo', estado.amarillo === "ON");
    document.getElementById('verde').classList.toggle('activo', estado.verde === "ON");
}

// Escuchar cambios en el estado del semáforo
semaforoRef.on('value', (snapshot) => {
    const data = snapshot.val() || {rojo:"OFF", amarillo:"OFF", verde:"OFF"};
    actualizarEstado(data);
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