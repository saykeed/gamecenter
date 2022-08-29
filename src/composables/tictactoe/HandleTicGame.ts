
import { ref } from 'vue'
import { useSocket } from '../socket/UseSocket'

const {socket} = useSocket()

const board = ref(['','','','','','','','',''])
const disabledTiles = ref<number[]>([])
const gameStatus = ref(false)
const myTurn = ref(false)
const mySymbol = ref('X')
const rematch = ref(false)
const rematchDesc = ref('')

// socket.value?.emit('position', {pos:index, symbol:mySymbol.value})

export const useTicGameHandler = () => {

    const disableAllButton = () => {
        disabledTiles.value = [0,1,2,3,4,5,6,7,8]
    }

    const tileClicked = (index:number) => {
        myTurn.value = false
        board.value[index] = mySymbol.value
        disabledTiles.value.push(index)
        let res = handleGameWin()
        if(res == '') {
            socket.value?.emit('position', {pos:index, symbol:mySymbol.value})
        } else {
            announcement(res, mySymbol.value, index)
        }
    }

    const announcement = (res:string, symbol:string, index:number) => {
        rematch.value = true
        disableAllButton()
        if(res == 'win') {
            rematchDesc.value = 'You WON!! Good job'
            socket.value?.emit('position', {pos:index, symbol:symbol})
            socket.value?.emit('tic_game_end', 'win')
        } else if (res == 'tie') {
            rematchDesc.value = 'Well Played, It\'s a TIE'
            socket.value?.emit('position', {pos:index, symbol:symbol})
            socket.value?.emit('tic_game_end', 'tie')
        }
    }

    const handleGameStart = () => {
        socket.value?.on('enableGameStart', () => {
            gameStatus.value = true
        })
    }

    const handleGameUpdate = () => {
        socket.value?.on('positionClicked', (obj:{pos:number, symbol:string}) => {
            board.value[obj.pos] = obj.symbol
            disabledTiles.value.push(obj.pos)
            myTurn.value = true
        })
    }

    const handleGameEnd = () => {
        socket.value?.on('gameEnd', (status:string) => {
            if(status == 'win') {
                rematch.value = true
                disableAllButton()
                rematchDesc.value = 'You LOST!! Well played'
            } else if(status == 'tie') {
                rematch.value = true
                disableAllButton()
                rematchDesc.value = 'Well Played, It\'s a TIE'
            }
        })
    }

    const setupFirstSocket = () => {
        socket.value?.on('enableFirstSocket', (obj:{symbol:string, turn:boolean}) => {
            mySymbol.value = obj.symbol
            myTurn.value = obj.turn
        })
    }
    

    const ifDisabled = (index:number) => {
        if(!gameStatus.value || !myTurn.value) return true
        if(disabledTiles.value.includes(index)) {
            return true
        } else {
            return false
        }
    }

    /*
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const handleGameWin = () => {
        let res:string = '';

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i]
            const a = board.value[winCondition[0]]
            const b = board.value[winCondition[1]]
            const c = board.value[winCondition[2]]

            if(a === '' || b === '' || c === '') {
                continue;
            }

            if(a === b && b === c) {
                res = 'win'
                break;
            }
        }

        if(!res) {
            if(!board.value.includes('')) {
                res = 'tie'
            }
        }

        return res
    }

    

    return { tileClicked, ifDisabled, board, rematch, rematchDesc, 
        handleGameStart, gameStatus, myTurn, handleGameUpdate, handleGameEnd,
        setupFirstSocket, mySymbol }
}