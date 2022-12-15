// TODO: See how to use local images
/**
 *  @swagger
 *  /generate-pdf:
 *    post:
 *        tags:
 *          - Pdf generator
 *        description: Convert html template (supports Handlebars) and json to pdf
 *        produces:
 *          - application/pdf
 *        parameters:
 *
 *        requestBody:
 *          content:
 *            multipart/form-data:
 *              schema:
 *                type: object
 *                required:
 *                  - htmlTemplateFile
 *                  - jsonData
 *                properties:
 *                  htmlTemplateFile:
 *                    type: string
 *                    format: binary
 *                    required: true
 *                    description: Html template to be processed, supports Handlebars templates
 *                  jsonData:
 *                    type: string
 *                    format: binary
 *                    required: true
 *                    description: Json data to be processed
 *                  puppeteerPDFGeneratorCustomOptions:
 *                    type: object
 *                    required: false
 *                    description: A custom object with the format of puppeteer.PDFOptions used for the pdf generation instead of the default, overrides the 'curtomHeader' and 'customFooter'
 *                  customHeader:
 *                    type: string
 *                    required: false
 *                    description: A string of HTML used for the header instead of the default
 *                  customFooter:
 *                    type: string
 *                    required: false
 *                    description: A string of HTML used for the footer instead of the default
 *        responses:
 *          200:
 *            description: Successfully created
 */
const express = require("express");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const path = require("path");

const fs = require("fs");
//required if you are using handle bar helper functions
require("handlebars-helpers")();
const uuid = require("uuid-random");
const customFunctions = require("../utils/functions.js");
const app = require("express")();

app.post("/generate-pdf", (req, res, next) => {
  generatePdf(req, res);
});
app.post("/generate-pdf-from-url", (req, res, next) => {
  generatePdfFromUrl(req, res);
});
async function startBrowser() {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--allow-file-access-from-files",
      "--enable-local-file-accesses",
    ],
    headless: true,
    // headless: false,
  });
  console.log("pupper");
  const page = await browser.newPage();
  return { browser, page };
}
async function generatePdfFromUrl(req, res) {
  if (req.body.url && req.body.url.length > 0) {
    try {
      const { browser, page } = await startBrowser();
      try {
        await page.goto(req.body.url, { waitUntil: "networkidle0" });
        await page.emulateMediaType("print");
        const buffer = await page.pdf({
          format: "A4",
          width: "210mm",
          height: "297mm",
          margin: {
            top: "15mm",
            bottom: "20mm",
            right: "8mm",
            left: "8mm",
          },
          displayHeaderFooter: true,
          printBackground: true,
        });
        browser.close().then(() => {
          res
            .set({
              "Content-Type": "application/pdf",
              "Content-Length": buffer.length,
              "Content-Disposition": "attachment; filename=" + `${uuid()}.pdf`,
            })
            .send(buffer);
        });
      } catch (error) {
        res.status(422).send(error);
      }
    } catch (error) {
      res.status(422).send(error);
    }
  }
}
async function generatePdf(req, res) {
  try {
    // if (!req.files || !req.files.htmlTemplateFile) {
    //   res.status = 400;
    //   res.send({
    //     status: false,
    //     message: "Html template file not uploaded",
    //   });
    //   return;
    // } else {
    //   let filePathExtension = path.extname(req.files.htmlTemplateFile.name);
    //   if (filePathExtension !== ".html") {
    //     res.send({
    //       status: false,
    //       message: "Invalid html file uploaded",
    //     });
    //     return;
    //   }
    // }
    // if (!req.files.jsonData) {
    //   res.status = 400;
    //   res.send({
    //     status: false,
    //     message: "Json data not provided",
    //   });
    //   return;
    // } else {
    //   var filePathExtension = path.extname(req.files.jsonData.name);
    //   if (filePathExtension !== ".json") {
    //     res.send({
    //       status: false,
    //       message: "Invalid json file uploaded",
    //     });
    //     return;
    //   }
    // }

    // let file = req.files.htmlTemplateFile.data.toString();

    const filePath = await require.resolve("../templates/birthdaysReport.html");
    const file = await fs.readFileSync(filePath, "utf8");
    const fileName = `${uuid()}.pdf`;

    // const jsonData = JSON.parse(req.files.jsonData.data);
    const jsonData = req.body.jsonData;
    console.log("data");
    const options =
      // req.body.puppeteerPDFGeneratorCustomOptions? req.body.puppeteerPDFGeneratorCustomOptions:
      {
        format: "A4",
        width: "210mm",
        height: "297mm",
        margin: {
          top: "15mm",
          bottom: "15mm",
          right: "8mm",
          left: "8mm",
        },
        displayHeaderFooter: true,
        printBackground: true,
        headerTemplate: req.body.customHeader ? req.body.customHeader : "&nbsp",
        footerTemplate: req.body.customFooter
          ? req.body.customFooter
          : `<div style="margin-left:15px; margin-right:15px; border-top: 1px solid rgb(166, 166, 166); display:flex; justify-content:space-between; font-size:10px;  width:100%">
              <div style="padding-left:5px; padding-top:5px;">Pagina <span class="pageNumber"></span> de <span class="totalPages"></span></div>
              <div style="padding-right:5px; padding-top:5px;">${new Date().toLocaleString(
                "pt-BR"
              )}
              </div>
            </div>`,
      };
    try {
      handlebars.registerHelper("formatDate", customFunctions.formatDate);
      handlebars.registerHelper("formatPhone", customFunctions.formatPhone);
      const template = handlebars.compile(file);

      const html = template(jsonData);

      const { browser, page } = await startBrowser();
      await page.setJavaScriptEnabled(false);
      await page.setContent(html, {
        waitUntil: ["domcontentloaded", "load", "networkidle0"],
      });
      // await page.addStyleTag({
      //   content: `@page :first {margin-top: 20px; margin-bottom: 10px} `,
      // });
      await page.addStyleTag({
        content: `@page { margin-bottom: 10px  }`,
      });
      const buffer = await page.pdf(options);
      browser.close().then(() => {
        res
          .set({
            "Content-Type": "application/pdf",
            "Content-Length": buffer.length,
            "Content-Disposition": "attachment; filename=" + fileName,
          })
          .send(buffer);
      });
    } catch (error) {
      res.status(422).send(error);
    }
  } catch (error) {
    res.status(422).send(error);
  }
}

module.exports = app;
