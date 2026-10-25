const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const seedrandom = require('seedrandom');
const bigInt = require('big-integer');

const app = express();
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 4545;

const FLAG = fs.readFileSync('flag.txt', 'utf-8').trim();
const TEMPLATE = fs.readFileSync('index.html', 'utf-8');
const sessions = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [id, s] of sessions) {
        if (now - s.createdAt > 10 * 60 * 1000) sessions.delete(id);
    }
}, 60 * 1000);

function isPrime(n, k = 10) {
    if (n.leq(1)) return false;
    if (n.leq(3)) return true;
    if (n.mod(2).isZero()) return false;
    let d = n.minus(1);
    while (d.mod(2).isZero()) {
        d = d.divide(2);
    }
    for (let i = 0; i < k; i++) {
        let a = bigInt.randBetween(2, n.minus(2));
        let x = a.modPow(d, n);
        if (x.eq(1) || x.eq(n.minus(1))) continue;
        let continueLoop = false;
        let tempD = d;
        while (tempD.lt(n.minus(1))) {
            x = x.modPow(2, n);
            tempD = tempD.multiply(2);
            if (x.eq(n.minus(1))) {
                continueLoop = true;
                break;
            }
        }
        if (continueLoop) continue;
        return false;
    }
    return true;
}

function generateSeededPrime(bits, seed) {
    const rng = seedrandom(seed);
    while (true) {
        let p = bigInt(1);
        for (let i = 0; i < bits; i++) {
            p = rng() > 0.5 ? p.shiftLeft(1).or(1) : p.shiftLeft(1);
        }
        p = p.or(1);
        if (isPrime(p)) {
            return p;
        }
    }
}

function generateChallenge() {
    const randomValues = Array.from(Array(7), Math.random);
    const publicValues = randomValues.slice(0, 5);
    const secretVal6 = randomValues[5];
    const secretVal7 = randomValues[6];
    const primeSeed = secretVal6.toString() + secretVal7.toString();

    const p = generateSeededPrime(256, primeSeed + "p");
    const q = generateSeededPrime(256, primeSeed + "q");

    if (p.eq(q)) return generateChallenge();

    const oracle = crypto.randomBytes(16).toString('hex');
    const N = p.multiply(q);
    const e = bigInt(65537);
    const m = bigInt.fromArray(Buffer.from(oracle, 'utf-8').toJSON().data, 256);
    const c = m.modPow(e, N);

    return { N: N.toString(), e: e.toString(), c: c.toString(), publicValues, oracle };
}

function buildChallengeHTML(sessionId, magic, N, e, c) {
    const labels = ['I', 'II', 'III', 'IV', 'V'];
    const cards = magic.map((v, i) => `
        <div class="magic-card">
            <span class="card-index">${labels[i]}</span>
            <span class="card-value">${v}</span>
        </div>`).join('');

    return `
        <div class="divider">&#x2726; I &#x2726;</div>
        <div class="section">
            <div class="section-title">&#x2735; The 5 Magic Numbers</div>
            <div class="magic-numbers">${cards}</div>
        </div>

        <div class="divider">&#x2726; II &#x2726;</div>
        <div class="section">
            <div class="section-title">&#x2735; The Sealed Prophecy</div>
            <div class="cipher-box">
                <div class="cipher-row">
                    <div class="cipher-label">The Great Seal</div>
                    <div class="cipher-value">${N}</div>
                </div>
                <div class="cipher-row">
                    <div class="cipher-label">The Key of Light</div>
                    <div class="cipher-value">${e}</div>
                </div>
                <div class="cipher-row">
                    <div class="cipher-label">The Fate of Unforseen</div>
                    <div class="cipher-value">${c}</div>
                </div>
            </div>
        </div>

        <div class="divider">&#x2726; III &#x2726;</div>
        <div class="section">
            <div class="section-title">&#x2735; Reveal Your Vision</div>
            <form method="POST" action="/submit" class="oracle-form">
                <input type="hidden" name="session" value="${sessionId}">
                <input type="text" name="answer" class="oracle-input" placeholder="Enter your vision..." autocomplete="off" required>
                <button type="submit" class="oracle-btn">&#x2735; Unseal My Fate</button>
            </form>
        </div>`;
}

function buildResultHTML(result) {
    if (result.type === 'success') {
        return `
        <div class="result success">
            <div class="result-icon">&#x2728;</div>
            <div class="result-title">The Veil Has Been Lifted</div>
            <div class="result-flag">${result.text}</div>
            <a href="/" class="retry-link">&#x2726; Request a new reading &#x2726;</a>
        </div>`;
    }
    return `
        <div class="result error">
            <div class="result-icon">&#x2620;</div>
            <div class="result-title">${result.text}</div>
            <a href="/" class="retry-link">&#x2726; Request a new reading &#x2726;</a>
        </div>`;
}

function render(challengeHTML, resultHTML) {
    return TEMPLATE
        .replace('{{CHALLENGE}}', challengeHTML || '')
        .replace('{{RESULT}}', resultHTML || '');
}

app.get('/', (req, res) => {
    const sessionId = crypto.randomBytes(16).toString('hex');
    const challenge = generateChallenge();

    sessions.set(sessionId, { oracle: challenge.oracle, createdAt: Date.now() });

    res.send(render(
        buildChallengeHTML(sessionId, challenge.publicValues, challenge.N, challenge.e, challenge.c),
        null
    ));
});

app.post('/submit', (req, res) => {
    const { session, answer } = req.body;
    const s = sessions.get(session);

    if (!s) {
        return res.send(render(null, buildResultHTML({
            type: 'error',
            text: 'Session expired or invalid. Refresh to get a new reading.'
        })));
    }

    if (answer && answer.trim() === s.oracle) {
        sessions.delete(session);
        return res.send(render(null, buildResultHTML({
            type: 'success',
            text: FLAG
        })));
    }

    return res.send(render(null, buildResultHTML({
        type: 'error',
        text: 'The stars reject your answer. Your vision is clouded.'
    })));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[+] Challenge running on port ${PORT}`);
});
