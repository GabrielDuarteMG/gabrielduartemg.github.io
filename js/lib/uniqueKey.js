var uniqueKeyGen = (latitude, longitude, element) => {
    $("#" + element).html('Carregando...')
    const apiUrl = 'https://cors-anywhere.herokuapp.com/http://api.geonames.org/countryCodeJSON?lat=' + latitude + '&lng=' + longitude + '&username=gabriel';
    return fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
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
                uniq = uniq.split('').map(function (v) {
                    var chance = Math.round(Math.random());
                    return v = chance ? v.toUpperCase() : v.toLowerCase();
                }).join('');
                $("#" + element).html(uniq)
                return (uniq);
            });
        })
        .catch(function (err) {
            console.error('Error to generate.', err);
        });
}
var restokeyGen = () => {
    return 'xx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

var countryCheck = (contry) => { return (countrys.includes(contry.toUpperCase())) }

const validJson = (text) => {
    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
        return true
    else
        return false
}

var secondCheck = (char) => {
    char = char.toUpperCase();
    if (char == 'A')
        return true
    else if (char == 'B')
        return true
    else if (char == 'C')
        return true
    else if (char == 'D')
        return true
    else if (char == 'E')
        return true
    else if (char == 'F')
        return true
}