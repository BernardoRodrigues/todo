

module.exports = (salt) => {
    return {
        hash: (value) => hash(salt, value),
        compare: (valueToCheck, realValue) => valueCompare(valueToCheck, realValue)
    }
}
