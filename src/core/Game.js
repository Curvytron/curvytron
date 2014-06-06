/**
 * Game
 */
function Game()
{
    this.canvas = document.createElement('canvas');

    document.body.appendChild(this.canvas);
    paper.setup(this.canvas);

    var path = new paper.Path(),
        start = new paper.Point(100, 100)
        end = start.add([ 200, -50 ]);

    path.strokeColor = 'black';

    path.moveTo(start);
    path.lineTo(end);
    paper.view.draw();
}