import VueRouter from 'vue-router'
import Home from "./components/Home.vue";
import Customizer from "./components/Customizer.vue";
import ManagementTopBar from "./components/ManagementTopBar.vue";
import AdministrationTopBar from "./components/administration/AdministrationTopBar.vue";
import ListOrders from "./components/administration/orders/ListOrders.vue";
import ListCategories from "./components/management/category/ListCategories.vue";
import ListPriceMaterials from "./components/management/price/ListPriceMaterials.vue";
import ListMaterials from "./components/management/material/ListMaterials.vue";
import ListProducts from "./components/management/product/ListProducts.vue";
import ListCustomizedProductCollections from "./components/management/customizedproductcollections/ListCustomizedProductCollections.vue";
import ListCommercialCatalogues from "./components/management/commercialcatalogue/ListCommercialCatalogues.vue";

const routes = [
    { path: "/", redirect: "/home" },
    { path: "/home", component: Home },
    { path: "/customization", component: Customizer },
    {
        path: "/management", component: ManagementTopBar, children:
            [
                { path: "categories", component: ListCategories },
                { path: "prices", component: ListPriceMaterials },
                { path: "materials", component: ListMaterials },
                { path: "products", component: ListProducts },
                { path: "collections", component: ListCustomizedProductCollections },
                { path: "catalogues", component: ListCommercialCatalogues },
                { path: "customization", component: Customizer }
            ]
    },
<<<<<<< HEAD:website/src/router.js
    { path: "*", redirect: "/home" }
];


//TODO:Handle authentication before redirecting to specific routes: https://router.vuejs.org/guide/advanced/navigation-guards.html


export const router = new VueRouter({
    routes
});
=======
    {
        path: "/administration", component: AdministrationTopBar, children: [
            { path: "orders", component: ListOrders}
        ]
    }
];
>>>>>>> development:website/src/routes.js
