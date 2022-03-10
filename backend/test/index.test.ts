import { makeAMove } from "../src"
import { Game, GameId, GamePiece, UserId, WhoseTurn, ServerResponse } from "../src/types"
import { utils } from "../src/update-state"

describe('index.ts', () => {
    const board = [
        {
            x: 0,
            y: 0,
            userId: '12345' as UserId
            // is this supposed to be userId or GamePiece?
        },
        {
            x: 1,
            y: 2,
            userId: '23456' as UserId
            // is this supposed to be userId or GamePiece?
        }
    ]

    const getRequestMock = () => {
        return {
            body: {
                userId: '12345' as UserId,
                gameId: '56789' as GameId,
                coordinates: { x: 1, y: 2 }
            }
        }
    }

    const getResponseMock = () => ({
        send: () => { }
    })

    it.only('should return the right response when it is my turn', () => {
        const responseMock = getResponseMock()
        const requestMock = getRequestMock()

        const responseSpy = jest.spyOn(responseMock, 'send')
        const utilsFindGameSpy = jest.spyOn(utils, 'findGame')
        const utilsConvertStateToResponseSpy = jest.spyOn(utils, 'convertStateToResponse')


        const game: Game = {
            players: {
                X: '12345' as UserId,
                O: '23456' as UserId
            },
            whoseTurn: WhoseTurn.O,
            gameId: '56789' as GameId,
            board,
            winner: null
        }

        const mockServerResponse: ServerResponse = {
            userId: '12345' as UserId,
            gamePiece: GamePiece.X,
            whoseTurn: WhoseTurn.X,
            gameId: '56789' as GameId,
            board,
            winner: null
        }

        const mockUserId: UserId = '12345' as UserId

        utilsFindGameSpy.mockImplementation(() => game)
        utilsConvertStateToResponseSpy.mockImplementation(() => mockServerResponse)
        makeAMove(requestMock, responseMock)


        const result = utils.convertStateToResponse(game, mockUserId)
        expect(result).toEqual(mockServerResponse)

        // convert convertStateToResponse to a method on an object so you can spy on it
        // expect(convertStateToResponse).toBeCalledWith(game, requestMock.body.userId)
        // expect(responseSpy).toBeCalledWith(convertStateToResponse(game, requestMock.body.userId))
    })

    it('should return the right response when it is not my turn', () => {
        makeAMove(getRequestMock(), getResponseMock())
    })
})