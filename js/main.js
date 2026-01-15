// ============================================
// VARIABLE
// ============================================
let base = document.getElementById('from');
let amount = document.getElementById('amount');
let foreign = document.getElementById('switch-to');
let btnConvert = document.getElementById('btn-convert');
let result = document.getElementById('result');
let typeCoinForeign = document.getElementById('typeCoinForeign');
let typeCoinAmount = document.getElementById('typeCoinAmount');
let amountValue = document.getElementById('amountValue');
let price = document.getElementById('salary');
let switchConin = document.getElementById('switch');
let load = document.querySelector('.icon-spin');
let saveCoin = [];
let saveData = [];
let cacheCurrence = {};
// ============================================
// TOM SELECT
// ============================================
let s1;
let s2;
setTimeout(function () {
    s1 = new TomSelect("#from", {
        maxItems: 1,
        minItems: 1,
        // allowEmptyOption: false,
        onDelete: function (values) {
            return false; 
        }
    });
    s2 = new TomSelect("#switch-to", {
        maxItems: 1,
        minItems: 1,
        onDelete: function (values) {
            return false;
        }

    });
}, 100)
// ============================================
// GET DATA FROM API
// ============================================
fetch("https://openexchangerates.org/api/currencies.json")
    .then(response => response.json())
    .then(data => {
        saveData.push(data)
        console.log(saveData)
        Object.entries(data).forEach(function ([key, value]) {
            base.innerHTML += `
            <option value="${key}" ${key.toLowerCase() == 'usd' ? 'selected' : ''}>${value}</option>
            `;
            foreign.innerHTML += `
            <option value="${key}" ${key.toLowerCase() == 'egp' ? 'selected' : ''}>${value}</option>
            `;
        })
        toCoin();
    })
    .catch(function () {
        console.log("Error Fetching")
    })

function toCoin() {
    load.style.display = 'flex';
    // console.log(base.value, foreign.value)
    if (!base.value || !foreign.value) return;
    fetch(`https://www.floatrates.com/daily/${base.value}.json`)
        .then(response => response.json())
        .then(coin => {
            cacheCurrence = { ...coin }
            load.style.display = 'none';
            dataFromObj()
            totalValue();
        }).catch(function () {
            load.style.display = 'none';
            let box = document.querySelector('.box');
            box.classList.add('error')
            box.innerHTML = `
            <div>
                <i class="fa-solid fa-circle-exclamation" style="margin-inline-end: 5px;" ></i> error in connection, please check your internet
            </div>
            <button id="rotate">Refresh <i class="fas fa-refresh"></i></button>
            `;
            rotate.addEventListener('click', function () {
                location.reload()
            })

            console.log("Error Fetching")
        })
}
// ============================================
// FUNCTOINS
// ============================================
function totalValue() {
    dataFromObj()
    price.innerHTML = `
        <div class="from-1">1 <span id="coin-now">${base.value}</span> = <span id="price-now">${saveCoin[0]}</span></div>
        <div class="to-1">1 <span id="coin-to">${foreign.value}</span> = <span id="price-to">${saveCoin[1]}</span></div>
    `
    let total = amount.value * saveCoin[0];
    result.innerHTML = total.toFixed(2);
    amountValue.innerHTML = amount.value
    typeCoinForeign.innerHTML = foreign.value;
    typeCoinAmount.innerHTML = base.value;
}

function switchValue() {
    let fromValue = s1.getValue();
    let toValue = s2.getValue();
    s1.setValue(toValue, true)
    s2.setValue(fromValue, true)
    dataFromObj()
}

function dataFromObj() {
    let keyCoin = foreign.value.toLowerCase();
    let keyCoin2 = base.value.toLowerCase();

    // console.log(keyCoin)
    if (cacheCurrence[keyCoin]) {
        let one = cacheCurrence[keyCoin].rate;
        let tow = cacheCurrence[keyCoin].inverseRate;
        saveCoin = [one, tow];
    }

}
// ============================================
// EVENTS
// ============================================
amount.addEventListener('input', function () {
    totalValue()
    dataFromObj()
})

base.addEventListener('change', function () {
    toCoin();
    // dataFromObj();
    totalValue();
})

foreign.addEventListener('change', function () {
    dataFromObj();
    totalValue();
})

switchConin.addEventListener('click', function () {
    switchValue();
    [saveCoin[0], saveCoin[1]] = [saveCoin[1], saveCoin[0]]
    totalValue()

})

