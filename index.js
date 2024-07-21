const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const readline = require('readline');
const {processData}  = require('./parser');


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function askQuestion(query) {
	return new Promise(resolve => rl.question(query, resolve));
}

// ID 입력 요청
async function getUserCredentials() {
	 try {
        // ID 입력 요청 및 대기
        const id = await askQuestion('Enter your ID: ');

        // 비밀번호 입력 요청 및 대기
        const password = await askQuestion('Enter your password: ');
		console.clear();
		console.log('=== loading... ===');

		await crawl(id, password);

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // readline 인터페이스 종료
        rl.close();
    }
}

async function crawl(myid, mypw) {
	// 가상 브라우저 실행
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();

	// 페이지로 이동
	await page.goto('https://profile.intra.42.fr/');

	// 페이지에서 html 태그 클릭
	await page.evaluate((id, pw) => {
		document.querySelector('#username').value = id;
		document.querySelector('#password').value = pw;
	}, myid, mypw);

	// 로그인 시도
	// 로그인 화면이 전환될때까지 기다린다
	// headless: false 일 때는 필요
	await Promise.all([
		page.waitForNavigation({waitUntil: 'load'}),
		page.click('#kc-login'),
	]);
	// headless: true 일 때는 불필요

	if (page.url() === 'https://profile.intra.42.fr/') {
		console.clear();
		console.log('=== login success ===');

		// intra id 받기
		while (1)
		{
			const intra_id = await askQuestion('Enter intra ID: ');

				  // 페이지 내용 가져오기
			await page.goto(`https://translate.intra.42.fr/users/${intra_id}/locations_stats.json`);
			const content = await page.content();
			const $ = cheerio.load(content);
			const data = $('pre').text();
			processData(data);
			console.log('==========');
		}

	}
	else {
		console.clear();
		console.log('login fail');
	}
	await browser.close();
};

getUserCredentials();
