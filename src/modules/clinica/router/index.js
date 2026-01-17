export const clinicaRoutes = [
  {
    path: '/clinica',
    component: () => import('@clinica/layouts/ClinicaLayout.vue'),
    meta: { requiresAuth: true, module: 'clinica' },
    children: [
      {
        path: 'dashboard',
        name: 'clinica-dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'pacientes',
        name: 'clinica-pacientes',
        component: () => import('../views/Pacientes.vue'),
        meta: { title: 'Pacientes' }
      },
      {
  path: 'historia-clinica/:pacienteId',
  name: 'clinica-historia-clinica',
  component: () => import('../views/HistoriaClinica.vue'),
  meta: { title: 'Historia Clínica' },
  props: true
}
      // ... más rutas
    ]
  }
]
