function autospoilers() {
//Reproduced under the MIT license
ui.notification.showOnce("Note: spoiler arming key has now changed to Z.")

geofs.aircraft.instance.animationValue.spoilerArming = 0

controls.setters.setSpoilerArming = {
    label: "Spoiler Arming",
    set: function () {
        if (!geofs.aircraft.instance.groundContact && controls.airbrakes.position === 0){
        geofs.aircraft.instance.animationValue.spoilerArming = 1
        }
    },
};

controls.setters.setAirbrakes= {
    label: "Air Brakes",
    set: function () {
        controls.airbrakes.target = 0 == controls.airbrakes.target ? 1 : 0;
        controls.setPartAnimationDelta(controls.airbrakes);
        geofs.aircraft.instance.animationValue.spoilerArming = 0
    },
}

instruments.definitions.spoilers.overlay.overlays[3] = {
    anchor: { x: 0, y: 0 },
    size: { x: 50, y: 50 },
    position: { x: 0, y: 0 },
    animations: [{ type: "show", value: "spoilerArming", when: [1] }],
    class: "control-pad-dyn-label green-pad",
    text: "SPLR<br/>ARM",
    drawOrder: 1
};

instruments.init(geofs.aircraft.instance.setup.instruments)

$(document).keydown(
    function (e) {
        if (e.which == 90){ //spoiler arming key is "z"
            controls.setters.setSpoilerArming.set()
        }
    }
)

setInterval(
    function(){
        if(geofs.aircraft.instance.animationValue.spoilerArming === 1 && geofs.aircraft.instance.groundContact && controls.airbrakes.position === 0){
            controls.setters.setAirbrakes.set();
            geofs.aircraft.instance.animationValue.spoilerArming = 0;
        }
    },
100)

setInterval(
    function(){
        if(["3292", "3054"].includes(geofs.aircraft.instance.id) && geofs.aircraft.instance.setup.instruments["spoilers"] === undefined){
            geofs.aircraft.instance.setup.instruments["spoilers"] = "";
            instruments.init(geofs.aircraft.instance.setup.instruments);
        }
    },
500)
