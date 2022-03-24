require('dotenv').config()

let host = ""
let publicFiles = ""
const local = 1
if (process.env.NODE_ENV === "development") {
    if (local === 1) {
        host = "http://192.168.0.11:3008/api"
        publicFiles = "http://192.168.0.11:3008/static"
    } else {
        host = "https://api-test.nekoadmin.com.ar/club-limpieza/api"
        publicFiles = "https://api-test.nekoadmin.com.ar/club-limpieza/static"
    }
} else {
    host = "https://api-prod.nekoadmin.com.ar/club-limpieza/api"
    publicFiles = "https://api-prod.nekoadmin.com.ar/club-limpieza/static"
}

const prodImages = publicFiles + "/images/products/"

const publicFolder = {
    prodImages
}

const auth = host + "/auth"
const routes = host + "/routes"
const permissions = host + "/permissions"
const ptosVta = host + "/ptosVta"
const products = host + "/products"
const proveedores = host + "/proveedores"
const clientes = host + "/clientes"
const revendedores = host + "/revendedores"
const transportistas = host + "/transportistas"
const usuarios = host + "/user"
const stock = host + "/stock"
const invoices = host + "/invoices"

const authDir = {
    auth
}

const stockDir = {
    stock,
    sub: {
        ultMov: stock + "/ultMov",
        moverStock: stock + "/moverStock",
        ultStockList: stock + "/ultStockList",
        listaStock: stock + "/listaStock"
    }
}

const usuariosDir = {
    usuarios,
    sub: {
        details: usuarios + "/details",
        mydata: usuarios + "/mydata"
    }
}

const permissionsDir = {
    permissions,
    sub: {
        list: "/list"
    }
}

const ptosVtaDir = {
    ptosVta,
    sub: {
        details: ptosVta + "/details",
        userPv: ptosVta + "/userPv"
    }
}

const productsDir = {
    products,
    sub: {
        details: products + "/details",
        variedades: products + "/varList",
        tipos: products + "/getTipos",
        marcas: products + "/getCat",
        proveedores: products + "/getGetSubCat",
        varCost: products + "/varCost",
        changePorc: products + "/changePorc",
        codBarra: products + "/codBarra",
        cost: products + "/cost"
    }
}

const proveedoresDir = {
    proveedores,
    sub: {
        details: proveedores + "/details"
    }
}

const clientesDir = {
    clientes,
    sub: {
        details: clientes + "/details",
        dataFiscal: clientes + "/dataFiscal"
    }
}

const revendedoresDir = {
    revendedores,
    sub: {
        details: clientes + "/details"
    }
}

const transportistasDir = {
    transportistas,
    sub: {
        details: clientes + "/details"
    }
}

const invoicesDir = {
    invoices,
    sub: {
        details: invoices + "/details",
        last: invoices + "/last",
        afipdata: invoices + "/afipData",
        cajaList: invoices + "/cajaList",
        cajaListPDF: invoices + "/cajaListPDF",
        factDataPDF: invoices + "/factDataPDF",
        notaCred: invoices + "/notaCred"
    }
}

const routesDir = {
    routes,
    sub: {
        dashboard: routes + "/dashboard",
        changePass: routes + "/changePass",
        clientes: routes + "/clientes",
        productos: routes + "/productos",
        proveedores: routes + "/proveedores",
        ptosVta: routes + "/ptosVta",
        revendedores: routes + "/revendedores",
        stock: routes + "/stock",
        transportistas: routes + "/transportistas",
        userAdmin: routes + "/userAdmin"
    }
}

const UrlNodeServer = {
    publicFolder,
    authDir,
    routesDir,
    permissionsDir,
    ptosVtaDir,
    productsDir,
    proveedoresDir,
    clientesDir,
    revendedoresDir,
    transportistasDir,
    usuariosDir,
    stockDir,
    invoicesDir
}

export default UrlNodeServer