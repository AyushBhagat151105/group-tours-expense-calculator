import 'dotenv/config'
import { env } from '@/validators/env';
import app from './app';
import http from "http"

const PORT = env.PORT ?? 8000

const httpServer = http.createServer(app)

httpServer.listen(PORT, () => console.log(`server running on ${env.BASEURL}:${PORT}`))

