const faunadb = window.faunadb;
const q = faunadb.query;
const client = new faunadb.Client({
    // secret: 'fnAFHyaWLoACUAG3qDdi7lm6Bk13XjeMlzLhR88x',
    secret: 'fnAFHzn9-IAA0ficEfY3tizVHPGpzQ3CI0hl-CRd',
    domain: 'db.fauna.com', // Adjust if you are using Region Groups
});

function setupFauna() {
    client.query(
        q.ToDate('2018-06-06')
    )
    .then(function (res) { console.log('Result:', res) })
    .catch(function (err) { console.log('Error:', err) })
}

async function faunaAddSentence(sentence) {
    let newSentence = JSON.parse(JSON.stringify(sentence));
    return new Promise(resolve => {
        client.query(
            q.Create(
                q.Collection('sentence'),
                { data: newSentence }
            )
        )
        .then(ret => {
            return resolve(ret);
        })
        .catch(err => {
            return resolve(err);
        })
    })
}

async function faunaEditSentence(sentence) {
    let id = sentence.dbId;
    return new Promise(resolve => {
        client.query(
            q.Update(
                q.Ref(
                    q.Collection('sentence'),
                    id
                ),
                {
                    data: sentence
                }
            )
        )
        .then(ret => {
            return resolve(ret);
        })
        .catch(err => {
            return resolve(err);
        })
    })
}

async function faunaGetSingleSentence(dbId) {
    return new Promise(resolve => {
        client.query(
            q.Get(
                q.Ref(
                    q.Collection('sentence'),
                    dbId
                )
            )
        )
        .then(ret => {
            return resolve(ret);
        })
        .catch(err => {
            return resolve(err);
        })
    })
}

async function faunaGetSentencesByCategory(category, loadAmount) {
    return new Promise(resolve => {
        client.query(
            q.Map(
                q.Paginate(
                    q.Match(
                        q.Index('search-by-category'),
                        category
                    ),
                    { size: parseInt(loadAmount) }
                ),
                q.Lambda(
                    ["ref"],
                    q.Get(q.Var("ref"))
                )
            )
        )
        .then((ret) => {
            return resolve(ret);
        })
        .catch((err) => {
            return resolve(err);
        })
    })
}


async function faunaGetAllSentences() {
    return new Promise(resolve => {
        client.query(
            q.Paginate(
                q.Documents(
                    q.Collection('sentence')
                ),
                { size: 1000 }
            )
        )
        .then((ret) => {
            return resolve(ret);
        })
        .catch((err) => {
            return resolve(err);
        })
    })
}

async function faunaFindItemByValue(value) {
    return new Promise(resolve => {
        client.query(
            q.Get(
                q.Match(q.Index('search-by-category'), value)
            )
        )
        .then((ret) => {
            return resolve(ret);
        })
        .catch((err) => {
            return resolve(err);
        })
    })
}

async function faunaDeleteAdminEvent(startISOstr, endISOstr) {
    return new Promise(resolve => {
        client.query(
            q.Map(
                q.Paginate(
                    q.Range(
                        q.Match(q.Index('eventstart-outline')), 
                        q.Time(startISOstr), 
                        q.Time(endISOstr)
                    ),
                    { size: 1000 }
                ),
                q.Lambda(
                    ["start", "ref"],
                    q.Delete(q.Var("ref"))
                )
            )
        )
        .then(function (res) { 
            return resolve(res.data) 
        })
        .catch(function (err) { return resolve({}) })
    });
}

async function faunaBookEvent(event) {
    event.start = q.Time(event.start);
    event.end = q.Time(event.end);
    return new Promise(resolve => {
        client.query(
            q.Create(
                q.Collection('events-booked'),
                { data: event }
            )
        )
        .then(ret => {
            return resolve(ret);
        })
        .catch(err => {
            return resolve(err);
        })
    })
}

async function faunaAddEvents(events, prevEventsLen, startISOstr, endISOstr) {
    let newEvents = JSON.parse(JSON.stringify(events));
    newEvents.map(event => {
        event.start = q.Time(event.start);
        event.end = q.Time(event.end);
    })
    return new Promise(resolve => {
        faunaDeleteEventsCurrentMonth(startISOstr, endISOstr, prevEventsLen)
        .then(res => {
            client.query(
                q.Map(
                    newEvents,
                    q.Lambda(
                        'data',
                        q.Create(
                            q.Collection('weekly-schedule'),
                            { data: q.Var('data') },
                        )
                    )
                )
            )
            .then(ret => {
                return resolve(ret);
            })
            .catch(err => {
                return resolve(err);
            })
            
        })
    })
}

async function faunaDeleteEventsCurrentMonth(startISOstr, endISOstr, prevEventsLen) {
    return new Promise(resolve => {
        client.query(
            q.Map(
                q.Paginate(
                    q.Range(
                        q.Match(q.Index('eventstart-outline')), 
                        q.Time(startISOstr), 
                        q.Time(endISOstr)
                    ),
                    { size: 1000 }
                ),
                q.Lambda(
                    ["start", "ref"],
                    q.Delete(q.Var("ref"))
                )
            )
        )
        .then(function (res) { 
            return resolve(res.data);
        })
        .catch(function (err) { return resolve({}) })
    })
}

// 获取一个月之内的课程信息
async function faunaGetEventsCurrentMonth(startISOstr, endISOstr) {
    return new Promise(resolve => {
        client.query(
            q.Map(
                q.Paginate(
                    q.Range(
                        q.Match(q.Index('eventstart-outline')), 
                        q.Time(startISOstr), 
                        q.Time(endISOstr)
                    ),
                    { size: 1000 }
                ),
                q.Lambda(
                    ["start", "ref"],
                    q.Get(q.Var("ref"))
                )
            )
        )
        .then(function (res) { 
            return resolve(res.data) 
        })
        .catch(function (err) { return resolve({}) })
    })
}

// 获取一个月之内,已预定的课程信息
async function faunaGetBookedEventsCurrentMonth(startISOstr, endISOstr) {
    return new Promise(resolve => {
        client.query(
            q.Map(
                q.Paginate(
                    q.Range(
                        q.Match(q.Index('eventstart-booked')), 
                        q.Time(startISOstr), 
                        q.Time(endISOstr)
                    ),
                    { size: 1000 }
                ),
                q.Lambda(
                    ["start", "ref"],
                    q.Get(q.Var("ref"))
                )
            )
        )
        .then(function (res) { return resolve(res.data) })
        .catch(function (err) { return resolve({}) })
    })
}

async function faunaAddTutor(tutor) {
    let res = await client.query(
        q.Create(
            q.Collection('tutor'),
            { data: tutor }
        )
    )
    return res;
}

async function faunaAddStudent(student) {
    return new Promise(resolve => {
        client.query(
            q.Create(
                q.Collection('student'),
                { data: student }
            )
        )
        .then(function (res) { return resolve(res.data) })
        .catch(function (err) { return resolve({}) })
    })
}

async function saveAdminSetting(slotMinMax, unavailableTS, hiddenD) {
    let newSetting =  {
          "slotMinMax": slotMinMax,
          "unavailableTimeSlots": unavailableTS,
          "hiddenDays": hiddenD
    };
    return new Promise(resolve => {
        client.query(
            q.Update(
                q.Ref(q.Collection("admin-setting"), "340582055893008978"),
                {
                    data: newSetting
                },
            )
        )
        .then((ret) => {
            return resolve(ret);
        })
        .catch((err) => console.error(
            'Error: [%s] %s: %s',
            err.name,
            err.message,
            err.errors()[0].description,
            alert("网络异常，请重新加载页面")
        ))
    })
}

async function getAdminSetting() {
    return new Promise(resolve => {
        client.query(
            q.Get(
                q.Ref(q.Collection("admin-setting"), "340582055893008978")
            )
        )
        .then((ret) => {
            return resolve(ret);
        })
        .catch((err) => console.error(
            'Error: [%s] %s: %s',
            err.name,
            err.message,
            err.errors()[0].description,
        ))
    })
}

async function faunaGetEvents() {
    let events = await client.query(
        q.Map(
            q.Paginate(
                q.Documents(
                    q.Collection('weekly-schedule'),
                    { size: 1000 }
                )
            ),
            q.Lambda(x => q.Get(x))
        )
    )
    return events.data;
}

async function faunaGetTutors() {
    let events = await client.query(
        q.Map(
            q.Paginate(q.Documents(q.Collection('tutor'))),
            q.Lambda(x => q.Get(x))
        )
    )
    return events.data;
}

async function faunaDeleteEvent(refid) {
    let res = await client.query(
        q.Delete(q.Ref(q.Collection('events-booked'), refid))
    )
    return res;
}

async function faunaFindItemByValue(collection, key, value) {
    return new Promise(resolve => {
        client.query(
            q.CreateIndex({
                name: "search-by-" + key,
                source: q.Collection(collection),
                terms: [ { field: ["data", key] } ],
                unique: true // id are unique
            })
        )
        .then((ret) => {
            client.query(
                q.Get(
                    q.Match(q.Index('search-by-' + key), value)
                )
            )
            .then((ret) => {
                return resolve(ret);
            })
            .catch(ret => {
                return resolve({})
            })
        })
        .catch((err) => {
            client.query(
                q.Get(
                    q.Match(q.Index('search-by-' + key), value)
                )
            )
            .then((ret) => {
                return resolve(ret);
            })
            .catch(ret => {
                return resolve({})
            })
        })
    })
}
