import { checkForDiagonalWin, checkForStraightWin, checkForWin, extractPlayersMoves } from "../src/check-for-win"
import { Move, UserId } from "../src/types"

describe('check-for-win.ts', () => {
    describe('checkExtractPlayerMoves', () => {
        const expected = [
            {
                x: 0,
                y: 0,
                userId: '1234' as UserId
            },
            {
                x: 1,
                y: 0,
                userId: '1234' as UserId
            },
            {
                x: 2,
                y: 0,
                userId: '1234' as UserId
            }
        ]
        const inputMoves: Move[] = [
            {
                x: 1,
                y: 1,
                userId: '2345' as UserId
            },
            ...expected,
            {
                x: 2,
                y: 2,
                userId: '2345' as UserId
            }
        ]
        const inputUserId: UserId = '1234' as UserId
        const result = extractPlayersMoves(inputMoves, inputUserId)
        expect(result).toEqual(expected)
    })
    describe('checkForStraightWin', () => {
        describe('horizontal', () => {
            it('should return true when there is a horizontal winner on the first row', () => {
                const playerMoves: Move[] = [
                    {
                        x: 0,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 1,
                        userId: '1234' as UserId
                    }
                ]
                const result = checkForStraightWin(playerMoves, 'horizontal')
                expect(result).toEqual(true)
            })
            it('should return true when there is a horizontal winner on the second row', () => {
                const playerMoves: Move[] = [
                    {
                        x: 0,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 2,
                        userId: '1234' as UserId
                    }
                ]
                const result = checkForStraightWin(playerMoves, 'horizontal')
                expect(result).toEqual(true)
            })
            it('should return true when there is a horizontal winner on the third row', () => {
                const playerMoves: Move[] = [
                    {
                        x: 0,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 0,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 2,
                        userId: '1234' as UserId
                    },
                ]
                const result = checkForStraightWin(playerMoves, 'horizontal')
                expect(result).toEqual(true)
            })
            it('should return false when there is no winner', () => {
                const playerMoves: Move[] = [
                    {
                        x: 0,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 0,
                        y: 0,
                        userId: '1234' as UserId
                    },
                ]
                const result = checkForStraightWin(playerMoves, 'horizontal')
                expect(result).toEqual(false)
            })
        })
        describe('vertical', () => {
            it('should return true when there is a vertical winner on the first column', () => {
                const playerMoves: Move[] = [
                    {
                        x: 0,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 0,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 0,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 1,
                        userId: '1234' as UserId
                    }
                ]
                const result = checkForStraightWin(playerMoves, 'vertical')
                expect(result).toEqual(true)
            })
            it('should return true when there is a vertical winner on the second column', () => {
                const playerMoves: Move[] = [
                    {
                        x: 1,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 0,
                        userId: '1234' as UserId
                    }
                ]
                const result = checkForStraightWin(playerMoves, 'vertical')
                expect(result).toEqual(true)
            })
            it('should return true when there is a vertical winner on the third column', () => {
                const playerMoves: Move[] = [
                    {
                        x: 2,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 0,
                        userId: '1234' as UserId
                    }
                ]
                const result = checkForStraightWin(playerMoves, 'vertical')
                expect(result).toEqual(true)
            })
            it('should return false when there is no winner', () => {
                const playerMoves: Move[] = [
                    {
                        x: 0,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 2,
                        y: 2,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 1,
                        userId: '1234' as UserId
                    },
                    {
                        x: 1,
                        y: 0,
                        userId: '1234' as UserId
                    },
                    {
                        x: 0,
                        y: 0,
                        userId: '1234' as UserId
                    },
                ]
                const result = checkForStraightWin(playerMoves, 'vertical')
                expect(result).toEqual(false)
            })
        })
    })
    describe('checkForDiagonalWin', () => {
        it('should return true when there is a upward diagonal winner', () => {
            const playerMoves: Move[] = [
                {
                    x: 2,
                    y: 0,
                    userId: '1234' as UserId
                },
                {
                    x: 1,
                    y: 1,
                    userId: '1234' as UserId
                },
                {
                    x: 0,
                    y: 2,
                    userId: '1234' as UserId
                },
                {
                    x: 1,
                    y: 2,
                    userId: '1234' as UserId
                },
                {
                    x: 2,
                    y: 1,
                    userId: '1234' as UserId
                }
            ]
            const result = checkForDiagonalWin(playerMoves)
            expect(result).toEqual(true)
        })
        it('should return true when there is a upward diagonal winner', () => {
            const playerMoves: Move[] = [
                {
                    x: 0,
                    y: 0,
                    userId: '1234' as UserId
                },
                {
                    x: 1,
                    y: 1,
                    userId: '1234' as UserId
                },
                {
                    x: 2,
                    y: 2,
                    userId: '1234' as UserId
                },
                {
                    x: 1,
                    y: 2,
                    userId: '1234' as UserId
                },
                {
                    x: 2,
                    y: 1,
                    userId: '1234' as UserId
                }
            ]
            const result = checkForDiagonalWin(playerMoves)
            expect(result).toEqual(true)
        })
        it('should return false when there is no diagonal winner', () => {
            const playerMoves: Move[] = [
                {
                    x: 0,
                    y: 1,
                    userId: '1234' as UserId
                },
                {
                    x: 1,
                    y: 1,
                    userId: '1234' as UserId
                },
                {
                    x: 2,
                    y: 2,
                    userId: '1234' as UserId
                },
                {
                    x: 1,
                    y: 2,
                    userId: '1234' as UserId
                },
                {
                    x: 2,
                    y: 1,
                    userId: '1234' as UserId
                },
                {
                    x: 0,
                    y: 2,
                    userId: '1234' as UserId
                }
            ]
            const result = checkForDiagonalWin(playerMoves)
            expect(result).toEqual(false)
        })
    })

    it('should return true when there is a winner', () => {
        const userId: UserId = '1234' as UserId
        const playerMoves: Move[] = [
            {
                x: 0,
                y: 0,
                userId: '1234' as UserId
            },
            {
                x: 1,
                y: 0,
                userId: '1234' as UserId
            },
            {
                x: 2,
                y: 0,
                userId: '1234' as UserId
            },
            {
                x: 1,
                y: 1,
                userId: '1234' as UserId
            },
            {
                x: 2,
                y: 1,
                userId: '1234' as UserId
            }
        ]
        const result = checkForWin(userId, playerMoves)
        expect(result).toEqual(true)
    })
    it('should return false when there is no winner', () => {
        const userId: UserId = '1234' as UserId
        const playerMoves: Move[] = [
            {
                x: 0,
                y: 0,
                userId: '1234' as UserId
            },
            {
                x: 1,
                y: 0,
                userId: '1234' as UserId
            },
            {
                x: 2,
                y: 2,
                userId: '1234' as UserId
            },
            {
                x: 1,
                y: 2,
                userId: '1234' as UserId
            },
        ]
        const result = checkForWin(userId, playerMoves)
        expect(result).toEqual(false)
    })
})