const Validator = async(values, schema) => {
    try {
        const data = await schema.validateSync(values, { abortEarly: false, stripUnknown: true })
        return {
            err: false,
            data: data
        }
    } catch (err) {
        return { 
            err: true, 
            data: err.errors
        };
    }
}

module.exports = Validator