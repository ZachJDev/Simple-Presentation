const oscillatorController = new OscillatorController('osc-position')

document.querySelector('.add-osc-btn').addEventListener('click', () => {
    oscillatorController.insertNewOsc()
})
document.querySelector('.remove-osc-btn').addEventListener('click', () => {
    try {
        oscillatorController.removeOsc()
    } catch (e) {}

})

oscillatorController.insertNewOsc()

