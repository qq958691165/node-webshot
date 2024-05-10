const fs = require("fs");
const puppeteer = require("puppeteer");

async function autoScroll(page) {
    return page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

function isRecoverableNetworkErrorMessage(err) {
    if (err instanceof Error) {
        const message = err.message;
        const re = /net::(ERR_NETWORK_CHANGED|ERR_CONNECTION_CLOSED)/;
        return re.test(message);
    }
    return false;
}

async function sleep(seconds) {
    console.log(`sleeping ${seconds} seconds`);
    await new Promise((r) => setTimeout(r, seconds * 1000));
}

async function goto(url, viewport) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-first-run",
            "--no-zygote",
            "--no-sandbox",
        ],
    });

    const page = await browser.newPage();
    await page.emulateTimezone("Asia/Shanghai");
    await page.goto(url, {
        waitUntil: "networkidle2",
    });

    if (!viewport) {
        viewport = {
            width: 1920,
            height: 0,
        }
    }
    await page.setViewport(viewport);
    await autoScroll(page);

    let path = "/tmp/example_" + genRandomString(6) + ".jpg";
    while (fs.existsSync(path)) {
        path = "/tmp/example_" + genRandomString(6) + ".jpg";
    }
    await page.screenshot({path: path, fullPage: true, type: "jpeg"});
    await browser.close();

    const buffer = fs.readFileSync(path);
    fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
        }
    });
    return buffer;
}

function genRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = async function ({url, viewport = null}) {

    if (!url) {
        url = "https://www.serverless-devs.com";
    }

    if (!url.startsWith("https://") && !url.startsWith("http://")) {
        url = "http://" + url;
    }

    console.log(`url = ${url}`);

    let interval = 1;
    const rate = 2;
    const count = 3;

    for (let i = 0; i < count; i++) {
        try {
            return await goto(url, viewport);
        } catch (err) {
            if (i < count - 1) {
                if (isRecoverableNetworkErrorMessage(err)) {
                    await sleep(interval);
                    interval = rate * interval;
                    continue;
                }
            } else {
                throw err;
            }
        }
    }
};
