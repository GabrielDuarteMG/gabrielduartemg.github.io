document.addEventListener("DOMContentLoaded", function(event) {
    $(document).ready(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else { x.innerHTML = "Geolocation is not supported by this browser."; }

        $("#go").hide();
        $("#labelLoading").hide();
        $("#gerarEnviar").click(() => {
            generatePost();
            $('.toast').toast('show');
        })
        $("#copiarBtn").click(() => {

            let code = $("#codeLbl").text();
            copyToClipboard('#codeLbl');
        })
        $("#go").click(() => {
            openInNewTab('http://maps.google.com/?ll=' + documentLatitude + ',' + documentLongitude)
        })
        $('#usr').on('input', (e) => {
            documentLatitude = null;
            documentLongitude = null;
            document.getElementById("usr").style.borderColor = "#ddd";
            let inputText = $('#usr').val();
            if (inputText.length == 6) {
                $("#labelLoading").show();
                setTimeout(() => {
                    let NewinputText = $('#usr').val();
                    if (inputText == NewinputText) {
                        let firstCheck = NewinputText.charAt(0) + NewinputText.charAt(1);
                        if (countryCheck(firstCheck)) {
                            if (secondCheck(NewinputText.charAt(2)) + secondCheck(NewinputText.charAt(3))) {
                                getText('expressLoc/loc/' + NewinputText).then(response => {
                                    if (validJson(response)) {
                                        try {
                                            let locationJson = JSON.parse(response)
                                            if (locationJson.chave == NewinputText && sha256(NewinputText) == locationJson.secHash) {
                                                $("#go").show();
                                                document.getElementById("usr").style.borderColor = "#ddd";
                                                $("#labelLoading").hide();
                                                documentLatitude = locationJson.latitude;
                                                documentLongitude = locationJson.longitude;
                                            }
                                        } catch {
                                            $("#go").hide();
                                            document.getElementById("usr").style.borderColor = "red";
                                            $("#labelLoading").hide();
                                        }
                                    } else {
                                        $("#go").hide();
                                        document.getElementById("usr").style.borderColor = "red";
                                        $("#labelLoading").hide();
                                    }
                                });
                            } else {
                                $("#go").hide();
                                document.getElementById("usr").style.borderColor = "red";
                                $("#labelLoading").hide();
                            }
                        } else {
                            $("#go").hide();
                            document.getElementById("usr").style.borderColor = "red";
                            $("#labelLoading").hide();
                        }
                    } else {
                        $("#go").hide();
                        document.getElementById("usr").style.borderColor = "red";
                        $("#labelLoading").hide();
                    }
                }, 5000);
            } else if (inputText.length == 0)
                document.getElementById("usr").style.borderColor = "#ddd";
            else {
                $("#go").hide();
                $("#labelLoading").hide();
                document.getElementById("usr").style.borderColor = "red";
            }

        });

    });

    const generatePost = () => {
        var location = navigator.geolocation.watchPosition((position) => {

            let promise = new Promise(function(resolve, reject) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude
                $("#codeLbl").html('Carregando...')
                const apiUrl = 'https://cors-anywhere.herokuapp.com/http://api.geonames.org/countryCodeJSON?lat=' + latitude + '&lng=' + longitude + '&username=gabriel';
                fetch(apiUrl)
                    .then(function(response) {
                        response.json().then(function(data) {
                            var uniq = '';
                            uniq = uniq + data.countryCode;
                            if (latitude > -100 && latitude < -50)
                                uniq = uniq + 'A'
                            else if (latitude > -50 && latitude < 0)
                                uniq = uniq + 'B'
                            else if (latitude > 0 && latitude < 20)
                                uniq = uniq + 'C'
                            else if (latitude > 20 && latitude < 50)
                                uniq = uniq + 'D'
                            else if (latitude > 50 && latitude < 70)
                                uniq = uniq + 'E'
                            else if (latitude > 70)
                                uniq = uniq + 'F'
                            if (longitude > -100 && longitude < -50)
                                uniq = uniq + 'F'
                            else if (longitude > -50 && longitude < 0)
                                uniq = uniq + 'E'
                            else if (longitude > 0 && longitude < 20)
                                uniq = uniq + 'D'
                            else if (longitude > 20 && longitude < 50)
                                uniq = uniq + 'C'
                            else if (longitude > 50 && longitude < 70)
                                uniq = uniq + 'B'
                            else if (longitude > 70)
                                uniq = uniq + 'A'
                            uniq = uniq + restokeyGen()
                            uniq = uniq.split('').map(function(v) {
                                var chance = Math.round(Math.random());
                                return v = chance ? v.toUpperCase() : v.toLowerCase();
                            }).join('');
                            $("#codeLbl").html(uniq)
                            let objJson = { chave: uniq, latitude: position.coords.latitude, longitude: position.coords.longitude, secHash: sha256(uniq) }
                            postText('expressLoc/loc/' + uniq, JSON.stringify(objJson))
                            finishLocation(location);
                        });
                    })
                    .catch(function(err) {
                        console.error('Error to generate.', err);
                    });
            });
        }, (error) => {
            if (error.code == error.PERMISSION_DENIED) {
                alertify.error('Declined');
            }
        });
    }
});
let documentLatitude;
let documentLongitude;

const finishLocation = (location) => {
    setTimeout(() => navigator.geolocation.clearWatch(location), 500);
}
const receberLocalizacao = () => {
    $("#map").html(mapString(position.coords.latitude, position.coords.longitude))
}

var mapString = (latitude, longitude) => {
    return `<div id="fullMap"><div class="mapouter">
<div class="gmap_canvas">
<iframe width="449" height="254" id="gmap_canvas" src="https://maps.google.com/maps?q=${latitude}%2C${longitude}&t=k&z=15&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
</iframe><a href="https://www.embedgooglemap.net/blog/20-off-discount-for-elegant-themes-divi-sale-coupon-code-2019/">elegantthemes</a>
</div><style>.mapouter{position:relative;text-align:right;height:254px;width:449px;}.gmap_canvas {overflow:hidden;background:none!important;height:254px;width:449px;}</style>
</div></div>`
};

const copyToClipboard = (element) => {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

const openInNewTab = (url) => {
    var win = window.open(url, '_blank');
    win.focus();
}