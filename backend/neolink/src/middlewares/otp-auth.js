module.exports = (config, { strapi }) => {
    return async (ctx, next) =>{
        const jwt = require('jsonwebtoken');
        const token = ctx.request.body.token
        //needed in case data is passed not in a standard form to automatic be parsed from strapi. If the data key is already there
        //don't override the data key because in this way you cancel the data passed from the frontend
        if(typeof ctx.request.body.data === 'undefined')
            ctx.request.body.data = {}
        
        if (!token) return ctx.unauthorized("Access denied.");
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_CUSTOM_AUTH,);
                ctx.request.body.data.email = decoded.email;
                ctx.request.body.data.user_id= decoded.user_id;
                return next();
            } catch (error) {
                ctx.unauthorized("This action is unauthorized.");
            }
    }
}
