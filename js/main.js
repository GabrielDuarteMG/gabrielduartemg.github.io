$(document).ready(event => {
    var validEmail = email => {
        return new Promise((resolve, reject) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(email).toLowerCase())) {
                resolve(true);
                return true;
            } else {
                resolve(false);
            }
        });
    };
    testInput = event =>
        new RegExp(/[a-zåäö ]/i).test(String.fromCharCode(event.which));
    $("#nameInput").bind("keypress", testInput);

    $("#sendBtn").click(() => {
        //Validation key Email f3eb15399a404281aa1b788b5cdc831c
        if (
            $("#nameInput").val() == "" ||
            $("#nameInput").val() == null ||
            $("#nameInput").val() == undefined
        ) {
            Notify("Please insert valid name.", null, null, "warning");
            return;
        }
        if (
            $("#form7").val() == "" ||
            $("#form7").val() == null ||
            $("#form7").val() == undefined
        ) {
            Notify("Please insert message.", null, null, "warning");
            return;
        }
        var response = grecaptcha.getResponse();
        if (response.length == 0) {
            Notify("Captcha error", null, null, "warning");
            return;
        } else {
            if (
                $("#emailInput").val() != "" ||
                $("#emailInput").val() != null ||
                $("#emailInput").val() != undefined
            ) {
                validEmail($("#emailInput").val()).then(res => {
                    if (res == true) {
                        let bodyRequest = JSON.stringify({
                            subject: "Contato - Portifolio",
                            emailContact: $("#emailInput").val(),
                            text: `${$("#nameInput").val()}\n\n${$("#form7").val()}`
                        });
                        fetch("https://fastmailservice.herokuapp.com/", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "text/plain",
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Request-Method': 'POST',
                                    'Access-Control-Allow-Headers': 'Content-Type'
                                },
                                body: bodyRequest
                            })
                            .then(response => {
                                if (response.status == 200) {
                                    $("#emailInput").val("")
                                    $("#form7").val("")
                                    $("#nameInput").val("")
                                    grecaptcha.reset()
                                    Notify("Form submitted successfully", null, null, "sucess");
                                } else if (response.status == 400) {
                                    Notify(response.statusText, null, null, "warning");
                                } else {
                                    Notify(response.statusText, null, null, "danger");
                                }
                            })

                    } else {
                        Notify("Please insert valid email", null, null, "warning");
                    }
                });

            }
        }

    });
    const URL_TO_FETCH = 'https://api.github.com/repos/gabrielduartemg/gabrielduartemg.github.io/commits';
    fetch(URL_TO_FETCH, {
            method: 'get' // opcional 
        })
        .then(function(response) {
            return response.json();
        }).then(data => {
            $('#lastCommit').text(data[0].commit.message)
            $('#lastCommit').attr("href", data[0].html_url)

        })
        .catch(function(err) { console.error(err); });
});