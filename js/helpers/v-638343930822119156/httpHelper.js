const RequestWmAsync = (endpoint, type = 'GET', data = '') => {
    return $.ajax({
            type: type,
            url: `${location.pathname}/${endpoint}`,
            contentType: "application/json; charset=utf-8",
            data: data,
            datatype:'json',	
        });
}

const RequestApiEtkAsync = (endpoint, data, type = 'POST', headersValues = {}) => {
    return $.ajax({
        url: `${API_URL}/${endpoint}`,
        cache: false,
        type: type,
        tryCount : 0,
        retryLimit : 3,
        timeout: 10000, //3 second timeout
        data: JSON.stringify(data),
        datatype:'json',
        contentType: "application/json; charset=utf-8",
        headers: headersValues
    })
}

const RequestApiBotAsync = (endpoint, data, type = 'POST', headersValues = {}) => {
    return $.ajax({
        url: `${API_BOT_URL}/${endpoint}`,
        cache: false,
        type: type,
        tryCount : 0,
        retryLimit : 3,
        data: JSON.stringify(data),
        datatype:'json',
        contentType: "application/json; charset=utf-8",
        headers: headersValues
    })
}