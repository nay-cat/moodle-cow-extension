const button = document.getElementById('save-button');
const selectAI = document.getElementById('ai-system');
const apiKeyInput = document.getElementById('api-key');
const model = document.getElementById('api-model');
const injectButton = document.createElement('button');
const hideButton = document.getElementById('hide');
const documentFront = document.getElementById('main');
const viewButton = document.getElementById('show');
const defaultModel = "gpt-3.5-turbo";
const version = "0.0.1dev";
let isSetup = false;

const versionP = document.createElement("p");
versionP.textContent = "Version: "+version;
document.body.appendChild(versionP);


function loadSettings() {
    const savedAI = localStorage.getItem('api-system');
    const savedApiKey = localStorage.getItem('api-key');
    const savedModel = localStorage.getItem('api-model');

    if (savedAI) {
        selectAI.value = savedAI;
        console.log("API System: "+savedAI)
    }

    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        console.log("API Key: "+savedApiKey)
    }

    if (savedModel) {
        model.value = savedModel;
    } else {
        model.value = defaultModel;
    }

    if (savedAI && savedApiKey) {
        isSetup = true;
        injectButton.textContent = "Inject";
        injectButton.id = 'inject-button';
        injectButton.className = 'button';
        injectButton.style = '--color: #ff1867;'
        injectButton.style.padding = '10px 20px';
        injectButton.style.fontSize = '16px';
        injectButton.style.marginTop = '10px';
        document.body.appendChild(injectButton);
    }
}

injectButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
        if (tabId) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: injectCode,
                args: [localStorage.getItem('api-key'), localStorage.getItem('api-model') || defaultModel] 
            });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: injectCode,
            args: [localStorage.getItem('api-key'), localStorage.getItem('api-model') || defaultModel] 
        });
    }
  });


button.addEventListener('click', function () {
    const apiKey = apiKeyInput.value.trim();
    const selectedAI = selectAI.value;
    let aiModel = model.value;
    alert('Saved settings to local storage');

    if (apiKey) {
        if (!aiModel) {
            aiModel = defaultModel;
            console.log("Default model: " + aiModel);
        }
        localStorage.setItem('api-system', selectedAI);
        localStorage.setItem('api-key', apiKey);
        localStorage.setItem('api-model', aiModel);
        console.log("Settings saved");
        console.log("AI System: " + selectedAI);
        console.log("API Key: " + apiKey);
        console.log("Model: " + aiModel);
        isSetup = true;
    } else {
        alert("API-Key??");
    }
});


function injectCode(apiKey, model) {
    async function fetchAIResponse(questionText, answerOptions) {
        const url = 'https://api.naga.ac/v1/chat/completions';
        console.log(questionText);
        console.log(answerOptions);
        function _0x6260(_0x5de0f6,_0x425d39){const _0x1dff15=_0x1dff();return _0x6260=function(_0x62603e,_0x46776a){_0x62603e=_0x62603e-0x17d;let _0x451c91=_0x1dff15[_0x62603e];return _0x451c91;},_0x6260(_0x5de0f6,_0x425d39);}const _0x13333b=_0x6260;(function(_0x21f999,_0xf386f1){const _0x34ea71=_0x6260,_0x33bada=_0x21f999();while(!![]){try{const _0x2dd18a=-parseInt(_0x34ea71(0x187))/0x1+-parseInt(_0x34ea71(0x184))/0x2*(-parseInt(_0x34ea71(0x18b))/0x3)+parseInt(_0x34ea71(0x181))/0x4+parseInt(_0x34ea71(0x185))/0x5*(parseInt(_0x34ea71(0x17e))/0x6)+parseInt(_0x34ea71(0x180))/0x7*(parseInt(_0x34ea71(0x189))/0x8)+parseInt(_0x34ea71(0x186))/0x9*(-parseInt(_0x34ea71(0x17f))/0xa)+-parseInt(_0x34ea71(0x18d))/0xb;if(_0x2dd18a===_0xf386f1)break;else _0x33bada['push'](_0x33bada['shift']());}catch(_0x5dc965){_0x33bada['push'](_0x33bada['shift']());}}}(_0x1dff,0xaaeb0));const requestBody={'model':model,'messages':[{'role':_0x13333b(0x18a),'content':_0x13333b(0x188)},{'role':_0x13333b(0x183),'content':_0x13333b(0x17d)+questionText+_0x13333b(0x182)+answerOptions[_0x13333b(0x18c)](',\x20')}]};function _0x1dff(){const _0x3ae44b=['Te\x20daré\x20una\x20pregunta\x20y\x20varias\x20opciones\x20de\x20respuesta.\x20Debes\x20elegir\x20la\x20opción\x20más\x20adecuada\x20basada\x20en\x20el\x20contexto\x20proporcionado','23528zHbaNQ','system','3giPCjb','join','17593972imnGKT','Pregunta:\x20','4099944ncZRGA','270vIQtKI','175MAcZAf','2340292kNhBPU','\x0aOpciones:\x20','user','2139208bLqeXd','10XLppQb','223569xvnmnU','124611eAFHOi'];_0x1dff=function(){return _0x3ae44b;};return _0x1dff();}
        const fetchWithRetry = async (retries = 1, delay = 2000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Okay!!");
                        return data.choices && data.choices.length > 0 ? data.choices[0].message.content : 'res res not found >.<';
                    } else if (response.status === 429) {
                        console.warn(`too many request, ${delay / 1000} seconds...`);
                        await new Promise(res => setTimeout(res, delay)); 
                    } else {
                        throw new Error(`Error: ${response.status}`);
                    }
                } catch (error) {
                    console.error(`fetch failed on attempt ${i + 1}:`, error);
                    if (i === retries - 1) {
                        throw error;
                    }
                    await new Promise(res => setTimeout(res, delay));
                }
            }
        };

        return await fetchWithRetry();
    }
    function _0x3846(){const _0x20e3ab=['20469XRZwES','map','198WfqXfl','2606776QUtvgI','3411YRklmf','querySelector','2150jmGIXD','357211pIGBlq','1368304QOnjzy','addEventListener','from','59202wbKpND','not\x20found','querySelectorAll','.answer\x20div[data-region=\x22answer-label\x22]','Respuestas:','3792584SpOCxg','length','includes','IA:\x20','click','forEach','log','65mIXCgS','textContent'];_0x3846=function(){return _0x20e3ab;};return _0x3846();}const _0x1994a8=_0x59fe;(function(_0x55197d,_0x49b5ff){const _0x480d07=_0x59fe,_0x2df0ee=_0x55197d();while(!![]){try{const _0x214226=-parseInt(_0x480d07(0x1cf))/0x1+-parseInt(_0x480d07(0x1ca))/0x2*(-parseInt(_0x480d07(0x1c8))/0x3)+-parseInt(_0x480d07(0x1cb))/0x4+-parseInt(_0x480d07(0x1c6))/0x5*(-parseInt(_0x480d07(0x1ba))/0x6)+parseInt(_0x480d07(0x1b7))/0x7+parseInt(_0x480d07(0x1bf))/0x8+-parseInt(_0x480d07(0x1cc))/0x9*(parseInt(_0x480d07(0x1ce))/0xa);if(_0x214226===_0x49b5ff)break;else _0x2df0ee['push'](_0x2df0ee['shift']());}catch(_0x339d3d){_0x2df0ee['push'](_0x2df0ee['shift']());}}}(_0x3846,0x5d7b7));const contentElements=document[_0x1994a8(0x1bc)]('.content');function _0x59fe(_0x2abce4,_0x104af8){const _0x384688=_0x3846();return _0x59fe=function(_0x59feeb,_0x49d99f){_0x59feeb=_0x59feeb-0x1b7;let _0x4ccf44=_0x384688[_0x59feeb];return _0x4ccf44;},_0x59fe(_0x2abce4,_0x104af8);}contentElements[_0x1994a8(0x1c4)](async(_0x2da1b9,_0xa7b1df)=>{const _0x256fc2=_0x1994a8,_0x49533a=_0x2da1b9[_0x256fc2(0x1cd)]('.qtext\x20p'),_0x1a6bb3=_0x49533a?_0x49533a['textContent']['trim']():_0x256fc2(0x1bb);console[_0x256fc2(0x1c5)]('Pregunta\x20'+(_0xa7b1df+0x1)+':\x20'+_0x1a6bb3);try{const _0x3996f8=Array[_0x256fc2(0x1b9)](_0x2da1b9[_0x256fc2(0x1bc)](_0x256fc2(0x1bd))),_0x5cb11e=_0x3996f8[_0x256fc2(0x1c9)](_0x162266=>{const _0x26d7f8=_0x256fc2,_0x5a8aff=_0x162266[_0x26d7f8(0x1cd)]('p')?_0x162266['querySelector']('p')[_0x26d7f8(0x1c7)]['trim']():_0x26d7f8(0x1bb);return _0x5a8aff;});if(_0x5cb11e[_0x256fc2(0x1c0)]>0x0){const _0x19b0b6=await fetchAIResponse(_0x1a6bb3,_0x5cb11e);console['log'](_0x256fc2(0x1c2)+_0x19b0b6),console[_0x256fc2(0x1c5)](_0x256fc2(0x1be)),_0x3996f8['forEach']((_0x4cd98c,_0x54dcdd)=>{const _0x29263c=_0x256fc2,_0xa15648=_0x5cb11e[_0x54dcdd];console['log'](String['fromCharCode'](0x61+_0x54dcdd)+'.\x20'+_0xa15648),_0x4cd98c[_0x29263c(0x1b8)]('mouseover',()=>{const _0x455801=_0x29263c;_0x19b0b6[_0x455801(0x1c1)](_0xa15648)&&_0x4cd98c[_0x455801(0x1c3)]();});});}}catch(_0x1ce409){console['error']('Failed\x20to\x20fetch\x20AI\x20response:',_0x1ce409);}});
}



loadSettings();
console.log(isSetup);
