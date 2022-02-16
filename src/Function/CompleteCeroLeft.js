const CompleteCerosLeft = (number, length) => {
    const largo = parseInt(String(number).length)
    const largoNvo = parseInt(length)
    const diferencia = (largoNvo - largo)
    if (diferencia > 0) {
        return new Promise((resolve, reject) => {
            let numberStr = String(number)
            for (let i = 0; i < diferencia; i++) {
                numberStr = "0" + numberStr
            }
            resolve(numberStr)
        })
    } else {
        return diferencia
    }
}

export default CompleteCerosLeft