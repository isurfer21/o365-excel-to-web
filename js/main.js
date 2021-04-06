// @file main.js

String.prototype.graft = function() {
    let self = this;
    if (arguments.length == 1 && typeof arguments[0] == 'object' && !Array.isArray(arguments[0])) {
        for (let arg in arguments[0]) {
            self = self.replace(new RegExp('\\[' + arg + '\\]', 'g'), arguments[0][arg]);
        }
    } else {
        for (let i = 0; i < arguments.length; i++) {
            self = self.replace('[' + i + ']', arguments[i]);
        }
    }
    return self;
};

String.prototype.toDateTimeObject = function() {
    let self = this;
        dtStr = self.split(/\.|Z/),
        dtList = (dtStr.length > 0) ? dtStr[0].split(/ |T/) : [],
        dateStr = (dtList.length > 0) ? dtList[0].trim() : null,
        timeStr = (dtList.length > 1) ? dtList[1].trim() : null,
        tarikh = (!!dateStr) ? dateStr.split(/-|\//) : null,
        samay = (!!timeStr) ? timeStr.split(':') : null,
        dateObj = {
            Y: parseInt(tarikh[0]),
            M: parseInt(tarikh[1]),
            D: parseInt(tarikh[2]),
            h: parseInt(samay[0]),
            m: parseInt(samay[1]),
            s: parseInt(samay[2]),
        };
    return dateObj;
};

String.prototype.inDateTimePattern = function() {
    let self = this,
        pattern = arguments[0],
        padding = arguments[1],
        dtObj = self.toDateTimeObject();
    for (let i in dtObj) {
        dtObj[i] = (!!padding && dtObj[i] < 10) ? '0' + dtObj[i] : dtObj[i];
    }
    pattern = pattern.graft(dtObj);
    return pattern;
};

class Dom {
    constructor() {
        console.log('Dom');
    }
    static whenReady(method) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            method();
        } else {
            document.addEventListener('DOMContentLoaded', method);
        }
    }
    static urlPath() {
        let list = location.href.split('?'),
            path = list[0].substr(0, list[0].lastIndexOf('/'));
        return path;
    }
}

class Mitigator {
    constructor() {
        console.log('Mitigator');
    }
    initialize(errObj, status, response) {
        console.log('Mitigator.initialize', errObj, status, response);
    }
}

class Communicator {
    constructor() {
        console.log('Communicator');
    }
    tunnel(cargo) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', cargo.service, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                cargo.success(xhr.responseText);
            } else {
                cargo.failure(xhr, xhr.statusText, xhr.responseText);
            }
        };
        xhr.onabort = function() {
            cargo.failure(xhr, xhr.statusText, xhr.responseText);
        };
        xhr.onerror = function() {
            cargo.failure(xhr, xhr.statusText, xhr.responseText);
        };
        xhr.ontimeout = function() {
            cargo.failure(xhr, xhr.statusText, xhr.responseText);
        };
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
    }
}

class Renderer {
    constructor() {
        console.log('Renderer');
        this.realm = null;
    }
    tabulate(data) {
        if (!!this.realm) {
            this.realm.grind(data);
            let dataObject = [];
            let hotElement = document.querySelector('#hot');
            let hotElementContainer = hotElement.parentNode;
            let hotSettings = {
                data: this.realm.column.table,
                colHeaders: this.realm.column.title,
                columns: this.realm.column.property,
                stretchH: 'all',
                width: '100%',
                autoWrapRow: true,
                height: '100%',
                manualRowResize: true,
                manualColumnResize: true,
                rowHeaders: true,
                manualRowMove: true,
                manualColumnMove: true,
                contextMenu: false,
                filters: true,
                dropdownMenu: true,
                exportFile: true,
                licenseKey: 'non-commercial-and-evaluation'
            };
            let hot = new Handsontable(hotElement, hotSettings);
        }
    }
    initialize(data) {
        console.log('Renderer.initialize');
        this.tabulate(data);
    }
}

class Reporter {
    constructor(ws) {
        console.log('Reporter');
        this.service = ws;
        this.column = {
            table: [],
            title: [],
            property: []
        };
    }
    format(d) {
        if (typeof d == 'object') {
            d = d.date.inDateTimePattern('[D]/[M]/[Y] [h]:[m]:[s]', true);
        }
        return d;
    }
    setColTitle(t) {
        this.column.title = t;
    }
    setColProperty(t) {
        this.column.property = [];
        for (let i = 0; i < t.length; i++) {
            let o = {
                data: t[i],
                type: (!!t[i].toLowerCase().match(/date|time/)) ? 'date' : 'text'
            };
            this.column.property.push(o);
        }
    }
    setTableData(o) {
        this.column.table = o;
    }
    grind(data) {
        let o = [];
        let d = JSON.parse(data);
        let t = d[3];
        for (let i = 4; i < d.length; i++) {
            let r = {};
            for (let j = 0; j < d.length; j++) {
                r[t[j]] = this.format(d[i][j]);
            }
            o.push(r);
        }
        this.setColTitle(t);
        this.setColProperty(t);
        this.setTableData(o);
    }
}

Dom.whenReady(() => {
    let usp = new URLSearchParams(window.location.search);

    if (!!usp.get('ws')) {
        let wsUrl = Dom.urlPath() + '/ws/' + usp.get('ws');
        let reporter = new Reporter(wsUrl);

        let communicator = new Communicator();
        communicator.tunnel({
            service: reporter.service,
            success: (d) => {
                let renderer = new Renderer();
                renderer.realm = reporter;
                renderer.initialize(d)
            },
            failure: (e, s, r) => {
                let mitigator = new Mitigator();
                mitigator.initialize(e, s, r)
            }
        });
    } else {
        alert('Missing worksheet (ws) parameter in URL!');
    }
});