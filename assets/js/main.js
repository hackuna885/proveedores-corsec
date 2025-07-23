const Inicio = { template: '<web-home></web-home>' }
const Web_dashBoard = { template: '<web-dashBoard></web-dashBoard>' }
const Web_regDoc = { template: '<web-regDoc></web-regDoc>' }
const Web_citas = { template: '<web-citas></web-citas>' }

const routes = [
  { path: '/', component: Inicio },
  { path: '/web-dashBoard', component: Web_dashBoard, meta: { requiresAuth: true } }, // se agrega "meta: { requiresAuth: true }" para cuando requiera autenticar
  { path: '/web-regDoc', component: Web_regDoc },
  { path: '/web-citas', component: Web_citas }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

// Inicia Autenticación

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Esta ruta requiere autenticación
    if (!isAuthenticated) {
      // No autenticado, redirige a la página de inicio de sesión
      next({
        path: '/',
        query: { redirect: to.fullPath }
      });
    } else {
      // Autenticado, procede
      next();
    }
  } else {
    // No requiere autenticación
    next();
  }
});
// Termina Autenticación


  
const app = Vue.createApp({
    data() {
        return {
            
        }
    }
})

