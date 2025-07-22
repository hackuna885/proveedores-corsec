app.component("web-login", {
  template: /*html*/ `
<main class="main-content mt-0">
  <div class="page-header align-items-start min-vh-100" style="background-image: url('assets/img/bgLogin.jpg');">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto">
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">Iniciar sesión</h4>
                <div class="row mt-3">
                  <div class="col-2 text-center ms-auto">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-facebook text-white text-lg"></i>
                    </a>
                  </div>
                  <div class="col-2 text-center px-1">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-github text-white text-lg"></i>
                    </a>
                  </div>
                  <div class="col-2 text-center me-auto">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-google text-white text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form class="text-start" @submit.prevent="revDatos">
                <div class="input-group input-group-outline my-3">
                  <label class="form-label">Correo electrónico</label>
                  <input type="email" class="form-control" v-model="nCorreo" required/>
                </div>
                <div class="form-group" v-html="datos"></div>
                <div class="input-group input-group-outline mb-3">
                  <label class="form-label">Contraseña</label>
                  <input type="password" class="form-control" v-model="passUsr" required/>
                </div>
                <div class="input-group input-group-outline mb-3">
                  <label class="form-label">Repetir contraseña</label>
                  <input type="password" class="form-control" v-model="passUsrDos" :disabled="estadoPass" required/>
                </div>
                <div :class="notificaEstadoPass" role="alert">
                  {{validaContrasena}}
                </div>
                <div class="form-check form-switch d-flex align-items-center mb-3">
                  <input class="form-check-input" type="checkbox" id="rememberMe" checked>
                  <label class="form-check-label mb-0 ms-3" for="rememberMe">Recuérdame</label>
                </div>
                <div class="text-center">
                  <button class="btn bg-gradient-dark w-100 my-4 mb-2" :disabled="this.nCorreo != '' && this.passUsr != '' && this.passUsrDos != '' && this.validaBtn === true ? this.estadoBtn = flase : this.estadoBtn = true">Iniciar sesión</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer position-absolute bottom-2 py-2 w-100">
      <div class="container">
        <div class="row align-items-center justify-content-lg-between">
          <div class="col-12 my-auto">
            <div class="copyright text-center text-sm text-white text-lg-center">
              © {{ currentYear }} 
              Creado por CORSEC-TECH
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</main>
`,
  data() {
    return {
      datos: "",
      nCorreo: "",
      passUsr: "",
      passUsrDos: "",
      msgAlert: "",
      estadoPass: true,
      notificaEstadoPass: "",
      validaBtn: false,
      estadoBtn: false,
      redirectUrl: null,
    };
  },
  computed: {
    validaContrasena() {
      this.notificaEstadoPass = "small alert alert-light text-muted";

      if (this.passUsr.length >= 6) {
        this.estadoPass = false;
        this.msgAlert =
          "La contraseña debe tener al menos seis (6) caracteres.";
        this.validaBtn = false;

        if (this.passUsrDos.length >= 6) {
          if (this.passUsr === this.passUsrDos) {
            this.notificaEstadoPass = "small alert alert-success text-white";
            this.msgAlert = "Contraseña valida.";
            this.validaBtn = true;
          } else {
            this.notificaEstadoPass = "small alert alert-danger";
            this.msgAlert = "¡Error! Las contraseñas no coinciden.";
            this.validaBtn = false;
          }
        } else {
          this.estadoPass = false;
          this.validaBtn = false;
        }
      } else {
        this.msgAlert =
          "La contraseña debe tener al menos seis (6) caracteres.";

        if (this.passUsrDos != "") {
          this.estadoPass = false;
          this.validaBtn = false;
        } else {
          this.estadoPass = true;
          this.validaBtn = false;
        }
      }

      return this.msgAlert;
    },
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    revDatos() {
      axios
        .post("../proveedores-corsec/verifica/verifica.app", {
          opcion: 1,
          nCorreo: this.nCorreo,
          passUsr: this.passUsr,
        })
        .then((response) => {
          if (response.data === "correcto") {
            // Guardar estado de autenticación
            localStorage.setItem("isAuthenticated", "true");

            Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              showConfirmButton: false,
              timer: 2000,
              onClose: () => {
                // Obtener la URL de redirección si existe
                const redirectUrl = new URLSearchParams(
                  window.location.search
                ).get("redirect");
                // Redireccionar a la ruta original o a web-citas
                if (redirectUrl) {
                  window.location = redirectUrl;
                } else {
                  window.location = "/proveedores-corsec/#/web-citas";
                }
              },
            });
          } else {
            this.datos = response.data;
            console.log(response.data)
          }
        })
        .catch((error) => {
          console.error("Error de autenticación:", error);
          Swal.fire({
            icon: "error",
            title: "Error de inicio de sesión",
            text: "No se pudo iniciar sesión. Intente nuevamente.",
          });
        });
    },

    // ####
    checkAuth() {
      return localStorage.getItem("isAuthenticated") === "true";
    },
    // ####
  },
  created() {
    // Captura el parámetro de redirección de la URL si existe
    const urlParams = new URLSearchParams(window.location.search);
    this.redirectUrl = urlParams.get("redirect");

    // Si el usuario ya está autenticado, redirigir inmediatamente
    if (this.checkAuth()) {
      const redirectTo = this.redirectUrl || "/proveedores-corsec/#/web-citas";
      window.location = redirectTo;
    }
  },
  mounted() { },
});

app.component("web-home", {
  template: /*html*/ `
<h1>home</h1>
`,
  data() {
    return {
      datos: "",
    };
  },
  computed: {
  },
  methods: {
    logout() {
      // Eliminar el estado de autenticación
      localStorage.removeItem("isAuthenticated");

      // Redirigir a la página de inicio
      window.location = "/proveedores-corsec/#/";
    },

  },
  created() {
  },
  mounted() { },
});