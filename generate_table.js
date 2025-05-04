async function GetFileData() {
    const url = 'https://raw.githubusercontent.com/salazure/order-system/main/items.txt'
    const response = await fetch(url);
    const rawdata = await response.text();
    //console.log(rawdata);

    const datasplit = rawdata.split("\r\n");

    for (var i = 0; i < datasplit.length; i++) {
        //console.log(datasplit[i].length);
        if (datasplit[i].length != 0) {
            datasplit[i] = datasplit[i].split(":").map(function(item) {
                return item.trim();
            });
        } 
        else {
            datasplit.splice(i, 1);
        }
    }
    //console.log(datasplit);

    return datasplit;
}

async function CreateTable() {
    let famdiv = document.getElementById("wilsus");
    const body = document.body, 
        tbl = document.createElement("table");

    tbl.class = "producttable";

    const headingtr = tbl.insertRow();
    const headings = [ "ITEMS", "COST PER PIECE", "AMOUNT REQUIRED", "TOTAL BITES", "TOTAL COST" ];
    for (let i = 0; i < headings.length; i++) {
        if (i == 0) { const td = headingtr.insertCell().outerHTML = "<th class=\"proditm\">" + headings[i] + "</th>"; }
        else { const td = headingtr.insertCell().outerHTML = "<th class=\"prodth\">" + headings[i] + "</th>"; }
    }

    const datasplit = await GetFileData();
    console.log(datasplit);

    let id_increment = 0;
    for (let i = 0; i < datasplit.length; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < 5; j++) {
            if (datasplit[i][j] != "HEADING") {
                if (j == 0) {
                    if (datasplit[i][j + 1] == "HEADING") {
                        const td = tr.insertCell().outerHTML = "<td class=\"itemheading\" colspan=\"5\"><b>" + datasplit[i][j] + "</b></td>";
                    }
                    else {
                        const td = tr.insertCell().outerHTML = "<td id=\"name" + id_increment + "\">" + datasplit[i][j] + "</td>";
                    }
                }
                else if (j == 1) {
                    const td = tr.insertCell().outerHTML = "<td id=\"MValue" + id_increment + "\" style=\"text-align: center\">&#36 " + datasplit[i][j] + "</td>";
                }
                else if (j == 2) {
                    const td = tr.insertCell().outerHTML = "<td><input type=\"number\" id=\"JItem" + id_increment + "\" class=\"inputentry ref" + datasplit[i][3] + "\" value=\"\" onChange=\"CalculateOnChange(" + id_increment + ");\" min=\"\" oninput=\"validity.valid||(value='');\"></td>";
                }
                else if (j == 3) {
                    const td = tr.insertCell().outerHTML = "<td id=\"IJBite" + id_increment +"\" style=\"text-align: center\" class=\"JBite" + datasplit[i][j - 1] + " bite\"></td>";
                }
                else {
                    // limit0, limit20, limit3, limitrice, limitsushi
                    if (datasplit[i][j - 1] != "HEADING") {
                        const td = tr.insertCell().outerHTML = "<td id=\"FValue" + id_increment + "\" style=\"text-align: center\" class=\"limit" + datasplit[i][j - 1] + " limit\"></td>";
                    }
                }
            }
        }

        if (datasplit[i][1] != "HEADING") {
            id_increment += 1;
        }
    }

    const totalcosttr = tbl.insertRow();
    totalcosttr.insertCell().outerHTML = "<td colspan=\"4\" style=\"text-align: right; font-size: 15px;\"><b>Total Cost:</b></td>";
    totalcosttr.insertCell().outerHTML = "<td id=\"totalcosttable\" style=\"text-align: center; font-size: 15px;\">$0.00</td>";
    
    const totalbitetr = tbl.insertRow();
    totalbitetr.insertCell().outerHTML = "<td colspan=\"4\" style=\"text-align: right; font-size: 15px;\"><b>Bites Per Person:</b></td>";
    totalbitetr.insertCell().outerHTML = "<td id=\"bitesbyperson\" style=\"text-align: center; font-size: 15px;\">0</td>";

    famdiv.appendChild(tbl);
    disableAllInput();
}