const pup = require("puppeteer");
const fs = require("fs");

let finalData = [];
async function main(data) {
  let browser = await pup.launch({
    headless: true,
    defaultViewport: false,
    args: ["--start-maximized"],
  });

  if (fs.existsSync("data.json")) {
    fs.unlinkSync("data.json");
  }

  let pages = await browser.pages();
  let tab = pages[0];
  await Promise.all([
    amazon(data, await browser.newPage()),
    flipkart(data, await browser.newPage()),
    croma(data, await browser.newPage()),
    paytm(data, await browser.newPage()),
  ]);

  for (let i in finalData) {
    if (!fs.existsSync("data.json")) {
      fs.writeFileSync("data.json", "[" + JSON.stringify(finalData[i]) + ",");
    } else {
      let d = fs.readFileSync("data.json", "utf-8");
      fs.writeFileSync("data.json", d + JSON.stringify(finalData[i]) + ",");
    }
  }
  let d = fs.readFileSync("data.json", "utf-8");
  fs.writeFileSync("data.json", d.substring(0, d.length - 1) + "]");

  await browser.close();
}

async function amazon(product, tab) {
  try {
    await tab.goto("https://www.amazon.in/");
    await tab.waitForSelector("#twotabsearchtextbox", { visible: true });
    await tab.type("#twotabsearchtextbox", product);
    await tab.click(".nav-search-submit-text");
    await tab.waitForSelector(
      ".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2"
    );

    let prods = await tab.$$(
      ".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2 .a-size-medium.a-color-base.a-text-normal"
    );
    if (prods[0] == undefined) {
    finalData["amazon"] = "No data found";
      return;
    }
    let name = await tab.evaluate(function (ele) {
      return ele.textContent;
    }, prods[0]);

    let links = await tab.$$(
      ".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2 .a-link-normal.a-text-normal"
    );
    let link = await tab.evaluate(function (ele) {
      return ele.getAttribute("href");
    }, links[0]);
    link = "https://www.amazon.in" + link;

    let prices = await tab.$$(
      ".a-section.a-spacing-none.a-spacing-top-small .a-price-whole"
    );
    let price = await tab.evaluate(function (ele) {
      return ele.textContent;
    }, prices[0]);

    let ret = {
      Platform: "Amazon",
      productName: name,
      Price: price,
      Link: link,
    };
    finalData["amazon"] = ret;
    await tab.close();
  } catch (err) {
    tab.close();
    finalData["amazon"] = "No data found";
    return;
  }
}

async function flipkart(product, tab) {
  try {
    await tab.goto("https://www.flipkart.com/");
    await tab.waitForSelector("._3704LK", { visible: true });
    await tab.waitForSelector("._2KpZ6l._2doB4z", { visible: true });
    await tab.click("._2KpZ6l._2doB4z");
    await tab.type("._3704LK", product);
    await tab.keyboard.press("Enter");
    await tab.waitForSelector("._4rR01T");

    let prods = await tab.$$("._4rR01T");
    if (prods[0] == undefined) {
    finalData["flipkart"] = "No data found";

      return;
    }
    let name = await tab.evaluate(function (ele) {
      return ele.textContent;
    }, prods[0]);

    let links = await tab.$$("._1fQZEK");
    let link = await tab.evaluate(function (ele) {
      return ele.getAttribute("href");
    }, links[0]);
    link = "https://www.flipkart.com" + link;

    let prices = await tab.$$("._30jeq3._1_WHN1");
    let price = await tab.evaluate(function (ele) {
      return ele.textContent;
    }, prices[0]);

    let ret = {
      Platform: "Flipkart",
      productName: name,
      Price: price,
      Link: link,
    };
    finalData["flipkart"] = ret;
    await tab.close();
  } catch (err) {
    tab.close();
    finalData["flipkart"] = "No data found";
    return;
  }
}

async function paytm(product, tab) {
  try {
    await tab.goto("https://paytmmall.com/");
    await tab.waitForSelector("#searchInput", { visible: true });
    await tab.type("#searchInput", product);
    await tab.click(".q8lC");
    await tab.waitForSelector("._3f1M");
    await tab.keyboard.press("ArrowDown");
    await tab.keyboard.press("Enter");

    await tab.waitForSelector(".UGUy");

    let prods = await tab.$$(".UGUy");
    if (prods[0] == undefined) {
    finalData["paytm"] = "No data found";

      return;
    }
    let name = await tab.evaluate(function (ele) {
      return ele.textContent;
    }, prods[0]);

    let links = await tab.$$("._8vVO");
    let link = await tab.evaluate(function (ele) {
      return ele.getAttribute("href");
    }, links[0]);
    link = "https://paytmmall.com" + link;

    let prices = await tab.$$("._1kMS");
    let price = await tab.evaluate(function (ele) {
      return ele.textContent;
    }, prices[0]);

    let ret = {
      Platform: "Paytm Mall",
      productName: name,
      Price: price,
      Link: link,
    };
    finalData["paytm"] = ret;
    await tab.close();
  } catch (err) {
    tab.close();
    finalData["paytm"] = "No data found";

    return;
  }
}

async function croma(product, tab) {
  try {
    await tab.goto("https://www.croma.com/");
    await tab.waitForSelector("#search", { visible: true });
    await tab.type("#search", product);
    await tab.keyboard.press("Enter");

    await tab.waitForSelector(".product-title.plp-prod-title");

    let prods = await tab.$$(".product-title.plp-prod-title");
    if (prods[0] == undefined) {
    finalData["croma"] = "No data found";

      return;
    }
    let name = await tab.evaluate(function (ele) {
      return ele.textContent;
    }, prods[0]);

    let links = await tab.$$(".product-title.plp-prod-title a");
    let link = await tab.evaluate(function (ele) {
      return ele.getAttribute("href");
    }, links[0]);
    link = "https://www.croma.com" + link;

    let prices = await tab.$$(".new-price");
    let price = await tab.evaluate(function (ele) {
      return ele.textContent;
    }, prices[0]);

    let ret = {
      Platform: "Croma",
      productName: name,
      Price: price,
      Link: link,
    };
    finalData["croma"] = ret;
    await tab.close();
  } catch (err) {
    tab.close();
    finalData["croma"] = "No data found";
    return;
  }
}

let input = process.argv;
let data = "";
for (let i = 2; i < input.length; i++) {
  data += input[i] + " ";
}
main(data);
