const audioCtx = new AudioContext()

const oscillators = {}; // Holds refs to all oscillators

class OscillatorController  {
    constructor(positionId) {
        this.oscCount = 0;
        this.position = document.getElementById(positionId)

    }
    insertNewOsc() {
        const markup = createNewOscMarkup(this.oscCount);
        this.position.insertAdjacentHTML('beforeend', markup);
        oscillators[this.oscCount] = new OscillatorManager(audioCtx, 440);


        // Add Required Event Handlers
        addGainInputHandler(this.oscCount);
        addHertzRangeInputHandler(this.oscCount);
        addPlayHandler(this.oscCount);
        addPlayKeyboardHandler(this.oscCount)
        addHertzNumInputHandler(this.oscCount);
        addSelectHandler(this.oscCount)

        this.oscCount++
    }

    removeOsc() {
        let prevOsc = this.oscCount - 1
        try {
            oscillators[prevOsc].removeOsc();
        } catch (e) {}
        finally {
            document.querySelector(`#osc-${prevOsc}`)
                .remove() // Fails if it doesn't exist -- count won't decrement.
            this.oscCount--;
        }

    }

}

class GainManager {
    constructor(context, val = 0.5) {
        this.gain = new GainNode(context, {gain: val})
        this.gain.connect(context.destination)
    }
    setVal(val) {
        this.gain.gain.value = val
    }
}


class OscillatorManager {
    constructor(context, freq=440, oscillator = null) {
        this.oscillator = oscillator;
        this.freq = freq;
        this.context = context;
        this.gainManager = new GainManager(this.context)
        this.type = 'square'
    }

    setType(value)  { // Changes the type of oscillator
        try {
            if(!['square', 'sawtooth', 'sine', 'triangle'].includes(value))
            {
                throw new Error('Cannot set oscillator to type ' + value)
            }
            this.type = value
            if(this.oscillator) {
                this.oscillator.type = value;
            }
        } catch (e) {
            console.log(e)
        }

}
    setFreq (value) {
        this.freq = value
        if(this.oscillator) {
            try {
                this.oscillator.frequency.setValueAtTime(this.freq, this.context.currentTime)
            } catch (e) { } //  fail silently when the text input is empty
        }
    }
    setOsc (frequency = this.freq, type = this.type) {
        this.oscillator = new OscillatorNode(audioCtx, {frequency, type})
        this.oscillator.connect(this.gainManager.gain);
        return this.oscillator
    }
    removeOsc() {
        this.oscillator.disconnect(this.gainManager.gain)
        this.oscillator = null;
    }
}
const createNewOscMarkup = (count) => {
    return `
        <div data-osccount='${count}' id="osc-${count}" class="oscillator-body">
            <input type="number" value="440" min="1" class="hertz-num"/>
            <label for="note-${count}-hertz">
            Hz
            </label>
            <input class="range-hertz" value="440" id="note-${count}-hertz" min="0" step="1" max="2400" type="range" orient="vertical"/>
            <label for="note-${count}-gain">
            Gain
            </label>
            <input class="range-gain" id="note-${count}-gain" min="0" max="1" step=".01" type="range" orient="vertical"/>
            <div role="button" aria-pressed="false" tabindex="0" class="button paused"></div>
            <label class="select-osc-label" for="osc-type${count}">Select Oscillator type:</label>
                <select class="select-osc" name="osc-type" id="osc-type-${count}">
                    <option value="square">square</option>
                    <option value="sawtooth">sawtooth</option>
                    <option value="sine">sine</option>
                    <option value="triangle">triangle</option>
                </select>
        </div>
        `
}


 ////// EVENT HANDLERS ///////

 const playPressedEvent = (target) => {
     if (audioCtx.state !== 'running') {
         audioCtx.resume()
     }
     let note = oscillators[target.parentElement.dataset.osccount]
     if (!note.oscillator) {
         note.setOsc().start();
     } else {
         note.removeOsc()
     }

     target.classList.toggle('playing')
     target.classList.toggle('paused')
 }


 const hertzRangeChangedEvent = (target) => {
     let oscCount = target.parentElement.dataset.osccount;
     oscillators[oscCount].setFreq(Number.parseInt(target.value));
     document.querySelector(`[data-osccount='${oscCount}'] .hertz-num`).value = target.value;
 }

 const hertzNumValueChangedEvent = (target) => {
     let oscCount = target.parentElement.dataset.osccount;
     oscillators[oscCount].setFreq(Number.parseInt(target.value));
     document.querySelector(`[data-osccount='${oscCount}'] .range-hertz`).value = target.value;
}


 const gainRangeChangedEvent = (target) => {
     let oscCount = target.parentElement.dataset.osccount;
     oscillators[oscCount].gainManager.setVal(Number.parseFloat(target.value));
 }

 const selectTypeChangedEvent = (target) => {
     let oscCount = target.parentElement.dataset.osccount;
     oscillators[oscCount].setType(target.value);

 }
 // Base Handler
 const addHandler = (className, type, event) => {
    return (oscCount) => {
        document.querySelector(`[data-osccount='${oscCount}'] .${className}`)
            .addEventListener(type, (e) => event(e.target))
    }
 }
// All are functions which accept an osc-count
const addPlayHandler = addHandler('button', 'click', playPressedEvent)
const addPlayKeyboardHandler = addHandler('button', 'keydown', playPressedEvent)
const addHertzRangeInputHandler = addHandler('range-hertz', 'input', hertzRangeChangedEvent)
const addGainInputHandler = addHandler('range-gain', 'input', gainRangeChangedEvent)
const addHertzNumInputHandler = addHandler('hertz-num', 'input', hertzNumValueChangedEvent)
const addSelectHandler = addHandler('select-osc', 'input', selectTypeChangedEvent)

