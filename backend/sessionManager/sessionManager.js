function getUserSession(req)
{
    return req.session.user || null;
}

function getBankSession(req)
{
    return req.session.bank || null;
}

function getSession(req)
{
    return req.session;
}
module.exports = {getUserSession,getBankSession,getSession};