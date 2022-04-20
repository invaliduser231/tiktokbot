const { Builder, By } = require('selenium-webdriver');
require('colors');
const readline = require('readline');

const readLineAsync = () => {
    const rl = readline.createInterface({
        input: process.stdin
    });

    return new Promise((resolve) => {
        rl.prompt();
        rl.on('line', (line) => {
            rl.close();
            resolve(line);
        });
    });
};

(async function bot() {
    let driver = await new Builder().forBrowser('chrome').build();
    console.log('-------------------\n1. Shares \n2. Views \n3. Likes \n4. Comments\n5. Exit \n-------------------'.yellow);
    console.log('What option do you want to select?\n'.green);
    let option = await readLineAsync();
    await driver.get('https://zefoy.com');
    let captcha = await driver.findElement(By.name('captcha_secure'));
    if (!captcha) return console.log('Please refresh the page'.red);
    if (captcha) console.log("Please fill in the captcha".underline.yellow);
    let checker = await setInterval(async function () {
        try {
            captcha = await driver.findElement(By.name('captcha_secure'));
            if (captcha) {
                console.log("Please fill in the captcha".underline.yellow);
            }
        } catch (e) {
            console.log("Captcha filled".yellow);
            clearInterval(checker);
            options(driver, option);
        }
    }, 5000);

})()

async function options(driver, option) {
    switch (option) {
        case '1':
            break;
        case '2':
            try {
                let elements = await driver.findElements(By.css('h5'));
                for (let e of elements) {
                    let text = await e.getText();
                    if (text.includes('Views')) {
                        let button = await e.findElement(By.xpath('following-sibling::button'))
                        button.click();
                        break;
                    }
                }
            } catch (e) {
                console.log('Try to delete cookies and restart the bot'.red);
            }
            await sleep(3000);
            console.log('Please enter the video url:\n'.green);
            let url = await readLineAsync();
            views(driver, url);
            break;
        case '3':
            break;
        case '4':
            break;
        case '5':
            await driver.quit();
            process.exit();
        default:
            console.log('Please select a valid option'.red);
            await driver.quit();
            process.exit();
    }
}

async function views(driver, url) {
    let elements = await driver.findElements(By.css('input[placeholder="Enter Video URL"]'));
    let text = await elements[3].getAttribute('value');
    if (text !== url) {
        await elements[3].sendKeys(url);
    }
    await elements[3].findElement(By.xpath('following-sibling::div[@class="input-group-append"]/button')).click()
    console.log('Please wait (Loading Button)'.yellow);
    await sleep(5000);
    console.log('Continuing'.yellow);
    try {
        let button = await driver.findElement(By.xpath("//button[contains(@class, 'wbutton')]"));
        let text = await button.getText();
        console.log("Your video currently has ".yellow + text.yellow + " views".yellow);
        button.click();
        try {
            console.log("Please wait (fetching success message)".yellow);
            await sleep(5000);
            console.log("Continuing".yellow);
            let text = await driver.findElement(By.xpath("//span[contains(@style, 'font-size:110%;font-weight:bold;font-family:Arial, Helvetica, sans-serif;text-align:center;color:green;')]")).getText();
            if(text === ('Successfully views sent.')){
            console.log("Views added".yellow);
            }
        } catch (e) {
            console.log(e)
            console.log("Views not added".red);
        }
    } catch (e) {
        try {
            let minutes = await driver.findElement(By.xpath("//h4[contains(@style, 'text-align:center;color:#337ab7;font-weight:bold;font-size:115%;')]")).getText().then(async function (text) {
                return text.split(' ')[2];
            });
            let seconds = await driver.findElement(By.xpath("//h4[contains(@style, 'text-align:center;color:#337ab7;font-weight:bold;font-size:115%;')]")).getText().then(async function (text) {
                return text.split(' ')[4];
            });
            console.log(`You will be able to view your video in ${minutes} minutes and ${seconds} seconds.`.yellow);
        }
        catch (e) {
            console.log('Please refresh the page'.red);
        }
    }
    setTimeout(async function () {
        views(driver, url);
    }, 20000);
}


// wait function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}