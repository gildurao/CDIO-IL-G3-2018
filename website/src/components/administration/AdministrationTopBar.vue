<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div id="adminNavBar" class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" tag="li" to="/administration/orders">Orders</router-link>
          <router-link class="navbar-item" tag="li" to="/administration/prices">Prices</router-link>
        </div>
      </div>
      <div class="navbar-end">
        <a class="navbar-text">Welcome, Admin</a>
        <a class="navbar-icon">
          <i class="far fa-user-circle" style="font-size:30px"/>
        </a>
      </div>
    </nav>
    <router-view/>
  </div>
</template>


<style scoped>
.tag {
  cursor: pointer;
}

.navbar-item:hover {
  color: #0ba2db !important;
  background-color: #0ba4db47;
  border-radius: 10px;
  cursor: pointer;
}

.navbar-text {
  color: #000;
  text-align: center !important;
}

.navbar-icon {
  color: #0ba2db !important;
  margin-left: 10px;
}
</style>

<script>
export default {
  name: "AdministrationTopBar"
};
</script>
