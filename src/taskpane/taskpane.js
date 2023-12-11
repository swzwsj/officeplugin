/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run").onclick = run;
    // Assign event handlers and other initialization logic.
    document.getElementById("create-table").onclick = () => tryCatch(createTable);
  }
});

export async function run() {
  try {
    await Excel.run(async (context) => {
      /**
       * Insert your Excel code here
       */
      const range = context.workbook.getSelectedRange();

      // Read the range address
      range.load("address");

      // Update the fill color
      range.format.fill.color = "yellow";

      await context.sync();
      console.log(`The range address was ${range.address}.`);
    });
  } catch (error) {
    console.error(error);
  }
}

async function createTable() {
  await Excel.run(async (context) => {
    // 创建一个表格，指定起始单元格和是否有标题行
    let sheet = context.workbook.worksheets.getItem("Sheet1");
    let expensesTable = sheet.tables.add("A1:D1", true /*hasHeaders*/);
    expensesTable.name = "ExpensesTable";

    // 设置表格的标题行
    expensesTable.getHeaderRowRange().values = [
      ["Date", "Merchant", "Category", "Amount"],
    ];

    // 添加表格的数据行
    expensesTable.rows.add(null /*add rows to the end of the table*/, [
      ["1/1/2017", "The Phone Company", "Communications", "$120"],
      ["1/2/2017", "Northwind Electric Cars", "Transportation", "$142"],
      ["1/5/2017", "Best For You Organics Company", "Groceries", "$27"],
      ["1/10/2017", "Coho Vineyard", "Restaurant", "$33"],
      ["1/11/2017", "Bellows College", "Education", "$350"],
      ["1/15/2017", "Trey Research", "Other", "$135"],
      ["1/15/2017", "Best For You Organics Company", "Groceries", "$97"],
    ]);

    // 调整列的宽度和行的高度
    sheet.getUsedRange().format.autofitColumns();
    sheet.getUsedRange().format.autofitRows();

    await context.sync();
  });
}

async function tryCatch(callback) {
  try {
    await callback();
  } catch (error) {
    // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
    console.error(error);
  }
}