import {Sequelize} from "sequelize"
import {DATABASE_FILE} from "../config.js"

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DATABASE_FILE,
    logging: false
})