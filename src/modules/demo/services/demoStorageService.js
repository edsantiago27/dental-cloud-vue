// src/modules/demo/services/demoStorageService.js

const DEMO_PACIENTES_KEY = 'dc_demo_pacientes';
const DEMO_AGENDA_KEY = 'dc_demo_agenda';
const DEMO_INVENTARIO_KEY = 'dc_demo_inventario';

// Datos iniciales de ejemplo
const INITIAL_PACIENTES = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@demo.com', telefono: '+56 9 1234 5678', estado: 'activo', rut: '12.345.678-9', fecha_nacimiento: '1985-05-15' },
  { id: 2, nombre: 'María González', email: 'maria@demo.com', telefono: '+56 9 8765 4321', estado: 'activo', rut: '15.222.333-k', fecha_nacimiento: '1992-08-22' },
  { id: 3, nombre: 'Roberto Sánchez', email: 'roberto@demo.com', telefono: '+56 9 5555 6666', estado: 'inactivo', rut: '10.999.888-7', fecha_nacimiento: '1970-12-01' },
  { id: 4, nombre: 'Ana María López', email: 'ana@demo.com', telefono: '+56 9 4444 3333', estado: 'activo', rut: '18.444.555-1', fecha_nacimiento: '1995-03-10' },
  { id: 5, nombre: 'Carlos Ruiz', email: 'carlos@demo.com', telefono: '+56 9 2222 1111', estado: 'activo', rut: '11.666.777-2', fecha_nacimiento: '1978-11-25' }
];

const INITIAL_INVENTARIO = [
  { id: 1, nombre: 'Guantes de Nitrilo (M)', stock: 50, stock_minimo: 10, categoria: 'Consumibles' },
  { id: 2, nombre: 'Mascarillas Quirúrgicas', stock: 5, stock_minimo: 20, categoria: 'Protección' },
  { id: 3, nombre: 'Anestesia Local 2%', stock: 120, stock_minimo: 50, categoria: 'Farmacia' },
  { id: 4, nombre: 'Eyectores de Saliva', stock: 8, stock_minimo: 15, categoria: 'Consumibles' }
];

const INITIAL_AGENDA = [
  { id: 1, paciente_id: 1, profesional: 'Dr. Soto', profesional_id: 1, fecha: new Date().toISOString().split('T')[0], hora: '09:00', motivo: 'Limpieza Dental', estado: 'confirmada', duracion: 30 },
  { id: 2, paciente_id: 2, profesional: 'Dra. Rivas', profesional_id: 2, fecha: new Date().toISOString().split('T')[0], hora: '11:00', motivo: 'Ortodoncia', estado: 'programada', duracion: 60 },
  { id: 3, paciente_id: 1, profesional: 'Dr. Soto', profesional_id: 1, fecha: new Date().toISOString().split('T')[0], hora: '15:30', motivo: 'Consulta General', estado: 'pendiente', duracion: 30 }
];

const INITIAL_PROFESIONALES = [
  { id: 1, nombre: 'Dr. Soto', especialidad: 'Odontología General' },
  { id: 2, nombre: 'Dra. Rivas', especialidad: 'Ortodoncia' }
];

export const demoStorageService = {
  getPacientes() {
    const data = localStorage.getItem(DEMO_PACIENTES_KEY);
    if (!data) {
      this.savePacientes(INITIAL_PACIENTES);
      return INITIAL_PACIENTES;
    }
    return JSON.parse(data);
  },

  savePacientes(pacientes) {
    localStorage.setItem(DEMO_PACIENTES_KEY, JSON.stringify(pacientes));
  },

  getAgenda() {
    const data = localStorage.getItem(DEMO_AGENDA_KEY);
    if (!data) {
      this.saveAgenda(INITIAL_AGENDA);
      return INITIAL_AGENDA;
    }
    return JSON.parse(data);
  },

  saveAgenda(agenda) {
    localStorage.setItem(DEMO_AGENDA_KEY, JSON.stringify(agenda));
  },

  getProfesionales() {
    return INITIAL_PROFESIONALES;
  },

  clearAll() {
    localStorage.removeItem(DEMO_PACIENTES_KEY);
    localStorage.removeItem(DEMO_AGENDA_KEY);
    localStorage.removeItem(DEMO_INVENTARIO_KEY);
  }
};
