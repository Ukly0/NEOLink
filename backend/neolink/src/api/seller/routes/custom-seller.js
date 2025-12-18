module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/custom-seller/create',
            handler: 'custom-seller.create',
            config: {
                auth: false,
            }
        },
        {
            method: 'POST',
            path: '/custom-seller/active',
            handler: 'custom-seller.active',
            config: {
                auth: false,
            }
        },
    ]
}