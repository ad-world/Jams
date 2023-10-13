
import { Server } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import type { Server as IOServer } from 'socket.io'


export interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

export interface SocketWithIO extends NetSocket {
    server: SocketServer
}

export interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}

export interface UpdateQueueEvent {
    queueId: string
}