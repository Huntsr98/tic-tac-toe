import { makeAMove } from "../src"
import { Game, GameId, GamePiece, UserId, WhoseTurn, ServerResponse, Move, BrowserMove } from "../src/types"
import { utils } from "../src/update-state"

describe('index.ts', () => {

    describe('makeAMove', () => {


        const board: Move[] = [
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

        const browserBoard: BrowserMove[] = [
            {
                x: 0,
                y: 0,
                type: GamePiece.X
                // is this supposed to be userId or GamePiece?
            },
            {
                x: 1,
                y: 2,
                type: GamePiece.O
                // is this supposed to be userId or GamePiece?
            }
        ]

        const getRequestMock = () => {
            return {
                body: {
                    userId: '12345' as UserId,
                    gameId: '56789' as GameId,
                    move: { x: 1, y: 2 }
                }
            }
        }

        const getResponseMock = () => ({
            send: () => { }
        })

        describe('when there is a conflicting move', () => {


            it('should return conflicting move', () => {
                const requestMock = getRequestMock()
                const responseMock = getResponseMock()
    
                const game: Game = {
                    players: {
                        X: '12345' as UserId,
                        O: '23456' as UserId
                    },
                    whoseTurn: WhoseTurn.X,
                    gameId: '56789' as GameId,
                    board: board,
                    winner: null
                }
               
                const utilsFindGameSpy = jest.spyOn(utils, 'findGame')
                const utilsCheckForConflictingMove = jest.spyOn(utils, 'checkForConflictingMove')

                
                const mockConflictingMove: Move = {
                    x: 1,
                    y: 2,
                    userId: '23456' as UserId
                }

                utilsFindGameSpy.mockImplementation(() => game)
                utilsCheckForConflictingMove.mockImplementation(() => mockConflictingMove)
                makeAMove(requestMock, responseMock)

                const result = utils.checkForConflictingMove(game.board, requestMock.body.move)
                expect(result).toEqual(mockConflictingMove)

            })
            // it('should not updateState for switchWhoseTurn', () => { })
        })


        describe('when there is no conflicting move', () => {
            it('should return the right response when it is my turn', () => {
                const responseMock = getResponseMock()
                const requestMock = getRequestMock()

                // const responseSpy = jest.spyOn(responseMock, 'send')
                const utilsFindGameSpy = jest.spyOn(utils, 'findGame')
                const utilsConvertStateToResponseSpy = jest.spyOn(utils, 'convertStateToResponse')


                const game: Game = {
                    players: {
                        X: '12345' as UserId,
                        O: '23456' as UserId
                    },
                    whoseTurn: WhoseTurn.O,
                    gameId: '56789' as GameId,
                    board: board,
                    winner: null
                }

                const mockServerResponse: ServerResponse = {
                    userId: '12345' as UserId,
                    gamePiece: GamePiece.X,
                    whoseTurn: WhoseTurn.X,
                    gameId: '56789' as GameId,
                    board: browserBoard,
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
                const responseMock = getResponseMock()
                const requestMock = getRequestMock()

                // const responseSpy = jest.spyOn(responseMock, 'send')
                const utilsFindGameSpy = jest.spyOn(utils, 'findGame')
                const utilsConvertStateToResponseSpy = jest.spyOn(utils, 'convertStateToResponse')


                const game: Game = {
                    players: {
                        X: '12345' as UserId,
                        O: '23456' as UserId
                    },
                    whoseTurn: WhoseTurn.O,
                    gameId: '56789' as GameId,
                    board: board,
                    winner: null
                }

                const mockServerResponse: ServerResponse = {
                    userId: '12345' as UserId,
                    gamePiece: GamePiece.X,
                    whoseTurn: WhoseTurn.O,
                    gameId: '56789' as GameId,
                    board: browserBoard,
                    winner: null
                }

                const mockUserId: UserId = '12345' as UserId

                utilsFindGameSpy.mockImplementation(() => game)
                utilsConvertStateToResponseSpy.mockImplementation(() => mockServerResponse)
                makeAMove(requestMock, responseMock)


                const result = utils.convertStateToResponse(game, mockUserId)
                expect(result).toEqual(mockServerResponse)
            })
        })

    })
})