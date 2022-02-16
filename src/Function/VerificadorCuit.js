const tipos = [20, 23, 24, 25, 26, 27, 30, 33, 34]
const valMult = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

export const verificadorCuit = (cuit) => {
    const numVerif = cuit.substring(0, 10)
    const tipoCuit = cuit.substring(0, 2)
    const digVer = parseInt(cuit.substring(10, 11))
    const largo = cuit.length
    const found = tipos.find(e => e === parseInt(tipoCuit))

    if (found === undefined) {
        return {
            isCuit: false,
            message: "Cuit erroneo. No corresponde a un tipo."
        }
    } else if (largo !== 11) {
        return {
            isCuit: false,
            message: "Cuit erroneo. El CUIT debe tener 11 digitos."
        }
    } else {
        let suma = 0

        for (let i = 0; i < numVerif.length; i++) {
            const num = numVerif.substring(i, i + 1)
            const mult = parseInt(num) * valMult[i]
            suma = suma + mult
        }

        const modulo = (suma % 11)
        const codVerCierto = 11 - modulo

        if (codVerCierto === digVer) {
            return {
                isCuit: true,
                message: "Cuit correcto."
            }
        } else {
            return {
                isCuit: false,
                message: "Cuit erroneo. Verifique el número colocado."
            }
        }
    }
} 