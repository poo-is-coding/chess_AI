import chess
import math,random


piece_value_ev = {
    "king": [
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-2, -3, -3, -4, -4, -3, -3, -2],
    [-1, -2, -2, -2, -2, -2, -2, -1],
    [2, 2, 0, 0, 0, 0, 2, 2],
    [2, 3, 1, 0, 0, 1, 3, 2],
    ],

    "queen": [
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-1, 0, 0.5, 0, 0, 0, 0, -1],
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
    ],
    "rook": [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.5, 1, 1, 1, 1, 1, 1, 0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "bishop": [
    [-2, -1, -1, -1, -1, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 1, 1, 0.5, 0, -1],
    [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
    [-1, 0, 1, 1, 1, 1, 0, -1],
    [-1, 1, 1, 1, 1, 1, 1, -1],
    [-1, 0.5, 0, 0, 0, 0, 0.5, -1],
    [-2, -1, -1, -1, -1, -1, -1, -2],
    ],
    "knight": [
    [-5, -4, -3, -3, -3, -3, -4, -5],
    [-4, -2, 0, 0, 0, 0, -2, -4],
    [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
    [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
    [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
    [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
    [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
    [-5, -4, -3, -3, -3, -3, -4, -5],
    ],
    "pawn": [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
    [0, 0, 0, 2.3, 2.3, 0, 0, 0],
    [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
    [0.5, 1, 1, -2.8, -2.8, 1, 1, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ],
}


def chess_board_evaluate(board_situation):
    evnum = 0
    cc_step = 0
    cc_ind = 0
    node = chess.Board(board_situation)
    if node.is_game_over():
        if node.in_checkmate():
            if node.turn == False: return 99999
            return -99999
        return 0
    for i in range(len(board_situation)):
        if board_situation[i] == " " : break
        elif board_situation[i] == "/":
            cc_step +=1
            cc_ind = 0
        elif board_situation[i] == "P":
            evnum += 10
            evnum += piece_value_ev["pawn"][cc_step][cc_ind]
            cc_ind +=1
        elif board_situation[i] == "N":
            evnum += 30
            evnum += piece_value_ev["knight"][cc_step][cc_ind]
            cc_ind +=1
        elif board_situation[i] == "B":
            evnum += 30
            evnum += piece_value_ev["bishop"][cc_step][cc_ind]
            cc_ind +=1
        elif board_situation[i] == "R":
            evnum += 50
            evnum += piece_value_ev["rook"][cc_step][cc_ind]
            cc_ind += 1
        elif board_situation[i] == "Q":
            evnum += 90
            evnum += piece_value_ev["queen"][cc_step][cc_ind]
            cc_ind+=1
        elif board_situation[i] == "K":
            evnum += 900
            evnum += piece_value_ev["king"][cc_step][cc_ind]
            cc_ind+=1
        elif board_situation[i] == "p":
            evnum -= 10
            evnum -= piece_value_ev["pawn"][7 - cc_step][7 - cc_ind]
            cc_ind +=1
        elif board_situation[i] == "n":
            evnum -= 30
            evnum -= piece_value_ev["knight"][7 - cc_step][7 - cc_ind]
            cc_ind +=1
        elif board_situation[i] == "b":
            evnum -= 30
            evnum -= piece_value_ev["bishop"][7 - cc_step][7 - cc_ind]
            cc_ind+=1
        elif board_situation[i] == "r":
            evnum -= 50
            evnum -= piece_value_ev["rook"][7 - cc_step][7 - cc_ind]
            cc_ind+=1
        elif board_situation[i] == "q":
            evnum -= 90
            evnum -= piece_value_ev["queen"][7 - cc_step][7 - cc_ind]
            cc_ind+=1
        elif board_situation[i] == "k":
            evnum -= 900
            evnum -= piece_value_ev["king"][7 - cc_step][7 - cc_ind]
            cc_ind+=1
        elif ord(board_situation[i]) >= 49 and ord(board_situation[i]) <= 57:
            cc_ind += int(board_situation[i])
    return evnum

class MCTS_node:
    def __init__(self,fen) -> None:
        self.state = chess.Board(fen)
        self.children = []
        self.parent = None
        self.nn = 0
        self.n = 0
        self.w = 0

def ucb1(node):
    return node.w / (node.n + 10 ** -10) + ( 1.8 * math.log(node.nn+math.exp(1)+10**-6) / (node.n+10**-10) ) ** 0.5 

def MCTS_select(node,gonnawin):
    if not len(node.children): return node
    if gonnawin:
        max_ucb = -math.inf
        max_ucb_child = None
        for chnode in node.children:
            curr_ucb = ucb1(chnode)
            if curr_ucb > max_ucb:
                max_ucb = curr_ucb
                max_ucb_child = chnode
        return MCTS_select(max_ucb_child,not gonnawin)
    else:
        min_ucb = math.inf
        min_ucb_child = None
        for chnode in node.children:
            curr_ucb = ucb1(chnode)
            if curr_ucb < min_ucb:
                min_ucb = curr_ucb
                min_ucb_child = chnode
        return MCTS_select(min_ucb_child,not gonnawin)

def MCTS_expand(node,player):
    if node.state.is_game_over():
        if node.state.is_checkmate():
            if node.state.turn == player:
                return ( 1, node )
            return ( -1, node )
        return ( 0, node )

    legal_move = list(node.state.legal_moves)
    for mv in legal_move:
        node.state.push(mv)
        child = MCTS_node(node.state.fen())
        child.parent = node
        node.children.append(child)
        node.state.pop()
    random_child = node.children[random.randint( 0, len(node.children)-1)]
    return ( 2, random_child )

def MCTS_rollout(node,player,step):
    if node.state.is_game_over():
        if node.state.is_checkmate():
            if node.state.turn == player:
                return 1
            return -1
        return 0
    elif step > 5:
        root_evaluate = chess_board_evaluate(Board.fen())*-1
        ev_evaluate = chess_board_evaluate(node.state.fen())*-1
        if ev_evaluate > root_evaluate: return 0.5
        elif ev_evaluate < root_evaluate: return -0.5
        else: return 0
    legal_move = list(node.state.legal_moves)
    node.state.push(legal_move[random.randint( 0, len(legal_move)-1)])
    ans = MCTS_rollout(node, player,step+1)
    node.state.pop()
    return ans

def MCTS_rollup(node,rwd):
    while node.parent != None:
        node.nn += 1
        node.n += 1
        node.w += rwd
        node = node.parent
    node.nn += 1
    node.n += 1
    node.w += rwd

def MCTS(root,iterations=2000):
    legal_move = list(root.state.legal_moves)
    if not len(root.children):
        for mv in legal_move:
            root.state.push(mv)
            child = MCTS_node(root.state.fen())
            child.parent = root
            root.children.append(child)
            root.state.pop()
    while iterations > 0:
        select_child = MCTS_select(root,True)
        expand_outcome = MCTS_expand(select_child,True)
        if expand_outcome[0] == 2: 
            rollout_outcome = MCTS_rollout(expand_outcome[1],True,0)
            MCTS_rollup(expand_outcome[1],rollout_outcome)
        else:
            MCTS_rollup(expand_outcome[1],expand_outcome[0])
        iterations -= 1
        print(iterations)

    max_ucb = -math.inf
    max_ind = -1
    for i in range(len(root.children)):
        curr_ucb = ucb1(root.children[i])
        if curr_ucb > max_ucb:
            max_ucb = curr_ucb
            max_ind = i
    return (legal_move[max_ind],max_ind)

Board = chess.Board()
kk = True
while (not Board.is_game_over()):
    print(Board)
    legal_move_list = str(Board.legal_moves)[38:-2:].split(", ")
    cc = 0
    for s in legal_move_list:
        print(cc,":"+s,end="; ")
        cc += 1
    print()

    legal_move = list(Board.legal_moves)
    ind = int(input("move: (index 0~)"))
    Board.push(legal_move[ind])
    if kk:
        root = MCTS_node(Board.fen())
        kk = False
    else:
        root = root.children[ind]
    outcome = MCTS(root,10000)
    Board.push(outcome[0])
    root = root.children[outcome[1]]
