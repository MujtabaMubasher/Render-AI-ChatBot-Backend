import mongoose from "mongoose";
const dbConnection = async () => {
    try {
        const returnObj = await mongoose.connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.log(error);
        throw new Error("Enable to Connect to the DataBase");
    }
};
const dbDisConnect = async () => {
    try {
        await mongoose.disconnect();
    }
    catch (error) {
        console.log(error);
        throw new Error("Enable to Connect to the DataBase");
    }
};
export { dbConnection, dbDisConnect };
//# sourceMappingURL=connection.js.map