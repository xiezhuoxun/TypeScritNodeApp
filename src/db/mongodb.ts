import mongoose from "mongoose";
import bluebird from "bluebird";
import autoIncrement from "mongoose-auto-increment";
import { MONGODB_URI } from "../util/secrets";

mongoose.set("useFindAndModify", false);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose.Promise = bluebird;

// connect
export const connect = () => {
    // 连接数据库
    mongoose.connect(MONGODB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // 连接错误
    mongoose.connection.on("error", error => {
        console.log("数据库连接失败!", error);
    });

    // 连接成功
    mongoose.connection.once("open", () => {
        console.log("数据库连接成功!");
    });

    // 自增 ID 初始化
    autoIncrement.initialize(mongoose.connection);

    // 返回实例
    return mongoose;
};

