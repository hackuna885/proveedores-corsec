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
                // Redireccionar a la ruta original o a web-home
                if (redirectUrl) {
                  window.location = redirectUrl;
                } else {
                  window.location = "/proveedores-corsec/#/web-home";
                }
              },
            });
          } else {
            this.datos = response.data;
            // console.log(response.data)
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
      const redirectTo = this.redirectUrl || "/proveedores-corsec/#/web-home";
      window.location = redirectTo;
    }
  },
  mounted() { },
});

app.component("web-home", {
  template: /*html*/ `
<aside class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2  bg-white my-2" id="sidenav-main">
    <div class="sidenav-header">
      <i class="fas fa-times p-3 cursor-pointer text-dark opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <a class="navbar-brand px-4 py-3 m-0" href="#" target="_blank">
        <img src="assets/img/logoCorsecTech.png" class="navbar-brand-img" width="26" height="26" alt="main_logo">
        <span class="ms-1 text-sm text-dark">Proveedores</span>
      </a>
    </div>
    <hr class="horizontal dark mt-0 mb-2">
    <div class="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active bg-gradient-dark text-white" href="#">
            <i class="material-symbols-rounded opacity-5">dashboard</i>
            <span class="nav-link-text ms-1">Tablero</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="#">
            <i class="material-symbols-rounded opacity-5">table_view</i>
            <span class="nav-link-text ms-1">Menú</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="#">
            <i class="material-symbols-rounded opacity-5">receipt_long</i>
            <span class="nav-link-text ms-1">Menú</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="#">
            <i class="material-symbols-rounded opacity-5">view_in_ar</i>
            <span class="nav-link-text ms-1">Menú</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="#">
            <i class="material-symbols-rounded opacity-5">format_textdirection_r_to_l</i>
            <span class="nav-link-text ms-1">Menú</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="#">
            <i class="material-symbols-rounded opacity-5">notifications</i>
            <span class="nav-link-text ms-1">Menú</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
    <!-- Navbar -->
    <nav class="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
      <div class="container-fluid py-1 px-3">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
            <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="javascript:;">Página</a></li>
            <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Tablero</li>
          </ol>
        </nav>
        
          <ul class="navbar-nav d-flex align-items-center  justify-content-end">
            
            <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
              <a href="javascript:;" class="nav-link text-body p-0" id="iconNavbarSidenav">
                <div class="sidenav-toggler-inner">
                  <i class="sidenav-toggler-line"></i>
                  <i class="sidenav-toggler-line"></i>
                  <i class="sidenav-toggler-line"></i>
                </div>
              </a>
            </li>
            <li class="nav-item px-3 d-flex align-items-center">
              <a href="javascript:;" class="nav-link text-body p-0">
                <i class="material-symbols-rounded fixed-plugin-button-nav">settings</i>
              </a>
            </li>
            <li class="nav-item dropdown pe-3 d-flex align-items-center">
              <a href="javascript:;" class="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="material-symbols-rounded">notifications</i>
              </a>
              <ul class="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">
                <!-- notificaciones -->
                <!-- notificaciones -->
              </ul>
            </li>
            <li class="nav-item d-flex align-items-center">
              <a href="#" class="nav-link text-body font-weight-bold px-0">
                <i class="material-symbols-rounded">account_circle</i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- End Navbar -->
    <div class="container-fluid py-2">
      <div class="row">
        <div class="ms-3">
          <h3 class="mb-0 h4 font-weight-bolder">Tablero</h3>
          <p class="mb-4">
            Estadísticas de proveedores...
          </p>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12 mb-md-0 mb-4">
          <div class="card">
            <div class="card-header pb-0">
              <div class="row">
                <div class="col-lg-6 col-7">
                  <h6>Proveedores</h6>
                  <p class="text-sm mb-0">
                    <i class="fa fa-check text-info" aria-hidden="true"></i>
                    <span class="font-weight-bold ms-1">X</span> Empresas registradas
                  </p>                  
                </div>
                <div class="col-lg-6 col-5 my-auto text-end">
                  <div class="dropdown float-lg-end pe-4">
                    <a class="cursor-pointer" id="dropdownTable" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fa fa-ellipsis-v text-secondary"></i>
                    </a>
                    <ul class="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5" aria-labelledby="dropdownTable">
                      <li><a class="dropdown-item border-radius-md" href="javascript:;">Action</a></li>
                      <li><a class="dropdown-item border-radius-md" href="javascript:;">Another action</a></li>
                      <li><a class="dropdown-item border-radius-md" href="javascript:;">Something else here</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-body px-0 pb-2">
              <div class="table-responsive">
                <table class="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Empresas</th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Usuarios</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Pagos</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Evaluación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="assets/img/small-logos/logo-xd.svg" class="avatar avatar-sm me-3" alt="xd">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">Empresa X</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-group mt-2">
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ryan Tompson">
                            <img src="assets/img/teamCorsec.jpg" alt="team1">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Romina Hadid">
                            <img src="assets/img/teamCorsec.jpg" alt="team2">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Alexander Smith">
                            <img src="assets/img/teamCorsec.jpg" alt="team3">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Jessica Doe">
                            <img src="assets/img/teamCorsec.jpg" alt="team4">
                          </a>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"> $14,000 </span>
                      </td>
                      <td class="align-middle">
                        <div class="progress-wrapper w-75 mx-auto">
                          <div class="progress-info">
                            <div class="progress-percentage">
                              <span class="text-xs font-weight-bold">60%</span>
                            </div>
                          </div>
                          <div class="progress">
                            <div class="progress-bar bg-gradient-info w-60" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="assets/img/small-logos/logo-atlassian.svg" class="avatar avatar-sm me-3" alt="atlassian">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">Empresa X</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-group mt-2">
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Romina Hadid">
                            <img src="assets/img/teamCorsec.jpg" alt="team5">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Jessica Doe">
                            <img src="assets/img/teamCorsec.jpg" alt="team6">
                          </a>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"> $3,000 </span>
                      </td>
                      <td class="align-middle">
                        <div class="progress-wrapper w-75 mx-auto">
                          <div class="progress-info">
                            <div class="progress-percentage">
                              <span class="text-xs font-weight-bold">10%</span>
                            </div>
                          </div>
                          <div class="progress">
                            <div class="progress-bar bg-gradient-info w-10" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="assets/img/small-logos/logo-slack.svg" class="avatar avatar-sm me-3" alt="team7">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">Empresa X</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-group mt-2">
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Romina Hadid">
                            <img src="assets/img/teamCorsec.jpg" alt="team8">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Jessica Doe">
                            <img src="assets/img/teamCorsec.jpg" alt="team9">
                          </a>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"> $0 </span>
                      </td>
                      <td class="align-middle">
                        <div class="progress-wrapper w-75 mx-auto">
                          <div class="progress-info">
                            <div class="progress-percentage">
                              <span class="text-xs font-weight-bold">100%</span>
                            </div>
                          </div>
                          <div class="progress">
                            <div class="progress-bar bg-gradient-success w-100" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="assets/img/small-logos/logo-spotify.svg" class="avatar avatar-sm me-3" alt="spotify">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">Empresa X</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-group mt-2">
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ryan Tompson">
                            <img src="assets/img/teamCorsec.jpg" alt="user1">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Romina Hadid">
                            <img src="assets/img/teamCorsec.jpg" alt="user2">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Alexander Smith">
                            <img src="assets/img/teamCorsec.jpg" alt="user3">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Jessica Doe">
                            <img src="assets/img/teamCorsec.jpg" alt="user4">
                          </a>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"> $20,500 </span>
                      </td>
                      <td class="align-middle">
                        <div class="progress-wrapper w-75 mx-auto">
                          <div class="progress-info">
                            <div class="progress-percentage">
                              <span class="text-xs font-weight-bold">100%</span>
                            </div>
                          </div>
                          <div class="progress">
                            <div class="progress-bar bg-gradient-success w-100" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="assets/img/small-logos/logo-jira.svg" class="avatar avatar-sm me-3" alt="jira">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">Empresa X</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-group mt-2">
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ryan Tompson">
                            <img src="assets/img/teamCorsec.jpg" alt="user5">
                          </a>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"> $500 </span>
                      </td>
                      <td class="align-middle">
                        <div class="progress-wrapper w-75 mx-auto">
                          <div class="progress-info">
                            <div class="progress-percentage">
                              <span class="text-xs font-weight-bold">25%</span>
                            </div>
                          </div>
                          <div class="progress">
                            <div class="progress-bar bg-gradient-info w-25" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="25"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="assets/img/small-logos/logo-invision.svg" class="avatar avatar-sm me-3" alt="invision">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">Empresa X</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-group mt-2">
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ryan Tompson">
                            <img src="assets/img/teamCorsec.jpg" alt="user6">
                          </a>
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Jessica Doe">
                            <img src="assets/img/teamCorsec.jpg" alt="user7">
                          </a>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"> $2,000 </span>
                      </td>
                      <td class="align-middle">
                        <div class="progress-wrapper w-75 mx-auto">
                          <div class="progress-info">
                            <div class="progress-percentage">
                              <span class="text-xs font-weight-bold">40%</span>
                            </div>
                          </div>
                          <div class="progress">
                            <div class="progress-bar bg-gradient-info w-40" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="40"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer py-4  ">
        <div class="container-fluid">
          <div class="row align-items-center justify-content-lg-between">
            <div class="col-12 my-auto">
              <div class="copyright text-center text-sm text-muted text-lg-start">
                © {{ currentYear }}
                Creado por CORSEC-TECH
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </main>
  <div class="fixed-plugin">
    <a class="fixed-plugin-button text-dark position-fixed px-3 py-2">
      <i class="material-symbols-rounded py-2">settings</i>
    </a>
    <div class="card shadow-lg">
      <div class="card-header pb-0 pt-3">
        <div class="float-start">
          <h5 class="mt-3 mb-0">Configuración</h5>
          <p>Opciones...</p>
        </div>
        <div class="float-end mt-4">
          <button class="btn btn-link text-dark p-0 fixed-plugin-close-button">
            <i class="material-symbols-rounded">clear</i>
          </button>
        </div>
        <!-- End Toggle Button -->
      </div>
      <hr class="horizontal dark my-1">
      <div class="card-body pt-sm-3 pt-0">
        <!-- Sidebar Backgrounds -->
        <div>
          <h6 class="mb-0">Configuración de Usuario</h6>
        </div>
        <!-- Navbar Fixed -->
        
        <hr class="horizontal dark my-sm-4">
        <!-- salir de sesión -->
        <button @click="logout" class="btn bg-gradient-info w-100" href="#">Salir de sesión</button>
        <!-- salir de sesión -->
      </div>
    </div>
  </div>
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