"use strict";

const SnakeNetwork = function (weights) {
    NeuralNetwork.call(this, [15, 20, 3], weights);
}

Object.assign(SnakeNetwork.prototype, NeuralNetwork.prototype);

SnakeNetwork.prototype.getDirection = function (inputVector, currentDirection) {
    const res = this.getValue(inputVector);
    if (res[0] > res[1] && res[0] > res[2])
        return currentDirection;
    else if (res[1] > res[2])
        return new Vector2(-currentDirection.y, currentDirection.x);
    else
        return new Vector2(currentDirection.y, -currentDirection.x);
}

const lookingDirections = function (vec) {
    const left = new Vector2(-vec.y, vec.x),
        middle = vec.clone(),
        right = new Vector2(vec.y, -vec.x);

    return [
        left,
        left.add(middle),
        middle,
        right.add(middle),
        right,
    ];
}

SnakeNetwork.getInputs = function (game) {
    const input = [];
    const unitSize = new Vector2(game.size.x / game.unitSize, game.size.y / game.unitSize);
    const dir = lookingDirections(game.snake.direction);

    for (let i = 0; i < 5; i++) {
        for (let pos = game.snake.head.add(dir[i]); ; pos = pos.add(dir[i])) {
            if (game.pallet.equals(pos)) {
                input.push(1, 0, 0);//pallet
                break;
            }
            if (game.snake.body.some(x => x.equals(pos))) {
                input.push(0, 1, 0);//snake
                break;
            }
            if (pos.x < 0 || pos.x > unitSize.x - 1 || pos.y < 0 || pos.y > unitSize.y - 1) {
                input.push(0, 0, 1);//wall
                break;
            }
        }
    }

    return input;
}