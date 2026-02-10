document.addEventListener("keydown", event => {
    if (ponggame.players[0].state == 'idle') {
        if (event.key === "w") { ponggame.players[0].direction = -1; ponggame.players[0].dy = -5; }
        if (event.key === "s") { ponggame.players[0].direction = 1; ponggame.players[0].dy = 5; }
    }
    ponggame.handle_input(event.key)
});
document.addEventListener("keyup", event => {
    if (ponggame.players[0].state == 'idle') {
        if (event.key === "w") ponggame.players[0].dy = 0;
        if (event.key === "s") ponggame.players[0].dy = 0;
    }
});

canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    ponggame.players[0].y = touch.clientY - ponggame.players[0].height;
})
canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    ponggame.players[0].y = touch.clientY - ponggame.players[0].height;
})
document.getElementById('up').addEventListener("touchstart", function (e) {
    e.preventDefault();
    ponggame.players[0].dy = -5
})
document.getElementById('up').addEventListener("touchend", function (e) {
    e.preventDefault();
    ponggame.players[0].dy = 0
})
document.getElementById('down').addEventListener("touchstart", function (e) {
    e.preventDefault();
    ponggame.players[0].dy = 5
})
document.getElementById('down').addEventListener("touchend", function (e) {
    e.preventDefault();
    ponggame.players[0].dy = 0
})