const store = new Vuex.Store({
    state: {
      titulo: ''
    },
    mutations: {

    }
})


const Inicio = { template: '<web-login></web-login>' }
const Web_home = { template: '<web-home></web-home>' }
const Web_regEst = { template: '<web-regEst></web-regEst>' }
const Web_regDoc = { template: '<web-regDoc></web-regDoc>' }
const Web_citas = { template: '<web-citas></web-citas>' }
const Web_login = { template: '<web-login></web-login>' }

const routes = [
  { path: '/', component: Inicio },
  { path: '/web-home', component: Web_home, meta: { requiresAuth: true } }, // se agrega "meta: { requiresAuth: true }" para cuando requiera autenticar
  { path: '/web-regEst', component: Web_regEst },
  { path: '/web-regDoc', component: Web_regDoc },
  { path: '/web-citas', component: Web_citas }, 
  { path: '/web-login', component: Web_login }
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
        path: '/web-login',
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