module.exports = {
    routes: [
         {
            method: 'POST',
            path: '/custom-item/',
            handler: 'custom-item.create',
            config:{
                middlewares: ["global::otp-auth"]
            }
        },
        {
            method: 'POST',
            path: '/custom-item/interest/',
            handler: 'custom-item.interest',
            config:{
                middlewares: ["global::otp-auth"]
            }
        }
    ]
}