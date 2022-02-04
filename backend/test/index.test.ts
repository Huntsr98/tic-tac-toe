import { makeAMove } from "../src"

describe('index.ts', () => {

    const responseMock = {
        send: (serverResponse) => {}
    }

    it('should return the right response when it is my turn', () => {
        const responseSpy = jest.spyOn(responseMock, 'send')

        const requestMock = {
            body: {
                coordinates: {x: 1, y: 2},
                userId: '12345',
                gameId: '56789',
                isItMyTurn: true
            }
        }

        makeAMove(requestMock, responseMock)

        expect(responseSpy).toBeCalledWith({})
    })

    it('should return the right response when it is not my turn', () => {
        
        const requestMock = {
            body: {
    
            }
        }
        makeAMove(requestMock, responseMock)
    })
})