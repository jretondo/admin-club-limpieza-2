const letras_mayusculas = "ABCDEFGHYJKLMNÑOPQRSTUVWXYZ"
const letras = "abcdefghyjklmnñopqrstuvwxyz"
const numeros = "0123456789"

export function seguridadClave(clave) {
    var seguridad = 0;
    if (clave.length !== 0) {
        if (tieneNumeros(clave) && tieneLetras(clave)) {
            seguridad += 30;
        }
        if (tieneMinusculas(clave) && tieneMayusculas(clave)) {
            seguridad += 30;
        }
        if (clave.length >= 3 && clave.length <= 4) {
            seguridad += 10;
        } else {
            if (clave.length >= 5 && clave.length <= 7) {
                seguridad += 30;
            } else {
                if (clave.length > 7) {
                    seguridad += 40;
                }
            }
        }
    }
    return seguridad
}

function tieneNumeros(texto) {
    for (let i = 0; i < texto.length; i++) {
        if (numeros.indexOf(texto.charAt(i), 0) !== -1) {
            return 1;
        }
    }
    return 0;
}

function tieneLetras(texto) {
    texto = texto.toLowerCase();
    for (let i = 0; i < texto.length; i++) {
        if (letras.indexOf(texto.charAt(i), 0) !== -1) {
            return 1;
        }
    }
    return 0;
}

function tieneMinusculas(texto) {
    for (let i = 0; i < texto.length; i++) {
        if (letras.indexOf(texto.charAt(i), 0) !== -1) {
            return 1;
        }
    }
    return 0;
}

function tieneMayusculas(texto) {
    for (let i = 0; i < texto.length; i++) {
        if (letras_mayusculas.indexOf(texto.charAt(i), 0) !== -1) {
            return 1;
        }
    }
    return 0;
}