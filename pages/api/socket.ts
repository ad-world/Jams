
import { Server } from 'socket.io'
import type { NextApiRequest } from 'next'
import { NextApiResponseWithSocket, UpdateQueueEvent } from '@/types/socket'

const ioHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (res.socket.server.io) {
        console.log('Socket is already running.')
        res.end();
        return;
    }

    console.log('Socket is initializing...')

    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
        socket.on('queue-updated', (msg: UpdateQueueEvent) => {
            io.emit('reload-queue', msg);
        })

        socket.on('refresh-jam', (msg: UpdateQueueEvent) => {
            io.emit('refresh-jam', msg);
        })
    })

    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler