import { config} from "dotenv"
config()

export const TOKEN = {
    JWT_SECRET:process.env.JWT_SECRET_KEY
}