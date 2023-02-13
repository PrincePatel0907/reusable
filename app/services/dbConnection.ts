const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect("mongodb+srv://Prince:o7of6G8HtrlY0eUS@firstdemo.zof2hy1.mongodb.net/quickbookOnline", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database Connected");
}).catch((err) => {
    console.log("DB NOT CONNECTED", err);
})
