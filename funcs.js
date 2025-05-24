let INPUTINCREMENT = 0;
let inputs = [];

let limitlist = [0, 3, 20, 30]; //also sushi and roll

function setFocus() {
    document.getElementById("fname").focus();
}

function runinvalid() {
    submit.disabled = true;
    let element = document.getElementById("submit");
    element.className = "unable";

    
    document.getElementById("errorInitial").style.display = "none";
}


function disableAllInput() {
    const inputen = document.querySelectorAll('input.inputentry');

    for (var i = 0; i < inputen.length; i++) {
        inputen[i].disabled = true;
    }

    if (inputs.length == 0) {

        Array.from(document.getElementsByClassName("initialinputs")).forEach(
            function(element, index, array) {
                if (index != 0) {
                    inputs.push(element);
                }
            }
        );
        //console.log(inputs);
    }

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }

    document.getElementById("note").disabled = true;
    document.getElementById("colorDivDisplay").style.borderColor = "red";
    //enableAllInput();
}

function enableAllInput() {
    const inputen = document.querySelectorAll('input.inputentry');

    for (var i = 0; i < inputen.length; i++) {
        inputen[i].disabled = false;
        inputen[i].style.backgroundColor = "white";
    }
    document.getElementById("note").disabled = false;
    document.getElementById("colorDivDisplay").style.borderColor = "black";

    document.querySelectorAll('.refwdep')[0].disabled = true;
    document.querySelectorAll('.refbdep')[0].disabled = true;
}

function enableinitial() {
    var to_enable = inputs[INPUTINCREMENT - 1];
    to_enable.disabled = false;
} 

function initialincrement(stage) {
    if (stage == INPUTINCREMENT) {
        INPUTINCREMENT += 1;
        enableinitial();
    }

    for (i = 0; i < INPUTINCREMENT; i++) {
        if (inputs[i].disabled == false) {
            if (inputs[i].value != "..." && inputs[i].value != "") {
                if (i == 3 || i == 4) {
                    if (inputs[i].checkValidity()) {
                        inputs[i].style.backgroundColor = "lightgreen";
                    }
                    else {
                        inputs[i].style.backgroundColor = "lightcoral";
                    }
                }
                else {
                    inputs[i].style.backgroundColor = "lightgreen";
                }
            }
            else {
                inputs[i].style.backgroundColor = "lightcoral";
            }
        }
    }
}

function RetColVal(ID) {
    var element = document.getElementById("IJBite" + ID.toString());

    for (var i = 0; i < 9; i++) {
        if (element.classList.contains("JBite" + i.toString())) {
            return i;
        }
    }

    return 0;
}


function guestInvalid() {   
    let documentguests = document.getElementById('numberGuest');

    if (documentguests.value > 10) {
        documentguests.style.backgroundColor = "lightgreen";
    }
    else {
        documentguests.style.backgroundColor = "lightcoral";
    }
}


function CalculateOnChange(ID) {
    document.getElementById("errorMinimum").style.display = "none";
    document.getElementById("errorUnder").style.display = "none";
    document.getElementById("errorMaximum").style.display = "none";

    runinvalid();

    var amount = document.getElementById("JItem" + ID.toString()).value
    var final_val = amount * parseFloat(document.getElementById("MValue" + ID.toString()).textContent.split("$ ")[1]);
    var jbite_val = amount * RetColVal(ID);

    if (jbite_val == 0) {
        jbite_val = "";
    }

    //console.log("Current amount of this: " + amount + ", BITES: " + RetColVal(ID));
    //console.log("AMLOUNT SHOULD BE " + document.getElementById("MValue" + ID.toString()).textContent.split("$ ")[1]);
    //console.log((amount * parseFloat(document.getElementById("MValue" + ID.toString()).textContent.split("$ ")[1])));

    if (document.getElementById("FValue" + ID.toString()).classList.contains("limitwdep") || document.getElementById("FValue" + ID.toString()).classList.contains("limitbdep")) {
        final_val = final_val * document.getElementById("JItem" + (ID - 1).toString()).value;
    }
    else if (document.getElementById("FValue" + ID.toString()).classList.contains("limitwai") || document.getElementById("FValue" + ID.toString()).classList.contains("limitbar")) {
        let value = document.getElementById("JItem" + (ID + 1).toString()).value * parseFloat(document.getElementById("MValue" + (ID + 1).toString()).textContent.split("$ ")[1]) * document.getElementById("JItem" + ID.toString()).value;

        if (value != 0) {
            document.getElementById("FValue" + (ID + 1).toString()).innerHTML = "$" + value.toFixed(2);
        }
    }

    if (amount <= 0) {
        final_val = "";
        jbite_val = "";
        document.getElementById("JItem" + ID.toString()).value = "";
    }
    else {
        final_val = "$" + final_val.toFixed(2);
    }

    document.getElementById("IJBite" + ID.toString()).innerHTML = jbite_val;
    document.getElementById("FValue" + ID.toString()).innerHTML = final_val;

    CheckLimits(ID);
    
    GetNumberActiveElements(true);

    RunTotalCalcs();
    ResultSummaryGen();
}


function RunTotalCalcs() {
    let total_cost = 0;
    let total_bites = 0;

    let istotal = true;

    Array.from(document.getElementsByClassName("limit")).forEach(CollectTotals);
    istotal = false;
    Array.from(document.getElementsByClassName("bite")).forEach(CollectTotals);

    document.getElementById("totalcosttable").innerHTML = "$" + total_cost.toFixed(2);
    document.getElementById("bitesbyperson").innerHTML = (total_bites / document.getElementById('numberGuest').value).toFixed(1);

    function CollectTotals(item) {
        item = item.innerHTML;
        if (istotal && item != "") {
            const val = parseFloat(item.slice(1));
            total_cost += val;
        }
        else if (!istotal && item != "") {
            total_bites += parseInt(item);
        }
    }
}

function CheckLimits(ID) {
    let element = document.getElementById("FValue" + ID.toString());
    let amount = document.getElementById("JItem" + ID.toString());

    for (var i = 0; i < limitlist.length; i++) {
        if (element.classList.contains("limit" + limitlist[i].toString())) {
            if (amount.value >= limitlist[i]) {
                element.classList.remove("error");
                element.classList.add("success");
            }
            else {
                element.classList.remove("success");
                element.classList.add("error");
            }

            if (amount.value == 0 || amount.value == "") {
                element.classList.remove("success");
                element.classList.remove("error");
            }
            return;
        }
    }

    RunWaitBar(element, amount);
    RunSushiRice(element);
}

function GetNumberActiveElements(erroractive) {
    const elements = document.querySelectorAll('.success:not(.limit0):not(.limit30):not(.limit3):not(.limitwai):not(.limitwdep):not(.limitbar):not(.limitbdep)');
    let activecount = 0;
    let sushicounted = false;
    let rollcounted = false;

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains("limitsushi")) {
            if (!sushicounted) {
                sushicounted = true;
                activecount += 1;
            }
        }
        else if (elements[i].classList.contains("limitrice")) {
            if (!rollcounted) {
                rollcounted = true;
                activecount += 1;
            }
        }
        else {
            activecount += 1;
        }
    }

    //console.log("active count = " + activecount);

    if (erroractive) {
        if (activecount == 12) {
            let error = "\r\nYour order has now reached the maximum of 12 items, but you may still order more from the following categories: \r\n \r\nGrazing Boxes / Gourmet Guru Hire \r\nGourmet Guru Extras / Gourmet Guru Staff \r\n \r\nFor further assistance or special requests, please email info@gourmetguru.com.au";
            alert(error);
        }
    }
    else {
        if (activecount > 12) {
            document.getElementById("errorMaximum").style.display = "block";
            return false;
        }
        else if (activecount == 0) {
            document.getElementById("errorMaximum").style.display = "none";

            const elequery = document.querySelectorAll('.success');
            if (elequery.length > 0) {
                let ele = document.getElementById("errorUnder");
                ele.style.display = "none";
                return true;
            }
            else {
                let ele = document.getElementById("errorUnder");
                ele.style.display = "block";
                return false;
            }
        }
        else {
            document.getElementById("errorMaximum").style.display = "none";
            document.getElementById("errorUnder").style.display = "none";
            return true;
        }
    }
}

function ResultSummaryGen() {
    let summary = document.getElementById("resultlist");
    let newsummary = "";

    Array.from(document.getElementsByClassName("limit")).forEach(AddToSummary);

    function AddToSummary(item) {
        let ID = item.id.split('e')[1];
        let total = document.getElementById("FValue" + ID.toString());
        if (total.classList.contains("success") && !total.classList.contains("limitwdep") && !total.classList.contains("limitbdep")) {
            let amount = document.getElementById("JItem" + ID.toString()).value;
            let itemname = document.getElementById("name" + ID.toString()).textContent;
            let indivcost = document.getElementById("MValue" + ID.toString()).textContent;
    
            if (!total.classList.contains("limitwai") && !total.classList.contains("limitbar")) {
                newsummary += amount + " x " + itemname + "<br>" + total.textContent + " ($" + indivcost.split(" ")[1] + " each)<br><br>";
            }
            else {
                let classstr = "";
                let callhour = "";
                if (total.classList.contains("limitwai")) {
                    classstr = "Wait Staff";
                    callhour = ".refwdep";
                }
                else {
                    classstr = "Bar Staff";
                    callhour = ".refbdep";
                }

                let hournum = parseInt(document.querySelectorAll(callhour)[0].value);

                newsummary += amount + " x " + classstr + " (" + (3 + hournum) + " Hours)<br>$" + RetCalcHours(total, ID).toFixed(2) + " ($" + indivcost.split(" ")[1] + " x " + amount + " " + classstr + " x " + (3 + hournum) + " Hours)<br><br>";
            }
        }
    }

    if (newsummary != "") { 
        const delselect = document.querySelector('input[name="del"]:checked');
        let delval = delselect.id;
        const delname = document.querySelector(`label[for="${delval}"]`);

        newsummary += "1 x " + delname.innerHTML.split("-")[0] + "<br>" + "$" + delselect.value + ".00 ($" + delselect.value + ".00 each)<br><br>"
        let totalcost = parseFloat(delselect.value) + parseFloat(document.getElementById("totalcosttable").innerHTML.slice(1))
        newsummary += "<b>Total Cost<br>$" + totalcost.toFixed(2) + " (incl GST)</b>";
    }

    summary.innerHTML = newsummary;
}

function RetCalcHours(total, ID) {
    let treatedtotal = parseFloat(total.innerHTML.split("$")[1]);
    let secondarytotalsrc = document.getElementById("FValue" + (parseInt(ID) + 1).toString());
    if (secondarytotalsrc.innerHTML != "") {
        let treatedsecondary = parseFloat(secondarytotalsrc.innerHTML.split("$")[1]);
        return treatedtotal + treatedsecondary;
    }
    return treatedtotal;
}

function RunWaitBar(element, amount) {
    if (element.classList.contains("limitwai")) {
        if (amount.value > 0 && amount.value != "") {
            document.querySelectorAll('.refwdep')[0].disabled = false;
            element.classList.add("success");
        }
        else {
            document.querySelectorAll('.refwdep')[0].disabled = true;
            document.querySelectorAll('.refwdep')[0].value = "";
            document.querySelectorAll('.limitwdep')[0].innerHTML = "";
            element.classList.remove("success")
            document.querySelectorAll('.limitwdep')[0].classList.remove("success");
        }
    }
    else if (element.classList.contains("limitbar")) {
        if (amount.value > 0 && amount.value != "") {
            document.querySelectorAll('.refbdep')[0].disabled = false;
            element.classList.add("success");
        }
        else {
            document.querySelectorAll('.refbdep')[0].disabled = true;
            document.querySelectorAll('.refbdep')[0].value = "";
            document.querySelectorAll('.limitbdep')[0].innerHTML = "";
            element.classList.remove("success");
            document.querySelectorAll('.limitbdep')[0].classList.remove("success");
        }
    }
    else if (element.classList.contains("limitwdep") || element.classList.contains("limitbdep")) {
        if (amount.value > 0 && amount.value != "") {
            element.classList.add("success");
        }
        else {
            element.classList.remove("success");
        }
    }
}

function RunSushiRice(element) {
    let limitno;
    let limittext;

    let totalnumber = 0;

    if (element.classList.contains("limitsushi")) {
        limitno = 15;
        limittext = "refsushi";
    }
    else if (element.classList.contains("limitrice")) {
        limitno = 40;
        limittext = "refrice";
    }

    Array.from(document.getElementsByClassName(limittext)).forEach(CollectTotals);

    function CollectTotals(item) {
        item = item.value;
        if (item != "") {
            totalnumber += parseInt(item);
        }
    }

    if (totalnumber >= limitno) {
        CollectActive(limittext, true);
    }
    else {
        CollectActive(limittext, false);
    }
}

function CollectActive(limittext, success) {
    Array.from(document.getElementsByClassName(limittext)).forEach(IterByClass);

    function IterByClass(item) {
        let ID = item.id.split('m')[1];
        let element = document.getElementById("FValue" + ID.toString());

        if (item.value != "" || item.value != 0) {
            if (success) {
                element.classList.remove("error");
                element.classList.add("success");
            }
            else {
                element.classList.remove("success");
                element.classList.add("error");
            }
        }
        else {
            element.classList.remove("success");
            element.classList.remove("error");
        }
    }
}

function VerifyInitInputs() {
    let valid = true;
    let elelist = document.getElementsByClassName('initialinputs');

    for (var i = 0; i < elelist.length; i++) {
        if (elelist[i].style.backgroundColor == "lightcoral") {
            valid = false;
        }
    }

    if (!valid) {
        document.getElementById("errorInitial").style.display = "block";
    }
    else {
        document.getElementById("errorInitial").style.display = "none";
    }

    return valid
}


function Verify() {
    let countvalid = GetNumberActiveElements(false);
    let minerror = false;
    let valid = VerifyInitInputs();

    const queryerrors = document.querySelectorAll('.error');
    let err = document.getElementById("errorMinimum");
    if (queryerrors.length > 0) {
        err.style.display = "block";
        minerror = true;
    }
    else {
        err.style.display = "none";
    }

    if (countvalid && !minerror && valid) {
        document.getElementById("final").textContent = GenerateEmail();

        submit.disabled = false;
        let element = document.getElementById("submit");
        element.className = "button button1";
    }
    else {
        submit.disabled = true;
        let element = document.getElementById("submit");
        element.className = "unable";
    }
}


function GenerateEmail() {
    let splitdate = document.getElementById("dateDelivery").value.split("-");
    let emailstr = `Recipient: 
        \r${document.getElementById("fname").value} ${document.getElementById("lname").value}\r${document.getElementById("address").value}\r${document.getElementById("suburb").value}\r${document.getElementById("email").value}\r${document.getElementById("mobile").value}
        \r\nTime/date of delivery:
        \r${document.getElementById("timeDelivery").value} on ${splitdate[2]}-${splitdate[1]}-${splitdate[0]}
        \r\nOrder:
        \r${document.getElementById("resultlist").innerHTML.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?b>/gi, "")}
        \r\nNotes:
        \r${document.getElementById("numberGuest").value} x guests (approx.)
        \rType of event is a/an ${document.getElementById("event").value}
        \r${document.getElementById("note").value}`

    emailstr = emailstr.replaceAll("amp;", "");
    return emailstr;
}